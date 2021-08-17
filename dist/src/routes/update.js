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
exports.updateTicketRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@znuta-tickets/common");
const express_validator_1 = require("express-validator");
// import { Ticket } from '../models/ticket';
// import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
// import { natsWrapper } from '../nats-wrapper';
const router = express_1.default.Router();
exports.updateTicketRouter = router;
router.put('/api/tickets/:id', common_1.requireAuth, [
    express_validator_1.body('title').not().isEmpty().withMessage('Title is required'),
    express_validator_1.body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be provided and must be greater than 0'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const ticket = await Ticket.findById(req.params.id);
    // if (!ticket) {
    //   return new NotFoundError();
    // }
    // if (ticket.userId !== req.currentUser!.id) {
    //   throw new NotAuthorizedError();
    // }
    // res.send(ticket);
}));
//# sourceMappingURL=update.js.map