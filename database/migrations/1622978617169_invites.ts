import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Invites extends BaseSchema {
  protected tableName = 'invites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.integer('author_id').notNullable()
      table.integer('user_id')
      table.boolean('used').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
