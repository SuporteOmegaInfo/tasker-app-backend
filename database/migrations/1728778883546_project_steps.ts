import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'project_steps'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('slug')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.dateTime('expires_at', { useTz: true })
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('deleted_at', { useTz: true })
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })

    this.schema.createTable('project_step_user', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('project_step_id').unsigned().references('id').inTable('project_steps').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable('project_step_user')
    this.schema.dropTable(this.tableName)
  }
}
