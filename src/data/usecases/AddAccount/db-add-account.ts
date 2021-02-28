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
      const hasheddPassaword = await this.encrypter.encrypt(accountData.password);
      const account = Object.assign({}, accountData, { password: hasheddPassaword });
      await this.addAccountRepository.add(account);
      return new Promise((resolve) => resolve(null));
    }
}
