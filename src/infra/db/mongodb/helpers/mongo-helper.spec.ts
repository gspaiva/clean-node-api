import { MongoHelper as sut } from './mongo-helper'

describe('Mongo helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongo db is down', async () => {
    let accountCollection = sut.getCollections('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = sut.getCollections('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
