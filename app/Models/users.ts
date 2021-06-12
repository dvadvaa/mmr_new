import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel, hasMany, HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Release from "App/Models/Release";


export default class users extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public status: string

  @column()
  public balance: number

  @column()
  public invited_by: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (users: users) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }

  @hasMany(() => Release, {
    localKey: 'id',
    foreignKey: 'user_id', // defaults to userId
  })
  public releases: HasMany<typeof Release>
}
