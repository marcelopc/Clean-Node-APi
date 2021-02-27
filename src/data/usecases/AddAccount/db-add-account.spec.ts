import { DBAddAccount } from './db-add-account';
import { Encrypter } from '../../protocols/encrypter';

interface SutTypes {
  sut:DBAddAccount,
  encryptStub: Encrypter
}

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
  const sut = new DBAddAccount(encryptStub);

  return { sut, encryptStub };
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
});
