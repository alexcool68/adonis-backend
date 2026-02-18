import { HttpContext } from '@adonisjs/core/http'

import {
  addMovementChainConfigurationValidator,
  addMovementFileConfigurationValidator,
  addMovementStepConfigurationValidator,
  addRuleConfigurationValidator,
} from '#validators/compta/configuration_validator'

import Movement from '#models/compta/movement_model'
import Rule from '#models/compta/rule_model'
import MovementFile from '#models/compta/movement_file_model'

export default class ConfigurationsController {
  public async showFormattedMovements({ response }: HttpContext) {
    const movements = await Movement.query()
      .orderBy('code', 'asc')
      .preload('movementChains', (mcQuery) => {
        mcQuery.orderBy('executionOrder', 'asc')
        mcQuery.preload('chain', (chainQuery) => {
          chainQuery.preload('steps', (stepQuery) => {
            stepQuery.orderBy('rank', 'asc')
            stepQuery.preload('files')
            stepQuery.preload('movementSteps', (msQuery) => {
              msQuery.preload('files', (fQuery) => {
                fQuery.preload('rules')
                fQuery.preload('definition')
              })
            })
          })
        })
      })

    const formattedMovements = movements.map((m) => {
      return {
        id: m.id,
        code: m.code,
        description: m.description,
        chains: m.movementChains.map((mc) => {
          const chain = mc.chain

          return {
            id: chain.id, // ID Catalogue
            movementChainId: mc.id, // ID Liaison
            code: chain.code,
            description: chain.description,
            // Pour chaque step du catalogue, on regarde s'il est activé pour ce mouvement
            steps: chain.steps.map((step) => {
              // On cherche si une config existe pour ce Mouvement ID précis
              const activeConfig = step.movementSteps.find((ms) => ms.movementId === m.id)
              const possibleFiles = step.files
              return {
                id: step.id,
                name: step.name,
                rank: step.rank,
                isActive: !!activeConfig, // True si configuré
                movementStepId: activeConfig?.id,
                possibleFiles: possibleFiles,
                files:
                  activeConfig?.files.map((f) => ({
                    id: f.id,
                    fileId: f.fileId,
                    overridePhysicalName: f.overridePhysicalName,
                    logicalName: f.definition.logicalName,
                    defaultPhysicalName: f.definition.defaultPhysicalName,
                    rules: f.rules,
                  })) || [],
              }
            }),
          }
        }),
      }
    })
    return response.json(formattedMovements)
  }

  public async addRule({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRuleConfigurationValidator)
    const rule = await Rule.create(payload)
    return response.created(rule)
  }

  public async deleteRule({ params, response }: HttpContext) {
    if (!params.ruleId) {
      return response.badRequest()
    }
    const rule = await Rule.findOrFail(params.ruleId)
    await rule.delete()
    return response.noContent()
  }

  //attach and detach a chain to movement
  public async attachMovementChain({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addMovementChainConfigurationValidator)
    const movement = await Movement.findOrFail(payload.movementId)

    await movement.related('chains').attach({
      [payload.chainId]: { execution_order: payload.executionOrder },
    })

    return response.created()
  }

  public async detachMovementChain({ params, response }: HttpContext) {
    if (!params.movementId || !params.chainId) {
      return response.badRequest()
    }

    const movement = await Movement.findOrFail(params.movementId)
    await movement.related('chains').detach([params.chainId])
    return response.noContent()
  }

  //attach and detach a step to movement
  public async attachMovementStep({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addMovementStepConfigurationValidator)
    const movement = await Movement.findOrFail(payload.movementId)

    await movement.related('steps').attach([payload.stepId])

    return response.created()
  }

  public async detachMovementStep({ params, response }: HttpContext) {
    if (!params.movementId || !params.stepId) {
      return response.badRequest()
    }

    const movement = await Movement.findOrFail(params.movementId)
    await movement.related('steps').detach([params.stepId])
    return response.noContent()
  }

  //attach and detach a file to movement
  public async attachMovementFile({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addMovementFileConfigurationValidator)
    const movementFile = await MovementFile.create(payload)
    return response.created(movementFile)
  }

  public async detachMovementFile({ params, response }: HttpContext) {
    if (!params.movementFileId) {
      return response.badRequest()
    }

    const movementFile = await MovementFile.findOrFail(params.movementFileId)
    await movementFile.delete()
    return response.noContent()
  }

  // public async addMovementChain({ request, response }: HttpContext) {
  //   const payload = await request.validateUsing(addMovementChainConfigurationValidator)
  //   const movement = await Movement.findOrFail(payload.movementId)

  //   const result = await movement.related('movementChains').create({
  //     chainId: payload.chainId,
  //     executionOrder: payload.executionOrder,
  //   })

  //   return response.created(result)
  // }

  // public async deleteMovementChain({ params, response }: HttpContext) {
  //   const link = await MovementChain.findOrFail(params.movementChainId)
  //   await link.delete()
  //   return response.noContent()
  // }

  // public async addMovementStep({ request, response }: HttpContext) {
  //   const payload = await request.validateUsing(addMovementStepConfigurationValidator)
  //   const activation = await MovementStep.create(payload)
  //   return response.created(activation)
  // }

  // public async deleteMovementStep({ params, response }: HttpContext) {
  //   const link = await MovementStep.findOrFail(params.movementStepId)
  //   await link.delete()
  //   return response.noContent()
  // }

  // public async addMovementFile({ request, response }: HttpContext) {
  //   const payload = await request.validateUsing(addMovementFileConfigurationValidator)
  //   const config = await MovementFile.create(payload)
  //   return response.created(config)
  // }

  // public async deleteMovementFile({ params, response }: HttpContext) {
  //   const fileId = params.fileId
  //   const movementStepId = params.movementStepId
  //   const file = await MovementFile.findOrFail(fileId, movementStepId)
  //   await file.delete()
  //   return response.noContent()
  // }
}
