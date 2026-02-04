import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Movement from './movement_model.js'
import Chain from './chain_model.js'

export default class MovementChain extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare movementId: number

  @column()
  declare chainId: number

  @column()
  declare executionOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => Movement)
  declare movement: BelongsTo<typeof Movement>

  @belongsTo(() => Chain)
  declare chain: BelongsTo<typeof Chain>
}
