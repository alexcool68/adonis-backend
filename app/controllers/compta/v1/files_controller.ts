import type { HttpContext } from '@adonisjs/core/http'

import { storeFileValidator, updateFileValidator } from '#validators/compta/file_validator'

import File from '#models/compta/file_model'

export default class FilesController {
  public async storeFile({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(storeFileValidator)
      const file = await File.create(payload)
      return response.created(file)
    } catch (e) {
      console.log(e)
    }
  }

  public async destroyFile({ params, response }: HttpContext) {
    try {
      const file = await File.findOrFail(params.fileId)
      await file.delete()
      return response.noContent()
    } catch (e) {
      console.log(e)
    }
  }
  public async updateFile({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateFileValidator)
      const file = await File.findOrFail(payload.id)
      const updatedFile = await file.merge(payload).save()
      return response.accepted(updatedFile)
    } catch (e) {}
  }

  public async showFiles({}: HttpContext) {
    // return Chain.query().preload('steps', (q) => q.orderBy('rank').preload('possibleFiles'))
    return File.all()
  }
}
