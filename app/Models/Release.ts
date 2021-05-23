import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Release extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public main_artist: string

  @column()
  public another_artists: string

  @column()
  public genre: string

  @column()
  public version: string

  @column()
  public explicit: boolean

  @column()
  public author: string

  @column()
  public date: string

  @column()
  public link: string

  @column()
  public label: string

  @column()
  public reason: string

  @column()
  public user_id: number

  @column()
  public accepted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
