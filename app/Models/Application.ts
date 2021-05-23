import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Application extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'firstName'})
  public firstName: string

  @column({columnName: 'lastName'})
  public lastName: string

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public years: number

  @column()
  public link: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
