import { DBAddAccount } from './db-add-account';
import {
  Encrypter, AddAccountModel, AccountModel, AddAccountRepository,
} from './db-add-account-protocols';

interface SutTypes {
  sut:DBAddAccount,
  encryptStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashedValue',
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypter = ():Encrypter => {
  class EncryperStub implements Encrypter {
    encrypt(value:string): Promise<string> {
      return new Promise((resolve) => resolve('hashedValue'));
    }
  }

  return new EncryperStub();
};

const makeSut = ():SutTypes => {
  const encryptStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(encryptStub, addAccountRepositoryStub);

  return { sut, encryptStub, addAccountRepositoryStub };
};

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(AccountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encryptStub } = makeSut();
    jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = sut.add(AccountData);
    await expect(promise).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(AccountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashedValue',
    });
  });

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = sut.add(AccountData);
    await expect(promise).rejects.toThrow();
  });

  test('should return if on success', async () => {
    const { sut } = makeSut();
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const account = await sut.add(AccountData);
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashedValue',
    });
  });
});
