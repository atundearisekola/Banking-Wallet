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
exports.currentUserRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const common_1 = require("../common");
const router = express_1.default.Router();
exports.currentUserRouter = router;
router.get('/api/users/currentuser', common_1.currentUser, common_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const client = yield database_1.default.connect();
        const userId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        let user = yield client.query('SELECT * FROM Users WHERE id=$1', [userId]);
        user = user.rows[0];
        delete user.password;
        const wallet = yield client.query('SELECT * FROM wallet WHERE ownerid=$1', [userId]);
        const tansaction_history = yield client.query('SELECT * FROM transaction_history WHERE ownerid=$1', [userId]);
        res.send({ user, wallet: wallet.rows, tansaction_history: tansaction_history.rows });
    }
    catch (error) {
        console.log("ERROR", error);
        res.status(301).send(error);
    }
}));
//# sourceMappingURL=current-user.js.map