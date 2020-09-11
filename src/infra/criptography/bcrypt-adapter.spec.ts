import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BCryptAdapter infra', () => {
  test('BCryptAdapter should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('BCryptAdapter should return hash on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toEqual('hash')
  })
})
