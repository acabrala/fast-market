import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/helpers-http'

export class SignUpController {
  handle (httpRequest: IHttpRequest): IHttpResponse | undefined {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation', 'phone']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
