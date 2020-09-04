import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/bad-request'

export class SignUpController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('Missing param: name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('Missing param: email'))
    }
  }
}
