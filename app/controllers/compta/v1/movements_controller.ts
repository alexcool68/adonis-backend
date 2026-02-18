import type { HttpContext } from '@adonisjs/core/http'

import {
  storeMovementValidator,
  updateMovementValidator,
} from '#validators/compta/movement_validator'

import Movement from '#models/compta/movement_model'

export default class MovementsController {
  public async storeMovement({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(storeMovementValidator)
      const movement = await Movement.create(payload)
      return response.created(movement)
    } catch (e) {
      console.log(e)
    }
  }

  public async destroyMovement({ params, response }: HttpContext) {
    try {
      const movement = await Movement.findOrFail(params.chainId)
      await movement.delete()
      return response.noContent()
    } catch (e) {
      console.log(e)
    }
  }

  public async updateMovement({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateMovementValidator)
      const movement = await Movement.findOrFail(payload.id)
      const updatedMovement = await movement.merge(payload).save()
      return response.accepted(updatedMovement)
    } catch (e) {
      console.log(e)
    }
  }

  public async showMovements({}: HttpContext) {
    // return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('possibleFiles'))
    return Movement.all()
  }
}
