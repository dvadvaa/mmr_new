import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Releases extends BaseSchema {
  protected tableName = 'releases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('type')
      table.string('main_artist', 255).notNullable()
      table.string('another_artists', 255)
      table.string('genre', 255).notNullable()
      table.string('version', 255)
      table.boolean('explicit').notNullable()
      table.string('author', 255).notNullable()
      table.string('date').notNullable()
      table.integer('user_id').notNullable()
      table.string('link').notNullable()
      table.string('label').notNullable()
      table.boolean('accepted').notNullable()
      table.string('reason')
      table.integer('accepted_by')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
