"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
exports.default = new pg_1.Pool({
    max: 20,
    connectionString: 'postgres://znuta:Tmoney00@@00@localhost:5432/wallet_app',
    idleTimeoutMillis: 30000
});
//# sourceMappingURL=database.js.map