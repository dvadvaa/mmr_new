"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AuthorizationsController {
    async index({ request, response, auth }) {
        const authSchema = Validator_1.schema.create({
            username: Validator_1.schema.string({}),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(5),
            ]),
        });
        const payload = await request.validate({
            schema: authSchema,
        });
        if (!payload) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        try {
            await auth.use('web').attempt(payload.username, payload.password);
            response.redirect('/dashboard');
        }
        catch (e) {
            return response.badRequest('Invalid credentials');
        }
    }
}
exports.default = AuthorizationsController;
//# sourceMappingURL=AuthorizationsController.js.map