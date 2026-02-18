import type { HttpContext } from '@adonisjs/core/http'

import { storeStepValidator, updateStepValidator } from '#validators/compta/step_validator'

import Step from '#models/compta/step_model'

export default class StepsController {
  public async storeStep({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(storeStepValidator)
      const step = await Step.create(payload)
      return response.created(step)
    } catch (e) {
      console.log(e)
    }
  }

  public async destroyStep({ params, response }: HttpContext) {
    try {
      const step = await Step.findOrFail(params.stepId)
      await step.delete()
      return response.noContent()
    } catch (e) {
      console.log(e)
    }
  }

  public async updateStep({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateStepValidator)
      const step = await Step.findOrFail(payload.id)
      const updatedStep = await step.merge(payload).save()
      return response.accepted(updatedStep)
    } catch (e) {}
  }

  public async showSteps({}: HttpContext) {
    // return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('possibleFiles'))
    return Step.all()
  }
}
