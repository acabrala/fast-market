import { IHttpRequest, IHttpResponse, IController, IEmailValidator } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helpers'
import { MissingParamError, InvalidParamError } from '../errors'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse | undefined {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation', 'phone']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
