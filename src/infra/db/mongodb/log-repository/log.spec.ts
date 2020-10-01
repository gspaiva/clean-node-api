import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import LogMongoRepository from './log'

describe('Log Mongo Repository', () => {
  let errorCollections: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollections = await MongoHelper.getCollections('errors')
    await errorCollections.deleteMany({})
  })

  test('Should save a log error', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollections.countDocuments()
    expect(count).toBe(1)
  })
})
