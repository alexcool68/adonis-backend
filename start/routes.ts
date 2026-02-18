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
const WorkflowsController = () => import('#controllers/compta/workflows_controller')

//v1
const ChainsController = () => import('#controllers/compta/v1/chains_controller')
const StepsController = () => import('#controllers/compta/v1/steps_controller')
const FilesController = () => import('#controllers/compta/v1/files_controller')
const MovementsController = () => import('#controllers/compta/v1/movements_controller')

const CatalogsController = () => import('#controllers/compta/v1/catalogs_controller')
const ConfigurationsController = () => import('#controllers/compta/v1/configurations_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.get('/health', [HealthChecksController])

// V1
router
  .group(() => {
    router.get('/formatted-chains', [CatalogsController, 'showFormattedChains'])
    router.get('/formatted-movements', [ConfigurationsController, 'showFormattedMovements'])

    router.post('/rules', [ConfigurationsController, 'addRule'])
    router.delete('/rules/:ruleId', [ConfigurationsController, 'deleteRule'])

    // attach and detach a chain to a movement
    router.post('/movement/chain', [ConfigurationsController, 'attachMovementChain'])
    router.delete('/movement/:movementId/chain/:chainId', [
      ConfigurationsController,
      'detachMovementChain',
    ])

    // attach and detach a step to a movement
    router.post('/movement/step', [ConfigurationsController, 'attachMovementStep'])
    router.delete('/movement/:movementId/step/:stepId', [
      ConfigurationsController,
      'detachMovementStep',
    ])

    // attach and detach a file to a movement
    router.post('/movement/file', [ConfigurationsController, 'attachMovementFile'])
    router.delete('/movement/file/:movementFileId', [
      ConfigurationsController,
      'detachMovementFile',
    ])

    router.group(() => {
      router.post('/movements', [MovementsController, 'storeMovement'])
      router.delete('/movements/:chainId', [MovementsController, 'destroyMovement'])
      router.get('/movements', [MovementsController, 'showMovements'])
      router.patch('/movements', [MovementsController, 'updateMovement'])
    })
    router.group(() => {
      router.post('/chains', [ChainsController, 'storeChain'])
      router.delete('/chains/:chainId', [ChainsController, 'destroyChain'])
      router.get('/chains', [ChainsController, 'showChains'])
      router.patch('/chains', [ChainsController, 'updateChain'])
    })
    router.group(() => {
      router.post('/steps', [StepsController, 'storeStep'])
      router.delete('/steps/:stepId', [StepsController, 'destroyStep'])
      router.get('/steps', [StepsController, 'showSteps'])
      router.patch('/steps', [StepsController, 'updateStep'])
    })
    router.group(() => {
      router.post('/files', [FilesController, 'storeFile'])
      router.delete('/files/:fileId', [FilesController, 'destroyFile'])
      router.get('/files', [FilesController, 'showFiles'])
      router.patch('/files', [FilesController, 'updateFile'])
    })
  })
  .use(middleware.logger({ run: true }))
  .prefix('api/v1/')

// V0
router
  .group(() => {
    // Lecture (Ce qu'on a fait avant) via frontend, à migrer ?
    router.get('/workflows/:code', [WorkflowsController, 'show'])
  })
  .use(middleware.logger({ run: true }))
  .prefix('api')

router
  .group(() => {
    router.get('/ping', [SystemController, 'ping'])
    router.get('/reset', [SystemController, 'reset'])
    router.get('/seedUser', [SystemController, 'seedUser'])
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/system')

/*
  POST
*/
router
  .group(() => {
    // public
    router.get('/', [PostsController, 'index'])
    router.get(':id', [PostsController, 'show']).where('id', {
      match: /^[0-9]+$/,
      cast: (value) => Number(value),
    })
    // private
    router
      .group(() => {
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
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/posts')
/*
  AUTH
*/
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
        router.patch('/update-password', [AuthController, 'updatePassword'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .use(middleware.logger({ run: true }))
  .prefix('/api/auth')
