// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from 'App/Models/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import axios from 'axios'

export default class ApplicationsController {
  public async index ({ request, response }) {
    const applicationSchema = schema.create({
      firstName: schema.string({ trim: true, escape: true }),
      lastName: schema.string({ trim: true, escape: true }),
      email: schema.string({}, [
        rules.email(),
      ]),
      username: schema.string({ trim: true, escape: true }),
      years: schema.number([
        rules.range(15, 100),
      ]),
      link: schema.string({}, [
        rules.url({
          allowedHosts: ['vk.com'],
        }),
      ]),
    })
    const payload = await request.validate({ schema: applicationSchema,
      messages: {
        required: 'Поле {{ field }} объязательно для заполнения.',
        'years.range': 'Вам должно быть больше 14 лет.',
        'link.url': 'Разрешены ссылки только на vk.com',
      },
    })
    const application = await Application.create(payload)
    if (!application) {
      Logger.error('Произошла ошибка при добавлении в базу (запрос лейбл).')
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    Logger.info('Новый запрос на лейбл.')
    await axios.get(encodeURI(`https://api.telegram.org/bot1794482115:AAH6_8n3dTG8Xod_DYuMpuK9UVqFOykxj8Q/sendMessage?chat_id=-1001265810174&text=
    Имя: ${payload.firstName}\nФамилия: ${payload.lastName}\ne-mail:${payload.email}\nusername:${payload.username}\nЛет:${payload.years}\nlink:${payload.link}`)).catch(_ => {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    })
    return response.redirect().toRoute('success')
  }
}
