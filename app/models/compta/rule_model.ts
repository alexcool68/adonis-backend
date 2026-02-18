import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import MovementFile from './movement_file_model.js'

export default class Rule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare movementFileId: number

  @column()
  declare message: string

  @column()
  declare targetField: string | null

  @column()
  declare technicalDetails: string | null

  @column()
  declare fixInstruction: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relations
   */

  @belongsTo(() => MovementFile)
  declare fileConfig: BelongsTo<typeof MovementFile>
}
