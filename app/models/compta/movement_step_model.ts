import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Movement from './movement_model.js'
import Step from './step_model.js'
import MovementStepFile from './movement_stepfile_model.js'

export default class MovementStep extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare movementId: number

  @column()
  declare stepId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => Movement)
  declare movement: BelongsTo<typeof Movement>

  @belongsTo(() => Step)
  declare step: BelongsTo<typeof Step>

  @hasMany(() => MovementStepFile)
  declare files: HasMany<typeof MovementStepFile>
}
