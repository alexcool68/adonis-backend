import type { HttpContext } from '@adonisjs/core/http'

import { storeChainValidator, updateChainValidator } from '#validators/compta/chain_validator'

import Chain from '#models/compta/chain_model'

export default class ChainsController {
  public async storeChain({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(storeChainValidator)
      const chain = await Chain.create(payload)
      return response.created(chain)
    } catch (e) {
      console.log(e)
    }
  }

  public async destroyChain({ params, response }: HttpContext) {
    try {
      const chain = await Chain.findOrFail(params.chainId)
      await chain.delete()
      return response.noContent()
    } catch (e) {
      console.log(e)
    }
  }

  public async updateChain({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateChainValidator)
      const chain = await Chain.findOrFail(payload.id)
      const updatedChain = await chain.merge(payload).save()
      return response.accepted(updatedChain)
    } catch (e) {
      console.log(e)
    }
  }

  public async showChains({}: HttpContext) {
    // return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('possibleFiles'))
    return Chain.all()
  }
}
