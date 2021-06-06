import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/users'

export default class Invite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public author_id: number

  @column()
  public user_id: number

  @column()
  public used: boolean

  @belongsTo(() => User, {
    localKey: 'id', // id column on "User" model
    foreignKey: 'author_id',
  })
  public author: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'id', // id column on "User" model
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
