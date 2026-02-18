import { HttpContext } from '@adonisjs/core/http'

import Movement from '#models/compta/movement_model'

export default class WorkflowsController {
  public async show({ params, response }: HttpContext) {
    const movementCode = params.code // ex: "GE00"

    try {
      // ÉTAPE 1 : On récupère d'abord l'objet principal
      // Cela nous garantit que 'movement' est défini et possède un ID
      const movement = await Movement.findByOrFail('code', movementCode)

      // ÉTAPE 2 : On charge l'arbre de dépendances (Preload)
      // Maintenant on peut utiliser 'movement.id' à l'intérieur
      await movement.load('movementChains', (mcQuery) => {
        mcQuery.orderBy('executionOrder', 'asc')
        mcQuery.preload('chain', (chainQuery) => {
          chainQuery.preload('steps', (stepQuery) => {
            // Ici, movement.id est accessible car on est à l'étape 2
            stepQuery.whereHas('movementSteps', (msQuery) => {
              msQuery.where('movementId', movement.id)
            })
            stepQuery.orderBy('rank', 'asc')

            stepQuery.preload('files')

            // Chargement de la config spécifique
            stepQuery.preload('movementSteps', (msQuery) => {
              msQuery.where('movementId', movement.id)
              msQuery.preload('files', (fileConfigQuery) => {
                // fileConfigQuery.preload('definition')
                // fileConfigQuery.preload('rules')
                fileConfigQuery.preload('rules')
              })
            })
          })
        })
      })

      const formattedResponse = this.formatWorkflow(movement)
      //   return response.json(movement)
      return response.json(formattedResponse)
    } catch (error) {
      console.error(error)
      return response.status(404).json({
        message: 'Mouvement non trouvé ou erreur technique',
        error: error.message,
      })
    }
  }

  private formatWorkflow(movement: Movement) {
    // On aplatit la structure : Liste chronologique des Steps
    const flatSteps: any[] = []

    // 1. On parcourt les chaines dans l'ordre
    for (const mChain of movement.movementChains) {
      const chain = mChain.chain

      // 2. On parcourt les steps de la chaine
      for (const step of chain.steps) {
        // On récupère la config spécifique liée à ce mouvement (s'il y en a une)
        // Comme c'est un tableau hasMany, on prend le premier (car unique par mvt/step)
        const config = step.movementSteps[0]

        // --- LA FUSION DES FICHIERS ---
        const finalFiles = step.files.map((catalogFile) => {
          // Cherche si ce fichier catalogue a une config spécifique
          const specificConfig = config?.files.find((f) => f.fileId === catalogFile.id)

          // Est-ce qu'on doit surveiller ce fichier ? (Par défaut true, sauf si dit false)
          const isMonitored = specificConfig ? specificConfig.isMonitored : true

          // Récupération des règles
          const rules =
            specificConfig?.rules.map((r) => ({
              message: r.message,
              target: r.targetField,
              details: r.technicalDetails,
              fix: r.fixInstruction,
            })) || []

          return {
            id: catalogFile.id,
            direction: catalogFile.direction, // 'IN' ou 'OUT'
            logicalName: catalogFile.logicalName, // DDNAME (ex: ENTREE)

            // Si surcharge existe, on prend, sinon valeur catalogue
            physicalName: specificConfig?.overridePhysicalName || catalogFile.defaultPhysicalName,
            copybook: specificConfig?.overrideCopybook || catalogFile.defaultCopybook,

            isMonitored: isMonitored,
            hasAlert: rules.length > 0,
            rules: rules,
          }
        })

        // On sépare entrées et sorties pour le Front
        const inputs = finalFiles.filter((f) => f.direction === 'IN')
        const outputs = finalFiles.filter((f) => f.direction === 'OUT')

        flatSteps.push({
          sequence: flatSteps.length + 1,
          chainName: chain.code,
          stepName: step.name,
          inputs: inputs,
          outputs: outputs,
          hasWarning: outputs.some((f) => f.hasAlert), // Flag global pour colorer le step en orange
        })
      }
    }

    return {
      movement: movement.code,
      description: movement.description,
      workflow: flatSteps,
    }
  }
}
