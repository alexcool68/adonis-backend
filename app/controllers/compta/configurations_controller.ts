import type { HttpContext } from '@adonisjs/core/http'
import {
  storeMovementConfigurationValidator,
  linkChainConfigurationValidator,
  activateStepConfigurationValidator,
  configureFileConfigurationValidator,
  addRuleConfigurationValidator,
} from '#validators/compta/configuration_validator'
import Movement from '#models/compta/movement_model'
import Rule from '#models/compta/rule_model'
import MovementStep from '#models/compta/movement_step_model'
import MovementStepFile from '#models/compta/movement_stepfile_model'
import MovementChain from '#models/compta/movement_chain'

export default class ConfigurationsController {
  // Créer un Mouvement
  public async storeMovement({ request, response }: HttpContext) {
    const payload = await request.validateUsing(storeMovementConfigurationValidator)

    const movement = await Movement.create(payload)
    return response.created(movement)
  }

  // Lier un Mouvement à une Chaine
  public async linkChain({ request, response }: HttpContext) {
    const payload = await request.validateUsing(linkChainConfigurationValidator)

    const link = await MovementChain.create(payload)
    return response.created(link)
  }

  // Activer un Step pour un Mouvement
  public async activateStep({ request, response }: HttpContext) {
    const payload = await request.validateUsing(activateStepConfigurationValidator)

    // Cela crée l'entrée dans 'movement_steps'
    const activation = await MovementStep.create(payload)
    return response.created(activation)
  }

  // Configurer un Fichier (Surcharge/Activation)
  public async configureFile({ request, response }: HttpContext) {
    const payload = await request.validateUsing(configureFileConfigurationValidator)

    const config = await MovementStepFile.create(payload)
    return response.created(config)
  }

  // Ajouter une Règle (Alerte)
  public async addRule({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRuleConfigurationValidator)
    const rule = await Rule.create(payload)
    return response.created(rule)
  }
}
