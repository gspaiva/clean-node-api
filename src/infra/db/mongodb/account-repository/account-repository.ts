import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async addAccount (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollections('accounts')
    const result = await accountCollection.insertOne(accountData)
    const accountInsertedResult = result.ops[0]
    const { _id, ...accountWithoutId } = accountInsertedResult
    const accountInserted = Object.assign({}, accountWithoutId, { id: _id })
    return accountInserted
  }
}
