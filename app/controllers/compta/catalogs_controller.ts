import type { HttpContext } from '@adonisjs/core/http'
import {
  storeChainCatalogValidator,
  storeStepCatalogValidator,
} from '#validators/compta/catalog_validator'
import Chain from '#models/compta/chain_model'
import Step from '#models/compta/step_model'
import StepFile from '#models/compta/stepfile_model'

export default class CatalogsController {
  // Créer une Chaine
  public async storeChain({ request, response }: HttpContext) {
    const payload = await request.validateUsing(storeChainCatalogValidator)
    const chain = await Chain.create(payload)
    return response.created(chain)
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

    const payload = await request.validateUsing(storeStepCatalogValidator)

    const file = await StepFile.create({
      stepId: stepId,
      ...payload,
    })
    return response.created(file)
  }
}
