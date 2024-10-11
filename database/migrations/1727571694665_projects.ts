import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('slug')
      table.string('color')
      table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('SET NULL')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.dateTime('expires_at', { useTz: true })
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('deleted_at', { useTz: true })
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })

    this.schema.createTable('project_user', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE')
    })

  }

  public async down () {
    this.schema.dropTable('project_user')
    this.schema.dropTable(this.tableName)
  }
}
