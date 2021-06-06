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
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/user/new', 'AdminsController.registerUser')
  Route.get('/release/accept/:id', 'AdminsController.acceptRelease')
  Route.post('/release/decline/:id', 'AdminsController.declineRelease')
  Route.post('/release/delete/:id', 'AdminsController.deleteRelease')
  Route.post('/user/delete/:id', 'AdminsController.deleteUser')
  Route.post('/user/money/:id', 'AdminsController.setMoneyUser')
  Route.post('/user/data/:id', 'AdminsController.editUserData')
}).prefix('/api/admin').middleware('auth').middleware('admin')

Route.group(() => {
  Route.post('/application', 'ApplicationsController.index')
  Route.post('/register', 'AuthorizationsController.register')
  Route.post('/login', 'AuthorizationsController.index')
}).prefix('/api')

Route.group(() => {
  Route.post('/release/new', 'DashboardController.createRelease')
  Route.post('/invite/new', 'InvitesController.createInvite')
}).prefix('/api/user').middleware('auth')

Route.get('/', async ({ view }) => {
  return view.render('index')
}).as('index')

Route.get('/success', async ({ view }) => {
  return view.render('success')
}).as('success')

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/')
}).middleware('auth')

Route.group(() => {
  Route.get('/', ({ view }) => view.render('admin/index')).as('admin.index')
  Route.get('/users/new', ({ view }) => view.render('admin/newuser')).as('admin.newUser')
  Route.get('/releases', 'AdminsController.getAllReleases').as('admin.releases')
  Route.get('/users', 'AdminsController.getAllUsers').as('admin.users')
}).prefix('/admin').middleware('auth').middleware('admin')

Route.group(() => {
  Route.get('/', async ({ view }) => view.render('dashboard/index')).as('dashboard.index')
  Route.get('/releases', 'DashboardController.getReleases').as('dashboard.releases')
  Route.get('/releases/new', ({ view }) => view.render('dashboard/new')).as('dashboard.newRelease')
  Route.get('/invites', 'InvitesController.getAllUsers').as('admin.invites')
}).prefix('/dashboard').middleware('auth')
