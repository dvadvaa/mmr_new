"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/users"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Invite_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Invite"));
class AuthorizationsController {
    async index({ request, response, auth, session }) {
        const authSchema = Validator_1.schema.create({
            username: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(5),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(5),
            ]),
        });
        const payload = await request.validate({
            schema: authSchema,
            messages: {
                'username.minLength': 'Логин должен быть больше 4 символов',
                'password.minLength': 'Пароль должен быть больше 4 символов',
            },
        });
        if (!payload) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        try {
            await auth.use('web').attempt(payload.username, payload.password);
            response.redirect('/dashboard');
        }
        catch (e) {
            session.flash('error', 'Неверный логин или пароль.');
            response.redirect().back();
        }
    }
    async register({ request, response, auth, session }) {
        const registerSchema = Validator_1.schema.create({
            username: Validator_1.schema.string({}, [
                Validator_1.rules.unique({ table: 'users', column: 'username' }),
                Validator_1.rules.minLength(5),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(5),
            ]),
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
                Validator_1.rules.unique({ table: 'users', column: 'email' }),
            ]),
            invite: Validator_1.schema.string({}, [
                Validator_1.rules.exists({ table: 'invites', column: 'code' }),
            ]),
        });
        const payload = await request.validate({
            schema: registerSchema,
            messages: {
                required: 'The {{ field }} is required to create a new account',
                'username.unique': 'Данный логин недоступен',
                'email.unique': 'Данный email недоступен',
                'username.minLength': 'Логин должен быть больше 4 символов',
                'password.minLength': 'Пароль должен быть больше 4 символов',
                'invite.exists': 'Введен неверный инвайт-код',
            },
        });
        if (!payload) {
            Logger_1.default.error('Произошла ошибка при регистрации пользователя.');
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        const user = await users_1.default.findBy('username', payload.username);
        if (user) {
            return response.badRequest('Пользователь с таким логином уже зарегистрирован.');
        }
        const invite = await Invite_1.default.findBy('code', payload.invite);
        if (invite.used) {
            return session.flash('error', 'Инвайт-код уже активирован');
        }
        delete payload.invite;
        payload.status = 'invited';
        payload.invited_by = invite.author_id;
        let newUser = await users_1.default.create(payload);
        invite.used = true;
        invite.user_id = newUser.id;
        await invite.save();
        await auth.use('web').attempt(payload.username, payload.password);
        response.redirect('/dashboard');
    }
}
exports.default = AuthorizationsController;
//# sourceMappingURL=AuthorizationsController.js.map