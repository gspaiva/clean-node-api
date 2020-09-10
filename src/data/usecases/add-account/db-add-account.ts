import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async addAccount (accountData: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.addAccount(Object.assign({}, accountData, { password: passwordHashed }))
    return await new Promise(resolve => resolve(account))
  }
}
