// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/users'
import Release from 'App/Models/Release'

export default class AdminsController {
  public async registerUser ({ request, response }) {
    const registrationSchema = schema.create({
      username: schema.string(),
      password: schema.string(),
      email: schema.string({}, [
        rules.email(),
      ]),
      status: schema.string(),
    })
    const payload = await request.validate({ schema: registrationSchema})
    if (!payload) {
      Logger.error('Произошла ошибка при регистрации пользователя.')
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const user = await User.findBy('username', payload.username)
    if (user) {
      return response.badRequest('Пользователь с таким логином уже зарегистрирован.')
    }
    await User.create(payload)
    return response.redirect().toRoute('admin.newUser')
  }
  public async getAllReleases ({ view }) {
    const data = await Release
      .query()
      // .where('user_id', '=', auth.user.id)
      .orderBy('created_at', 'desc')
    return view.render('admin/releases', {data: data.length ? data : null})
  }
  public async getAllUsers ({ view }) {
    const data = await User
      .query()
      // .where('user_id', '=', auth.user.id)
      .orderBy('created_at', 'desc')
    return view.render('admin/users', {data: data.length ? data : null})
  }
  public async setMoneyUser ({ params, response, request }) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const user = await User.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден. #2'))
    if (!user) {
      return response.badRequest('Пользователь не найден.')
    }
    const Schema = schema.create({
      balance: schema.number(),
    })
    const payload = await request.validate({ schema: Schema})
    if (!payload) {
      return response.badRequest('Укажите сумму.')
    }
    user.balance = payload.balance
    await user.save()
    return response.redirect().toRoute('admin.users')
  }
  public async deleteUser ({ params, response }) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const user = await User.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден.'))
    if (!user) {
      return response.badRequest('Пользователь не найден.')
    }
    await user.delete()
    return response.redirect().toRoute('admin.users')
  }
  public async editUserData ({ params, response, request }) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const user = await User.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден.'))
    if (!user) {
      return response.badRequest('Пользователь не найден.')
    }
    const Schema = schema.create({
      username: schema.string.optional(),
      password: schema.string.optional(),
      email: schema.string.optional(),
      status: schema.string.optional(),
    })
    const payload = await request.validate({ schema: Schema})
    console.log(payload)
    if (!payload) {
      return response.badRequest('Укажите новый пароль пользователя.')
    }
    if (payload.username && payload.password && payload.email && payload.status) {
      user.username = payload.username
      user.password = payload.password
      user.email = payload.email
      user.status = payload.status
    } else if (payload.username) {
      user.username = payload.username
    } else if (payload.password) {
      user.password = payload.password
    } else if (payload.email) {
      user.email = payload.email
    } else if (payload.status) {
      user.status = payload.status
    } else {
      return response.redirect().toRoute('admin.users')
    }
    await user.save()
    return response.redirect().toRoute('admin.users')
  }

  public async deleteRelease ({ params, response }) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const release = await Release.findOrFail(params.id).catch(_ => response.badRequest('Релиз не найден.'))
    if (!release) {
      return response.badRequest('Релиз не найден.')
    }
    await release.delete()
    return response.redirect().toRoute('admin.releases')
  }
  public async acceptRelease ({params, response}) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const release = await Release.findOrFail(params.id).catch(_ => {
      return response.badRequest('Релиз не найден.')
    })
    if (!release) {
      return response.badRequest('Релиз не найден.')
    }
    release.accepted = 1
    await release.save()
    return response.redirect().toRoute('admin.releases')
  }
  public async declineRelease ({params, response, request}) {
    if (!params.id) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    const release = await Release.findOrFail(params.id).catch(_ => response.badRequest('Релиз не найден.'))
    if (!release) {
      return response.badRequest('Релиз не найден.')
    }
    const Schema = schema.create({
      reason: schema.string({}),
    })
    const payload = await request.validate({ schema: Schema})
    if (!payload.reason) {
      release.reason = '-'
      release.accepted = 2
      await release.save()
      return response.redirect().toRoute('admin.releases')
    }
    release.accepted = 2
    release.reason = payload.reason
    await release.save().catch(err => console.log(err))
    return response.redirect().toRoute('admin.releases')
  }
}
