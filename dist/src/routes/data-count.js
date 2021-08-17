"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataCountRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const common_1 = require("../common");
const router = express_1.default.Router();
exports.dataCountRouter = router;
router.get('/api/users/data-count', common_1.currentUser, common_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield database_1.default.connect();
        const user = yield client.query('SELECT COUNT(id) FROM Users');
        const wallet = yield client.query('SELECT COUNT(id) FROM wallet');
        const walletBalance = yield client.query('SELECT SUM(balance) FROM wallet');
        const tansaction_history = yield client.query('SELECT COUNT(id) FROM tansaction_history');
        res.send({ user: user.rows, wallet: wallet.rows, tansaction_history: tansaction_history.rows, walletBalance: walletBalance });
    }
    catch (error) {
        throw new common_1.NotAuthorizedError();
    }
}));
//# sourceMappingURL=data-count.js.map