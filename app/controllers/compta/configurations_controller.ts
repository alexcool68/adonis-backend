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

  // Show un mouvement
  public async showMovements({ response }: HttpContext) {
    const movements = await Movement.query()
      .orderBy('code', 'asc')
      // 2. On charge les chaînes liées
      .preload('movementChains', (mcQuery) => {
        mcQuery.orderBy('executionOrder', 'asc')

        // 3. On charge les infos catalogue de la chaîne (code, description...)
        mcQuery.preload('chain', (chainQuery) => {
          // 4. On charge TOUS les steps du catalogue pour cette chaîne
          // (Car on veut afficher même ceux qui sont inactifs/grisés)
          chainQuery.preload('steps', (stepQuery) => {
            stepQuery.orderBy('rank', 'asc')
            stepQuery.preload('possibleFiles')
            // 5. On regarde s'il existe une liaison "Active" pour ce mouvement
            // Astuce : on filtre sur le mouvement parent pour savoir si c'est actif
            stepQuery.preload('movementSteps', (msQuery) => {
              // On ne garde que la config liée au mouvement qu'on est en train de lire
              // Note : Comme on est dans un preload imbriqué, c'est délicat de filtrer par l'ID du parent global.
              // Pour simplifier ici, on chargera tout et on filtrera en JS ou on utilise une requête plus complexe.
              // Mais pour l'admin, charger les configs est acceptable.
              msQuery.preload('files', (fQuery) => {
                fQuery.preload('rules')
                fQuery.preload('definition') // On charge la définition du fichier depuis le catalogue
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
              const possibleFiles = step.possibleFiles
              // return {
              //   id: step.id,
              //   name: step.name,
              //   rank: step.rank,
              //   isActive: !!activeConfig, // True si configuré
              //   movementStepId: activeConfig?.id,
              //   files:
              //     activeConfig?.files.map((f) => ({
              //       id: f.id,
              //       stepFileId: f.stepFileId,
              //       // On pourrait récupérer le logicalName via un preload supplémentaire si besoin
              //       // Pour l'instant on renvoie l'ID
              //       rules: f.rules,
              //     })) || [],
              // }
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
                    stepFileId: f.stepFileId,
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

  // Lier un Mouvement à une Chaine
  public async linkChain({ request, response }: HttpContext) {
    const payload = await request.validateUsing(linkChainConfigurationValidator)

    const link = await MovementChain.create(payload)
    return response.created(link)
  }
  // Supprime un Mouvement à une Chaine
  public async unlinkChain({ params, response }: HttpContext) {
    // On supprime la ligne dans la table de liaison movement_chains
    // Attention : Assure-toi que ta BDD est en "ON DELETE CASCADE" pour
    // les steps enfants, sinon il faudra les supprimer manuellement avant.
    const link = await MovementChain.findOrFail(params.id)
    await link.delete()

    return response.noContent()
  }

  // Activer un Step pour un Mouvement
  public async activateStep({ request, response }: HttpContext) {
    const payload = await request.validateUsing(activateStepConfigurationValidator)

    // Cela crée l'entrée dans 'movement_steps'
    const activation = await MovementStep.create(payload)
    return response.created(activation)
  }

  // DÉSACTIVER UN STEP (SUPPRIMER LA LIAISON)
  public async unlinkStep({ params, response }: HttpContext) {
    // On supprime la ligne dans movement_steps
    const link = await MovementStep.findOrFail(params.id)
    await link.delete()

    return response.noContent()
  }

  // Configurer un Fichier (Surcharge/Activation)
  public async configureFile({ request, response }: HttpContext) {
    const payload = await request.validateUsing(configureFileConfigurationValidator)

    const config = await MovementStepFile.create(payload)
    return response.created(config)
  }

  // Configurer un Fichier (Surcharge/Activation)
  public async unconfigureFile({ params, response }: HttpContext) {
    const stepFileId = params.stepFileId
    const movementStepId = params.movementStepId

    const file = await MovementStepFile.findOrFail(stepFileId, movementStepId)
    await file.delete()
    return response.noContent()
  }

  // Ajouter une Règle (Alerte)
  public async addRule({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRuleConfigurationValidator)
    const rule = await Rule.create(payload)
    return response.created(rule)
  }
}
