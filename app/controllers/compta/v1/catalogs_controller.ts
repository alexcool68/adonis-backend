import { HttpContext } from '@adonisjs/core/http'

import Chain from '#models/compta/chain_model'

export default class CatalogsController {
  public async showFormattedChains({}: HttpContext) {
    return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('files'))
  }
}
