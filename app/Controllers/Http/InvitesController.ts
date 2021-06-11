// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Invite from 'App/Models/Invite'
import crypto from 'crypto'

export default class InvitesController {
  public async getAllUsers ({view, auth, bouncer}) {
    await bouncer.authorize('createInvite', auth.user)
    const invites = await Invite
      .query()
      .where('author_id', '=', auth.user.id)
      .orderBy('created_at', 'desc')
      .preload('user')
    return view.render('dashboard/invites', {invites: invites})
  }

  public async createInvite ({response, auth, bouncer}) {
    await bouncer.authorize('createInvite', auth.user)
    const hash = crypto.randomBytes(20).toString('hex')
    await Invite.create({
      code: hash,
      author_id: auth.user.id,
      used: false,
    }).catch(_ => response.badRequest('Произошла ошибка, попробуйте позже. #2'))
    return response.redirect().toRoute('admin.invites')
  }
}
