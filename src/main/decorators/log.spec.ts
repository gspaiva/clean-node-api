import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { serverError, ok } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface sutTypes {
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepositoryStub
  sut: LogControllerDecorator
}

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(ok(makeFakeAccount())))
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return await new Promise(resolve => resolve())
  }
}

const makeLogErrorRepository = (): LogErrorRepository => {
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  return new ControllerStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'id',
  email: 'any_email@mail.com',
  name: 'any name',
  password: 'any_password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeSut = (): sutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  return {
    controllerStub: controllerStub,
    logErrorRepositoryStub: logErrorRepositoryStub,
    sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  }
}

describe('LogControllerDecorator tests', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(httpResponse.body))
  })

  test('Should call LogErrorRepository with a stack', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
