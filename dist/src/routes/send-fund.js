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
exports.sendFundRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("../common");
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
exports.sendFundRouter = router;
router.post('/api/wallet/send-fund', common_1.requireAuth, [
    express_validator_1.body('name').not().isEmpty().withMessage('Title is requires'),
    express_validator_1.body('description').not().isEmpty().withMessage('Description is requires'),
    express_validator_1.body('transfer_to').not().isEmpty().withMessage('destination is required'),
    express_validator_1.body('walletId').not().isEmpty().withMessage('wallet is required'),
    express_validator_1.body('amount')
        .isFloat({ gt: 0 })
        .not()
        .isEmpty()
        .withMessage('amount must be greater than 0'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, amount, transfer_to, walletId, description } = req.body;
    const userId = req.currentUser.id;
    const client = yield database_1.default.connect();
    const userWallet = yield client.query('SELECT id FROM wallet WHERE id=$1 AND ownerId=$2', [walletId, userId]);
    const transferEallet = yield client.query('SELECT id FROM wallet WHERE id=$1', [transfer_to]);
    const existingUserWallet = userWallet.rows[0];
    const existingDestinationWallet = transferEallet.rows[0];
    if (!existingUserWallet || !existingDestinationWallet) {
        throw new common_1.NotAuthorizedError();
    }
    client.query('INSERT INTO transaction_history (name, amount, beneficialId, walletId, description, ownerId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, amount, transfer_to, walletId, description, userId], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(results.rows[0]);
    });
}));
//# sourceMappingURL=send-fund.js.map