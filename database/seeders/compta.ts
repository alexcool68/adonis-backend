import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Chain from '#models/compta/chain_model'
import MovementChain from '#models/compta/movement_chain'
import Movement from '#models/compta/movement_model'
import MovementStep from '#models/compta/movement_step_model'
import MovementFile from '#models/compta/movement_file_model'
import Rule from '#models/compta/rule_model'
import Step from '#models/compta/step_model'
import File from '#models/compta/file_model'

export default class MainSeeder extends BaseSeeder {
  public async run() {
    // 1. LE CATALOGUE
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

    await File.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE 01',
      defaultPhysicalName: 'GJ000001',
      defaultCopybook: 'CGE000',
    })
    await File.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE 02',
      defaultPhysicalName: 'GJ000002',
      defaultCopybook: 'CGE000',
    })
    await File.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE 03',
      defaultPhysicalName: 'GJ000003',
      defaultCopybook: 'CGE000',
    })
    await File.create({
      stepId: step001.id,
      direction: 'IN',
      logicalName: 'ENTREE 04',
      defaultPhysicalName: 'GJ000004',
      defaultCopybook: 'CGE000',
    })

    const fileOut01 = await File.create({
      stepId: step001.id,
      direction: 'OUT',
      logicalName: 'SORTIE 01',
      defaultPhysicalName: 'GJ010001',
      defaultCopybook: 'CFGJ008',
    })

    const chainGJ02 = await Chain.create({ code: 'GJ02', description: 'Chaine Comptable GJ02' })

    const stepGJ02001 = await Step.create({
      chainId: chainGJ02.id,
      name: 'GJ020010',
      rank: 10,
    })

    await File.create({
      stepId: stepGJ02001.id,
      direction: 'IN',
      logicalName: 'ENTREE',
      defaultPhysicalName: 'GJ020001',
      defaultCopybook: 'CGE008',
    })
    await File.create({
      stepId: stepGJ02001.id,
      direction: 'OUT',
      logicalName: 'SORTIE',
      defaultPhysicalName: 'GJ020101',
      defaultCopybook: 'CFGJ009',
    })

    // 2. LA CONFIGURATION
    // Création du Mouvement GE00
    const movDP01 = await Movement.create({
      code: 'DP01',
      description: 'Rattrapage mouvement DP01',
    })

    await MovementChain.create({
      movementId: movDP01.id,
      chainId: chainGJ01.id,
      executionOrder: 10,
    })

    const mvtStep = await MovementStep.create({
      movementId: movDP01.id,
      stepId: step001.id,
    })
    await MovementStep.create({
      movementId: movDP01.id,
      stepId: step002.id,
    })

    const mvtFileConfig = await MovementFile.create({
      movementStepId: mvtStep.id,
      fileId: fileOut01.id,
      overridePhysicalName: 'APP.GJ01.DP01.OUTPUT',
      isMonitored: true,
    })

    await Rule.create({
      movementFileId: mvtFileConfig.id,
      message: 'Attention : Le Code Produit est forcé à 99',
      targetField: 'CODE-PRODUIT',
      technicalDetails: 'Pos 120, Len 02',
      fixInstruction: 'Modifier le fichier input du step suivant avec la valeur forcée.',
    })

    console.log('✅ Données de test insérées !')
  }
}
