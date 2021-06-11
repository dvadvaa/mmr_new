"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post('/user/new', 'AdminsController.registerUser');
    Route_1.default.get('/release/accept/:id', 'AdminsController.acceptRelease');
    Route_1.default.post('/release/decline/:id', 'AdminsController.declineRelease');
    Route_1.default.post('/release/delete/:id', 'AdminsController.deleteRelease');
    Route_1.default.post('/user/delete/:id', 'AdminsController.deleteUser');
    Route_1.default.post('/user/money/:id', 'AdminsController.setMoneyUser');
    Route_1.default.post('/user/data/:id', 'AdminsController.editUserData');
}).prefix('/api/admin').middleware('auth').middleware('admin');
Route_1.default.group(() => {
    Route_1.default.post('/application', 'ApplicationsController.index');
    Route_1.default.post('/register', 'AuthorizationsController.register');
    Route_1.default.post('/login', 'AuthorizationsController.index');
}).prefix('/api');
Route_1.default.group(() => {
    Route_1.default.post('/release/new', 'DashboardController.createRelease');
    Route_1.default.post('/invite/new', 'InvitesController.createInvite');
}).prefix('/api/user').middleware('auth');
Route_1.default.get('/', async ({ view }) => {
    return view.render('index');
}).as('index');
Route_1.default.get('/success', async ({ view }) => {
    return view.render('success');
}).as('success');
Route_1.default.post('/logout', async ({ auth, response }) => {
    await auth.use('web').logout();
    response.redirect('/');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/', ({ view }) => view.render('admin/index')).as('admin.index');
    Route_1.default.get('/users/new', ({ view }) => view.render('admin/newuser')).as('admin.newUser');
    Route_1.default.get('/releases', 'AdminsController.getAllReleases').as('admin.releases');
    Route_1.default.get('/users', 'AdminsController.getAllUsers').as('admin.users');
}).prefix('/admin').middleware('auth').middleware('admin');
Route_1.default.group(() => {
    Route_1.default.get('/', async ({ view }) => view.render('dashboard/index')).as('dashboard.index');
    Route_1.default.get('/releases', 'DashboardController.getReleases').as('dashboard.releases');
    Route_1.default.get('/releases/new', ({ view }) => view.render('dashboard/new')).as('dashboard.newRelease');
    Route_1.default.get('/invites', 'InvitesController.getAllUsers').as('admin.invites');
}).prefix('/dashboard').middleware('auth');
//# sourceMappingURL=routes.js.map