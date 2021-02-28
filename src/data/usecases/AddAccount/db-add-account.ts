import {
  AddAccount, AddAccountModel, AccountModel,
  Encrypter, AddAccountRepository,
} from './db-add-account-protocols';

export class DBAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    private readonly addAccountRepository: AddAccountRepository;

    constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
      this.encrypter = encrypter;
      this.addAccountRepository = addAccountRepository;
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const hashedPassaword = await this.encrypter.encrypt(accountData.password);
      const accountHashedPw = Object.assign({}, accountData, { password: hashedPassaword });
      const account = await this.addAccountRepository.add(accountHashedPw);
      return new Promise((resolve) => resolve(account));
    }
}
