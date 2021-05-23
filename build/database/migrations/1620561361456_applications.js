"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Applications extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'applications';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('firstName');
            table.string('lastName');
            table.string('email');
            table.string('username');
            table.string('years');
            table.string('link');
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Applications;
//# sourceMappingURL=1620561361456_applications.js.map