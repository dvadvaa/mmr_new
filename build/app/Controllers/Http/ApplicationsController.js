"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Application"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const axios_1 = __importDefault(require("axios"));
class ApplicationsController {
    async index({ request, response }) {
        const applicationSchema = Validator_1.schema.create({
            firstName: Validator_1.schema.string({ trim: true, escape: true }),
            lastName: Validator_1.schema.string({ trim: true, escape: true }),
            email: Validator_1.schema.string({}, [
                Validator_1.rules.email(),
            ]),
            username: Validator_1.schema.string({ trim: true, escape: true }),
            years: Validator_1.schema.number([
                Validator_1.rules.range(15, 100),
            ]),
            link: Validator_1.schema.string({}, [
                Validator_1.rules.url({
                    allowedHosts: ['vk.com'],
                }),
            ]),
        });
        const payload = await request.validate({ schema: applicationSchema,
            messages: {
                required: 'Поле {{ field }} объязательно для заполнения.',
                'years.range': 'Вам должно быть больше 14 лет.',
                'link.url': 'Разрешены ссылки только на vk.com',
            },
        });
        const application = await Application_1.default.create(payload);
        if (!application) {
            Logger_1.default.error('Произошла ошибка при добавлении в базу (запрос лейбл).');
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        Logger_1.default.info('Новый запрос на лейбл.');
        await axios_1.default.get(encodeURI(`https://api.telegram.org/bot1794482115:AAH6_8n3dTG8Xod_DYuMpuK9UVqFOykxj8Q/sendMessage?chat_id=-1001265810174&text=
    Имя: ${payload.firstName}\nФамилия: ${payload.lastName}\ne-mail:${payload.email}\nusername:${payload.username}\nЛет:${payload.years}\nlink:${payload.link}`)).catch(_ => {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        });
        return response.redirect().toRoute('success');
    }
}
exports.default = ApplicationsController;
//# sourceMappingURL=ApplicationsController.js.map