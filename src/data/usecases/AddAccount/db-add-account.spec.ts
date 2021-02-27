import { DBAddAccount } from './db-add-account';

const makeSut = (encryptStub):DBAddAccount => {
  const sut = new DBAddAccount(encryptStub);
  return sut;
};

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    class EncryperStub {
      encrypt(value:string): Promise<string> {
        return new Promise((resolve) => resolve('hashedValue'));
      }
    }
    const encryptStub = new EncryperStub();
    const sut = makeSut(encryptStub);
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
