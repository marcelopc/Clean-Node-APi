import { DBAddAccount } from '../../data/usecases/AddAccount/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator';

export const makeSignUpController = ():SignUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountMongoRepository);
  return new SignUpController(emailValidator, dbAddAccount);
};
