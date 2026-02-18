import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ''

  async up() {
    this.schema.createTable('movement_chains', (table) => {
      table.increments('id')
      table
        .integer('movement_id')
        .unsigned()
        .references('id')
        .inTable('movements')
        .onDelete('CASCADE')
      table.integer('chain_id').unsigned().references('id').inTable('chains').onDelete('CASCADE')
      table.integer('execution_order').notNullable()
      table.unique(['movement_id', 'chain_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('movement_steps', (table) => {
      table.increments('id')
      table
        .integer('movement_id')
        .unsigned()
        .references('id')
        .inTable('movements')
        .onDelete('CASCADE')
      table.integer('step_id').unsigned().references('id').inTable('steps').onDelete('CASCADE')
      table.unique(['movement_id', 'step_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('movement_files', (table) => {
      table.increments('id')
      table
        .integer('movement_step_id')
        .unsigned()
        .references('id')
        .inTable('movement_steps')
        .onDelete('CASCADE')
      table.integer('file_id').unsigned().references('id').inTable('files').onDelete('CASCADE')
      table.string('override_physical_name').nullable()
      table.string('override_copybook').nullable()
      table.boolean('is_monitored').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('rules', (table) => {
      table.increments('id')
      table
        .integer('movement_file_id')
        .unsigned()
        .references('id')
        .inTable('movement_files')
        .onDelete('CASCADE')
      table.string('message').notNullable()
      table.string('target_field').nullable()
      table.string('technical_details').nullable()
      table.text('fix_instruction').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('rules')
    this.schema.dropTable('movement_files')
    this.schema.dropTable('movement_steps')
    this.schema.dropTable('movement_chains')
  }
}
