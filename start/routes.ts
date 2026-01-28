/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import AuthController from '#controllers/auth_controller'
import PasswordResetController from '#controllers/password_resets_controller'
import SystemController from '#controllers/system_controller'
import PostsController from '#controllers/posts_controller'

router.get('/', async () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router.get('/ping', [SystemController, 'ping'])
    router.get('/reset', [SystemController, 'reset'])
    router.get('/seedUser', [SystemController, 'seedUser'])
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/system')

router
  .group(() => {
    router.get('/', [PostsController, 'index'])
    router.get('/myPost', [PostsController, 'readByUserId'])
    router.post('/store', [PostsController, 'store'])
    router.patch(':id', [PostsController, 'update']).where('id', {
      match: /^[0-9]+$/,
      cast: (value) => Number(value),
    })

    router.delete(':id', [PostsController, 'destroy']).where('id', {
      match: /^[0-9]+$/,
      cast: (value) => Number(value),
    })
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .use(middleware.logger({ run: true }))
  .prefix('/api/posts')

router
  .group(() => {
    // Routes publiques
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/forgot-password', [PasswordResetController, 'forgotPassword'])
    router.post('/reset-password', [PasswordResetController, 'resetPassword'])
    // Routes protégées (nécessitent d'être connecté)
    router
      .group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.get('/session', [AuthController, 'session'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/auth')
