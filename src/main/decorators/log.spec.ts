import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface sutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
}

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = {
      statusCode: 200,
      body: {
        name: 'Gabriel'
      }
    }
    return await new Promise(resolve => resolve(httpResponse))
  }
}

const makeController = (): sutTypes => {
  const controllerStub = new ControllerStub()
  return {
    controllerStub: controllerStub,
    sut: new LogControllerDecorator(controllerStub)
  }
}

describe('LogControllerDecorator tests', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeController()
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
})