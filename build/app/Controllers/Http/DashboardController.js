"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Release_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Release"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
class DashboardController {
    async getReleases({ view, auth }) {
        await auth.use('web').authenticate();
        const data = await Release_1.default
            .query()
            .where('user_id', '=', auth.user.id)
            .orderBy('created_at', 'desc');
        return view.render('dashboard/releases', { data: data.length ? data : null });
    }
    async createRelease({ request, auth, response }) {
        const releaseSchema = Validator_1.schema.create({
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(1),
            ]),
            main_artist: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
            ]),
            another_artists: Validator_1.schema.string.optional(),
            version: Validator_1.schema.string.optional(),
            genre: Validator_1.schema.string(),
            explicit: Validator_1.schema.boolean(),
            author: Validator_1.schema.string(),
            date: Validator_1.schema.string(),
            link: Validator_1.schema.string({}, [
                Validator_1.rules.url({}),
            ]),
            label: Validator_1.schema.string(),
        });
        const payload = await request.validate({ schema: releaseSchema,
            messages: {
                required: 'Поле {{ field }} объязательно для заполнения.',
            },
        });
        if (!payload) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        await Release_1.default.create({
            name: payload.name,
            main_artist: payload.main_artist,
            another_artists: payload.another_artists,
            genre: payload.genre,
            explicit: payload.explicit,
            author: payload.author,
            user_id: auth.user.id,
            accepted: false,
            date: payload.date,
            link: payload.link,
            label: payload.label,
            version: payload.version,
        }).catch(err => {
            Logger_1.default.error(err);
            return response.badRequest('Произошла ошибка при добавлении в базу данных, попробуйте позже.');
        });
        Logger_1.default.info('Создан новый релиз.');
        return response.redirect().toRoute('dashboard.releases');
    }
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map