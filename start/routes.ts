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

router.get('/', async () => {
  return { hello: 'world' }
})

router.get('/ping', [SystemController, 'ping'])

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
  .prefix('/api/auth')
