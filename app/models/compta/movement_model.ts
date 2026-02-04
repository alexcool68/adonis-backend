import { DateTime } from 'luxon'

import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

import MovementChain from './movement_chain.js'
import Chain from './chain_model.js'
import MovementStep from './movement_step_model.js'

export default class Movement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @hasMany(() => MovementChain)
  declare movementChains: HasMany<typeof MovementChain>

  @hasMany(() => MovementStep)
  declare movementSteps: HasMany<typeof MovementStep>

  @manyToMany(() => Chain, {
    pivotTable: 'movement_chains',
    pivotColumns: ['execution_order'],
  })
  declare chains: ManyToMany<typeof Chain>
}
