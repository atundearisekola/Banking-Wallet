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
exports.addWalletRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("../common");
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
exports.addWalletRouter = router;
router.post('/api/wallet/add-wallet', common_1.requireAuth, [
    express_validator_1.body('name').not().isEmpty().withMessage('Name is requires'),
    express_validator_1.body('description').not().isEmpty().withMessage('Description is requires'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const userId = req.currentUser.id;
    const client = yield database_1.default.connect();
    client.query('INSERT INTO wallet (name, description, ownerid) VALUES ($1, $2, $3) RETURNING *', [name, description, userId], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(results.rows[0]);
    });
}));
//# sourceMappingURL=add-card.js.map