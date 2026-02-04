import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import MovementStep from './movement_step_model.js'
import StepFile from './stepfile_model.js'
import Rule from './rule_model.js'

export default class MovementStepFile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare movementStepId: number

  @column()
  declare stepFileId: number

  @column()
  declare overridePhysicalName: string | null

  @column()
  declare overrideCopybook: string | null

  @column()
  declare isMonitored: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => MovementStep)
  declare movementStep: BelongsTo<typeof MovementStep>

  @belongsTo(() => StepFile)
  declare definition: BelongsTo<typeof StepFile>

  @hasMany(() => Rule)
  declare rules: HasMany<typeof Rule>
}
