import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('slug')
      table.string('password')
      table.string('email', 255).notNullable().unique()
      table.string('remember_me_token').nullable()
      table.integer('position_id').unsigned().references('id').inTable('positions').onDelete('SET NULL')
      table.integer('department_id').unsigned().references('id').inTable('departments').onDelete('SET NULL')
      table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('SET NULL')
      table.dateTime("deleted_at").defaultTo(null);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
