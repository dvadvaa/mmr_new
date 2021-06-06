// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/users'
import Logger from '@ioc:Adonis/Core/Logger'
import Invite from "App/Models/Invite";

export default class AuthorizationsController {
  public async index ({ request, response, auth, session }) {
    const authSchema = schema.create({
      username: schema.string({}, [
        rules.minLength(5),
      ]),
      password: schema.string({}, [
        rules.minLength(5),
      ]),
    })
    const payload = await request.validate({
      schema: authSchema,
      messages: {
        'username.minLength': 'Логин должен быть больше 4 символов',
        'password.minLength': 'Пароль должен быть больше 4 символов',
      },
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
  public async register ({request, response, auth, session}) {
    const registerSchema = schema.create({
      username: schema.string({}, [
        rules.unique({ table: 'users', column: 'username' }),
        rules.minLength(5),
      ]),
      password: schema.string({}, [
        rules.minLength(5),
      ]),
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      invite: schema.string({}, [
        rules.exists({ table: 'invites', column: 'code' }),
      ]),
    })
    const payload = await request.validate({
      schema: registerSchema,
      messages: {
        required: 'The {{ field }} is required to create a new account',
        'username.unique': 'Данный логин недоступен',
        'email.unique': 'Данный email недоступен',
        'username.minLength': 'Логин должен быть больше 4 символов',
        'password.minLength': 'Пароль должен быть больше 4 символов',
        'invite.exists': 'Введен неверный инвайт-код',
      },
    })
    if (!payload) {
      Logger.error('Произошла ошибка при регистрации пользователя.')
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const user = await User.findBy('username', payload.username)
    if (user) {
      return response.badRequest('Пользователь с таким логином уже зарегистрирован.')
    }
    const invite = await Invite.findBy('code', payload.invite)
    if (invite!.used) {
      return session.flash('error', 'Инвайт-код уже активирован')
    }
    delete payload.invite
    payload.status = 'user'
    payload.invited_by = invite!.author_id

    let newUser = await User.create(payload)

    invite!.used = true
    invite!.user_id = newUser.id
    await invite!.save()
    await auth.use('web').attempt(payload.username, payload.password)
    response.redirect('/dashboard')
  }
}
