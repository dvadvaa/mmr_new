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
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/users"));
class Release extends Orm_1.BaseModel {
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Release.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "type", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "name", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "main_artist", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "another_artists", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "genre", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "version", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Release.prototype, "explicit", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "author", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "date", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "link", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "label", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "reason", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "social", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Release.prototype, "promo", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Release.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Release.prototype, "accepted", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Release.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Release.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.belongsTo(() => users_1.default, {
        localKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], Release.prototype, "author_profile", void 0);
exports.default = Release;
//# sourceMappingURL=Release.js.map