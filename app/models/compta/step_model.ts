import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Chain from './chain_model.js'
import File from './file_model.js'
import MovementStep from './movement_step_model.js'

export default class Step extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare chainId: number

  @column()
  declare name: string

  @column()
  declare rank: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => Chain)
  declare chain: BelongsTo<typeof Chain>

  @hasMany(() => File)
  declare files: HasMany<typeof File>

  @hasMany(() => MovementStep)
  declare movementSteps: HasMany<typeof MovementStep>
}
