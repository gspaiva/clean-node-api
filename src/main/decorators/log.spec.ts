import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface sutTypes {
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepositoryStub
  sut: LogControllerDecorator
}

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = {
      body: {
        email: 'any_email@mail.com',
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      },
      statusCode: 200
    }
    return await new Promise(resolve => resolve(httpResponse))
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
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: {
        email: 'any_email@mail.com',
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      },
      statusCode: 200
    })
  })

  test('Should call LogErrorRepository with a stack', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(serverError(fakeError))))

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
