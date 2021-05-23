"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Admin {
    async handle({ auth, response }, next) {
        if (auth.user.status !== 'admin') {
            return response.badRequest('У вас нет прав.');
        }
        await next();
    }
}
exports.default = Admin;
//# sourceMappingURL=Admin.js.map