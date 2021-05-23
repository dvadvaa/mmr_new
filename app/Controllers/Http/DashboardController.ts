// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Release from 'App/Models/Release'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'

export default class DashboardController {
  public async getReleases ({ view, auth }) {
    await auth.use('web').authenticate()
    const data = await Release
      .query()
      .where('user_id', '=', auth.user.id)
      .orderBy('created_at', 'desc')
      // .limit(20)
    return view.render('dashboard/releases', {data: data.length ? data : null})
  }
  public async createRelease ({ request, auth, response }) {
    const releaseSchema = schema.create({
      name: schema.string({}, [
        rules.minLength(4),
      ]),
      main_artist: schema.string({}, [
        rules.minLength(4),
      ]),
      another_artists: schema.string.optional(),
      version: schema.string.optional(),
      genre: schema.string(),
      explicit: schema.boolean(),
      author: schema.string(),
      date: schema.string(),
      link: schema.string({}, [
        rules.url({}),
      ]),
    })
    const payload = await request.validate({ schema: releaseSchema,
      messages: {
        required: 'Поле {{ field }} объязательно для заполнения.',
      },
    })
    if (!payload) {
      return response.badRequest('Произошла ошибка, попробуйте позже.')
    }
    await Release.create({
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
    }).catch(err => {
      Logger.error(err)
      return response.badRequest('Произошла ошибка при добавлении в базу данных, попробуйте позже.')
    })
    Logger.info('Создан новый релиз.')
    return response.redirect().toRoute('dashboard.releases')
  }
}
