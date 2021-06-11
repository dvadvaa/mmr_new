"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Releases extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'releases';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('type');
            table.string('main_artist', 255).notNullable();
            table.string('another_artists', 255);
            table.string('genre', 255).notNullable();
            table.string('version', 255);
            table.boolean('explicit').notNullable();
            table.string('author', 255).notNullable();
            table.string('date').notNullable();
            table.integer('user_id').notNullable();
            table.string('link').notNullable();
            table.string('label').notNullable();
            table.boolean('accepted').notNullable();
            table.string('reason');
            table.integer('accepted_by');
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Releases;
//# sourceMappingURL=1620594104760_releases.js.map