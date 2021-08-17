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
exports.createTicketRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@znuta-tickets/common");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
exports.createTicketRouter = router;
router.post('/api/tickets', common_1.requireAuth, [
    express_validator_1.body('title').not().isEmpty().withMessage('Title is requires'),
    express_validator_1.body('price')
        .isFloat({ gt: 0 })
        .not()
        .isEmpty()
        .withMessage('Price must be greater than 0'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price } = req.body;
    // const ticket = Ticket.build({
    //   title,
    //   price,
    //   userId: req.currentUser!.id,
    // });
    // res.status(201).send(ticket);
}));
//# sourceMappingURL=new.js.map