import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async addAccount (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollections('accounts')
    const result = await accountCollection.insertOne(accountData)
    const accountInserted = MongoHelper.map(result.ops[0])
    return accountInserted
  }
}
