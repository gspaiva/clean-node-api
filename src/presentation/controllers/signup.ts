import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/bad-request'
import { HttpResponse, HttpRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
