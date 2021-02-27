import { DBAddAccount } from './db-add-account';
import { Encrypter } from '../../protocols/encrypter';

interface SutTypes {
  sut:DBAddAccount,
  encryptStub: Encrypter
}

const makeSut = ():SutTypes => {
  class EncryperStub {
    encrypt(value:string): Promise<string> {
      return new Promise((resolve) => resolve('hashedValue'));
    }
  }

  const encryptStub = new EncryperStub();
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
