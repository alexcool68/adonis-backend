import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ''

  async up() {
    this.schema.createTable('chains', (table) => {
      table.increments('id')
      table.string('code', 10).notNullable().unique()
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('steps', (table) => {
      table.increments('id')
      table.integer('chain_id').unsigned().references('id').inTable('chains').onDelete('CASCADE')
      table.string('name', 50).notNullable()
      table.integer('rank').notNullable() // Ordre par défaut dans la chaine
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('step_files', (table) => {
      table.increments('id')
      table.integer('step_id').unsigned().references('id').inTable('steps').onDelete('CASCADE')
      table.enum('direction', ['IN', 'OUT']).notNullable()
      table.string('logical_name', 50).notNullable() // DDNAME (ex: SORTECR)
      table.string('default_physical_name').nullable() // DSNAME
      table.string('default_copybook').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('movements', (table) => {
      table.increments('id')
      table.string('code', 10).notNullable().unique() // GE00
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('movements')
    this.schema.dropTable('step_files')
    this.schema.dropTable('steps')
    this.schema.dropTable('chains')
  }
}
