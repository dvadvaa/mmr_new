"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Release_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Release"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class DashboardController {
    async getReleases({ view, auth }) {
        await auth.use('web').authenticate();
        const releasesByInvUser = await Database_1.default
            .from('releases')
            .whereIn('user_id', Database_1.default
            .from('users')
            .select('id')
            .where('invited_by', '=', auth.user.id)).orderBy('created_at', 'desc');
        const releasesByUser = await Database_1.default
            .from('releases')
            .where('user_id', '=', auth.user.id)
            .orderBy('created_at', 'desc');
        return view.render('dashboard/releases', { data: [...releasesByUser, ...releasesByInvUser] });
    }
    async createRelease({ request, response, auth }) {
        const releaseSchema = Validator_1.schema.create({
            name: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(1),
            ]),
            main_artist: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(2),
            ]),
            another_artists: Validator_1.schema.string.optional(),
            version: Validator_1.schema.string.optional(),
            genre: Validator_1.schema.enum(['hip-hop', 'pop', 'rock']),
            explicit: Validator_1.schema.boolean(),
            author: Validator_1.schema.string(),
            date: Validator_1.schema.string(),
            link: Validator_1.schema.string({}, [
                Validator_1.rules.url({}),
            ]),
            label: Validator_1.schema.string(),
            type: Validator_1.schema.enum(['audio', 'video']),
        });
        const payload = await request.validate({ schema: releaseSchema,
            messages: {
                required: 'Поле {{ field }} объязательно для заполнения.',
                enum: 'Введите верные значения в поле выбора.',
                'main_artist.minLength': 'Значение поля "Главный исполнитель" должно быть больше чем 2 символа.',
                url: 'Введите валидную ссылку.',
            },
        });
        if (!payload) {
            return response.badRequest('Произошла ошибка, попробуйте позже.');
        }
        await Release_1.default.create({
            type: payload.type,
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