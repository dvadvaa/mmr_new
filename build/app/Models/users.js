"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Release_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Release"));
class users extends Orm_1.BaseModel {
    static async hashPassword(users) {
        if (users.$dirty.password) {
            users.password = await Hash_1.default.make(users.password);
        }
    }
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], users.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], users.prototype, "username", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], users.prototype, "email", void 0);
__decorate([
    Orm_1.column({ serializeAs: null }),
    __metadata("design:type", String)
], users.prototype, "password", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], users.prototype, "rememberMeToken", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], users.prototype, "status", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], users.prototype, "balance", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], users.prototype, "invited_by", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], users.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], users.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.hasMany(() => Release_1.default, {
        localKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], users.prototype, "releases", void 0);
__decorate([
    Orm_1.beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users]),
    __metadata("design:returntype", Promise)
], users, "hashPassword", null);
exports.default = users;
//# sourceMappingURL=users.js.map