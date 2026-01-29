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

const HealthChecksController = () => import('#controllers/health_checks_controller')
const AuthController = () => import('#controllers/auth_controller')
const PasswordResetController = () => import('#controllers/password_resets_controller')
const SystemController = () => import('#controllers/system_controller')
const PostsController = () => import('#controllers/posts_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.get('/health', [HealthChecksController])

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
        router.patch('/change-fullname', [AuthController, 'changeFullName'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/auth')
