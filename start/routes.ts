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
const CatalogsController = () => import('#controllers/compta/catalogs_controller')
const ConfigurationsController = () => import('#controllers/compta/configurations_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.get('/health', [HealthChecksController])

router
  .group(() => {
    // Lecture (Ce qu'on a fait avant) via frontend
    router.get('/workflows/:code', [WorkflowsController, 'show'])
    router.get('/movements', [CatalogsController, 'showMovements'])

    // CATALOGUE (Administration JCL)
    router.post('/chains', [CatalogsController, 'storeChain'])
    router.delete('/chains/:chainId', [CatalogsController, 'destroyChain'])
    router.get('/chains', [CatalogsController, 'showChains'])
    router.post('/chains/:chainId/steps', [CatalogsController, 'storeStep'])
    router.delete('/steps/:stepId', [CatalogsController, 'destroyStep'])
    router.post('/steps/:stepId/files', [CatalogsController, 'storeStepFile'])
    router.delete('/steps/:stepId/files/:fileId', [CatalogsController, 'destroyStepFile'])
    router.get('/configurations/movements', [ConfigurationsController, 'showMovements'])

    // CONFIGURATION (Logique Métier)
    router.post('/movements', [ConfigurationsController, 'storeMovement']) // Créer GE00

    router.post('/links/chain', [ConfigurationsController, 'linkChain']) // Lier GE00 -> GJ01
    router.delete('/links/chain/:id', [ConfigurationsController, 'unlinkChain'])
    router.post('/links/step', [ConfigurationsController, 'activateStep']) // Activer Step
    router.delete('/links/step/:id', [ConfigurationsController, 'unlinkStep'])
    router.post('/links/file', [ConfigurationsController, 'configureFile']) // Configurer Fichier
    router.delete('/links/step/:movementStepId/files/:stepFileId', [
      ConfigurationsController,
      'unconfigureFile',
    ])
    router.post('/rules', [ConfigurationsController, 'addRule']) // Ajouter Règle
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
