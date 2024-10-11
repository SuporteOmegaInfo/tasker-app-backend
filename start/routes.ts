/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')//.middleware(['auth'])
  Route.post('/request-password', 'AuthController.requestPassword')
  Route.post('/request-password/validate', 'AuthController.validateRequestPassword')
  Route.post('/request-password/change', 'AuthController.changePassword')
}).prefix('/auth')

Route.group(() => {

  Route.get('/dashboard', 'Admin/DashboardController.index')

  //Usuários
  Route.resource('/users', 'Admin/UsersController')
  Route.get('/members', 'Admin/UsersController.indexMembers')

  //Cargos
  Route.resource('/positions', 'Admin/PositionsController')

  //Departamentos
  Route.resource('/departments', 'Admin/DepartmentsController')

  //Permissões
  Route.resource('/permissions', 'Admin/PermissionsController')

  //Unidades
  Route.resource('/companies', 'Admin/CompaniesController')

  //Projetos
  Route.resource('/projects', 'Admin/ProjectsController')
}).prefix('/admin').middleware(['auth'])

Route.group(() => {}).prefix('/client').middleware(['auth'])

Route.group(() => {
  Route.get('execute-project', 'Client/ProjectsController.execute')
  Route.get('stop-project', 'Client/ProjectsController.stop')
}).prefix('/app').middleware(['auth'])
