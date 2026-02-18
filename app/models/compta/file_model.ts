import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Step from './step_model.js'
import MovementFile from './movement_file_model.js'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare stepId: number

  @column()
  declare direction: 'IN' | 'OUT'

  @column()
  declare logicalName: string

  @column()
  declare defaultPhysicalName: string

  @column()
  declare defaultCopybook: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */
  @belongsTo(() => Step)
  declare step: BelongsTo<typeof Step>

  @hasMany(() => MovementFile)
  declare configurations: HasMany<typeof MovementFile>
}
