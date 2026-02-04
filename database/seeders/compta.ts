import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Chain from '#models/compta/chain_model'
import MovementChain from '#models/compta/movement_chain'
import Movement from '#models/compta/movement_model'
import MovementStep from '#models/compta/movement_step_model'
import MovementStepFile from '#models/compta/movement_stepfile_model'
import Rule from '#models/compta/rule_model'
import Step from '#models/compta/step_model'
import StepFile from '#models/compta/stepfile_model'

export default class MainSeeder extends BaseSeeder {
  public async run() {
    // 1. LE CATALOGUE (Ce qui existe dans le JCL)
    // ------------------------------------------------

    // Création de la chaine GJ01
    const chainGJ01 = await Chain.create({ code: 'GJ01', description: 'Chaine Comptable GJ01' })

    // Création du Step GJ01002
    const step001 = await Step.create({
      chainId: chainGJ01.id,
      name: 'GJ010010',
      rank: 10,
    })
    const step002 = await Step.create({
      chainId: chainGJ01.id,
      name: 'GJ010020',
      rank: 20,
    })

    // Définition des fichiers possibles pour ce step
    const fileEntree01 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000001',
      defaultCopybook: 'CGE000',
    })
    const fileEntree02 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000002',
      defaultCopybook: 'CGE000',
    })
    const fileEntree03 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000003',
      defaultCopybook: 'CGE000',
    })
    const fileEntree04 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000004',
      defaultCopybook: 'CGE000',
    })
    const fileEntree05 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000005',
      defaultCopybook: 'CGE000',
    })
    const fileEntree07 = await StepFile.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ000007',
      defaultCopybook: 'CGE000',
    })

    const fileSortie = await StepFile.create({
      stepId: step001.id,
      direction: 'OUT',
      logicalName: 'BECT',
      defaultPhysicalName: 'GJ010001',
      defaultCopybook: 'CFGJ008',
    })

    const chainGJ02 = await Chain.create({ code: 'GJ02', description: 'Chaine Comptable GJ02' })

    const stepGJ02001 = await Step.create({
      chainId: chainGJ02.id,
      name: 'GJ020010',
      rank: 10,
    })

    await StepFile.create({
      stepId: stepGJ02001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ020001',
      defaultCopybook: 'CGE008',
    })
    await StepFile.create({
      stepId: stepGJ02001.id,
      direction: 'OUT',
      logicalName: 'SORTIE',
      defaultPhysicalName: 'GJ020101',
      defaultCopybook: 'CFGJ009',
    })

    // 2. LA CONFIGURATION (Le scénario métier)
    // ------------------------------------------------

    // Création du Mouvement GE00
    const movDP01 = await Movement.create({ code: 'DP01', description: 'Rattrapage Mvt DP01' })

    // A. On dit que DP01 passe par GJ01
    await MovementChain.create({
      movementId: movDP01.id,
      chainId: chainGJ01.id,
      executionOrder: 10,
    })

    // B. On active le step GJ01002 pour ce mouvement
    const mvtStep = await MovementStep.create({
      movementId: movDP01.id,
      stepId: step001.id,
    })
    await MovementStep.create({
      movementId: movDP01.id,
      stepId: step002.id,
    })

    // C. On configure le fichier de sortie spécifique pour ce cas
    const mvtFileConfig = await MovementStepFile.create({
      movementStepId: mvtStep.id,
      stepFileId: fileSortie.id, // On pointe vers SORTECR
      overridePhysicalName: 'APP.GJ01.DP01.OUTPUT', // Nom spécifique
      isMonitored: true,
    })

    // D. On ajoute la règle de forçage (L'alerte)
    await Rule.create({
      movementStepFileId: mvtFileConfig.id,
      message: 'Attention : Le Code Produit est forcé à 99',
      targetField: 'CODE-PRODUIT',
      technicalDetails: 'Pos 120, Len 02',
      fixInstruction: 'Modifier le fichier input du step suivant avec la valeur forcée.',
    })

    console.log('✅ Données de test insérées !')
  }
}
