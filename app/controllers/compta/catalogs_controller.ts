import type { HttpContext } from '@adonisjs/core/http'
import {
  storeChainCatalogValidator,
  storeStepCatalogValidator,
  storeStepFileCatalogValidator,
} from '#validators/compta/catalog_validator'
import Chain from '#models/compta/chain_model'
import Step from '#models/compta/step_model'
import StepFile from '#models/compta/stepfile_model'
import Movement from '#models/compta/movement_model'

export default class CatalogsController {
  // Créer une Chaine
  public async storeChain({ request, response }: HttpContext) {
    const payload = await request.validateUsing(storeChainCatalogValidator)
    const chain = await Chain.create(payload)
    return response.created(chain)
  }

  public async destroyChain({ params, response }: HttpContext) {
    const chain = await Chain.findOrFail(params.id)
    await chain.delete()
    return response.noContent()
  }

  // Ajouter un Step dans une Chaine
  public async storeStep({ request, response, params }: HttpContext) {
    const chainId = params.chainId
    const payload = await request.validateUsing(storeStepCatalogValidator)
    const step = await Step.create({
      chainId: chainId,
      ...payload,
    })
    return response.created(step)
  }

  // Ajouter un Fichier à un Step
  public async storeStepFile({ request, response, params }: HttpContext) {
    const stepId = params.stepId

    const payload = await request.validateUsing(storeStepFileCatalogValidator)

    const file = await StepFile.create({
      stepId: stepId,
      ...payload,
    })
    return response.created(file)
  }

  public async showChains({}: HttpContext) {
    return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('possibleFiles'))
  }

  public async showMovements({}: HttpContext) {
    return Movement.query()
  }
}
