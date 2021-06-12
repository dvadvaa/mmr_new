// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Release from 'App/Models/Release'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
// import User from "App/Models/users";
import Database from '@ioc:Adonis/Lucid/Database'

export default class DashboardController {
  public async getReleases ({ view, auth }) {
    await auth.use('web').authenticate()
    const releasesByInvUser = await Database
      .from('releases')
      .whereIn(
        'user_id',
        Database
          .from('users')
          .select('id')
          .where('invited_by', '=', auth.user.id)
      ).orderBy('created_at', 'asc')

    const releasesByUser = await Database
      .from('releases')
      .where('user_id', '=', auth.user.id)
      .orderBy('created_at', 'asc')

    return view.render('dashboard/releases', {data: [...releasesByUser, ...releasesByInvUser]})
  }
  public async createRelease ({ request, response, auth }) {
    const releaseSchema = schema.create({
      name: schema.string({}, [
        rules.minLength(1),
      ]),
      main_artist: schema.string({}, [
        rules.minLength(2),
      ]),
      another_artists: schema.string.optional(),
      version: schema.string.optional(),
      genre: schema.enum(
        ['hip-hop', 'pop', 'rock'] as const
      ),
      explicit: schema.boolean(),
      author: schema.string(),
      date: schema.string(),
      link: schema.string({}, [
        rules.url({}),
      ]),
      label: schema.string(),
      type: schema.enum(
        ['audio', 'video'] as const
      ),
    })
    const payload = await request.validate({ schema: releaseSchema,
      messages: {
        required: 'Поле {{ field }} объязательно для заполнения.',
        enum: 'Введите верные значения в поле выбора.',
        'main_artist.minLength': 'Значение поля "Главный исполнитель" должно быть больше чем 2 символа.',
        url: 'Введите валидную ссылку.',
      },
    })
    if (!payload) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    await Release.create({
      type: payload.type,
      name: payload.name,
      main_artist: payload.main_artist,
      another_artists: payload.another_artists,
      genre: payload.genre,
      explicit: payload.explicit,
      author: payload.author,
      user_id: auth.user.id,
      accepted: false,
      date: payload.date,
      link: payload.link,
      label: payload.label,
      version: payload.version,
    }).catch(err => {
      Logger.error(err)
      return response.badRequest('Произошла ошибка при добавлении в базу данных, попробуйте позже.')
    })
    Logger.info('Создан новый релиз.')
    return response.redirect().toRoute('dashboard.releases')
  }
}
