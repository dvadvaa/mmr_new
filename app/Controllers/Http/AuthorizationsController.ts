// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class AuthorizationsController {
  public async index ({ request, response, auth, session }) {
    const authSchema = schema.create({
      username: schema.string({}),
      password: schema.string({}, [
        rules.minLength(5),
      ]),
    })
    const payload = await request.validate({
      schema: authSchema,
    })
    if (!payload) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    try {
      await auth.use('web').attempt(payload.username, payload.password)
      response.redirect('/dashboard')
    } catch (e) {
      session.flash('error', 'Неверный логин или пароль.')
      response.redirect().back()
    }
  }
}
