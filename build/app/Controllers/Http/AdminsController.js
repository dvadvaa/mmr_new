"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/users"));
const Release_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Release"));
class AdminsController {
    async registerUser({ request, response }) {
        const registrationSchema = Validator_1.schema.create({
            username: Validator_1.schema.string(),
            password: Validator_1.schema.string(),
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
            ]),
            status: Validator_1.schema.string(),
        });
        const payload = await request.validate({ schema: registrationSchema });
        if (!payload) {
            Logger_1.default.error('Произошла ошибка при регистрации пользователя.');
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const user = await users_1.default.findBy('username', payload.username);
        if (user) {
            return response.badRequest('Пользователь с таким логином уже зарегистрирован.');
        }
        await users_1.default.create(payload);
        return response.redirect().toRoute('admin.newUser');
    }
    async getAllReleases({ view }) {
        const data = await Release_1.default
            .query()
            .orderBy('created_at', 'desc');
        return view.render('admin/releases', { data: data.length ? data : null });
    }
    async getAllUsers({ view }) {
        const data = await users_1.default
            .query()
            .orderBy('created_at', 'desc');
        return view.render('admin/users', { data: data.length ? data : null });
    }
    async setMoneyUser({ params, response, request }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const user = await users_1.default.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден. #2'));
        if (!user) {
            return response.badRequest('Пользователь не найден.');
        }
        const Schema = Validator_1.schema.create({
            balance: Validator_1.schema.number(),
        });
        const payload = await request.validate({ schema: Schema });
        if (!payload) {
            return response.badRequest('Укажите сумму.');
        }
        user.balance = payload.balance;
        await user.save();
        return response.redirect().toRoute('admin.users');
    }
    async deleteUser({ params, response }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const user = await users_1.default.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден.'));
        if (!user) {
            return response.badRequest('Пользователь не найден.');
        }
        await user.delete();
        return response.redirect().toRoute('admin.users');
    }
    async editUserData({ params, response, request }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const user = await users_1.default.findOrFail(params.id).catch(_ => response.badRequest('Пользователь не найден.'));
        if (!user) {
            return response.badRequest('Пользователь не найден.');
        }
        const Schema = Validator_1.schema.create({
            username: Validator_1.schema.string.optional(),
            password: Validator_1.schema.string.optional(),
            email: Validator_1.schema.string.optional(),
            status: Validator_1.schema.string.optional(),
        });
        const payload = await request.validate({ schema: Schema });
        console.log(payload);
        if (!payload) {
            return response.badRequest('Укажите новый пароль пользователя.');
        }
        if (payload.username && payload.password && payload.email && payload.status) {
            user.username = payload.username;
            user.password = payload.password;
            user.email = payload.email;
            user.status = payload.status;
        }
        else if (payload.username) {
            user.username = payload.username;
        }
        else if (payload.password) {
            user.password = payload.password;
        }
        else if (payload.email) {
            user.email = payload.email;
        }
        else if (payload.status) {
            user.status = payload.status;
        }
        else {
            return response.redirect().toRoute('admin.users');
        }
        await user.save();
        return response.redirect().toRoute('admin.users');
    }
    async deleteRelease({ params, response }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const release = await Release_1.default.findOrFail(params.id).catch(_ => response.badRequest('Релиз не найден.'));
        if (!release) {
            return response.badRequest('Релиз не найден.');
        }
        await release.delete();
        return response.redirect().toRoute('admin.releases');
    }
    async acceptRelease({ params, response }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const release = await Release_1.default.findOrFail(params.id).catch(_ => {
            return response.badRequest('Релиз не найден.');
        });
        if (!release) {
            return response.badRequest('Релиз не найден.');
        }
        release.accepted = 1;
        await release.save();
        return response.redirect().toRoute('admin.releases');
    }
    async declineRelease({ params, response, request }) {
        if (!params.id) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const release = await Release_1.default.findOrFail(params.id).catch(_ => response.badRequest('Релиз не найден.'));
        if (!release) {
            return response.badRequest('Релиз не найден.');
        }
        const Schema = Validator_1.schema.create({
            reason: Validator_1.schema.string({}),
        });
        const payload = await request.validate({ schema: Schema });
        if (!payload.reason) {
            release.reason = '-';
            release.accepted = 2;
            await release.save();
            return response.redirect().toRoute('admin.releases');
        }
        release.accepted = 2;
        release.reason = payload.reason;
        await release.save().catch(err => console.log(err));
        return response.redirect().toRoute('admin.releases');
    }
}
exports.default = AdminsController;
//# sourceMappingURL=AdminsController.js.map