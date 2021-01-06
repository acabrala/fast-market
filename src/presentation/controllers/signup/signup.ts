import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { MissingParamError, InvalidParamError } from '../../errors'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount
  constructor (emailValidator: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse | undefined> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation', 'phone']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation, phone } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
        phone
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
