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
exports.walletDetailRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const common_1 = require("../common");
const router = express_1.default.Router();
exports.walletDetailRouter = router;
router.get('/api/wallet/:id', common_1.currentUser, common_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const walletId = req.params.id;
        const client = yield database_1.default.connect();
        const token = req.headers.authorization.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        const data = payload;
        const wallet = yield client.query(`SELECT wallet.ownerId, wallet.monthly_interest, wallet.balance
    wallet.description, wallet.name, wallet.createdAt, wallet.id, user.name, user.email FROM wallet WHERE ownerId=$1 AND id=$2 LEFT JOIN user ON wallet.ownerId = users.id`, [data.id, walletId]);
        const walletData = wallet.rows[0];
        const tansaction_history = yield client.query('SELECT * FROM tansaction_history WHERE walletId=$1', [walletData.id]);
        console.log('payload');
        res.send({ wallet: wallet.rows, tansaction_history: tansaction_history.rows });
    }
    catch (error) {
        throw new common_1.NotAuthorizedError();
    }
}));
//# sourceMappingURL=walllet-details.js.map