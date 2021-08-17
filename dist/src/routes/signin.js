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
exports.signinRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_1 = require("../services/password");
const common_1 = require("../common");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
exports.signinRouter = router;
router.post('/api/users/signin', [
    express_validator_1.body('email').isEmail().withMessage('Email must be valid'),
    express_validator_1.body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const client = yield database_1.default.connect();
    const sql = "SELECT * FROM users WHERE email=$1";
    const { rows } = yield client.query(sql, [email]);
    const existingUser = rows[0];
    client.release();
    if (!existingUser) {
        throw new common_1.BadRequestError('Invalid credential');
    }
    const passwordsMatch = yield password_1.Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new common_1.BadRequestError('Invalid credential');
    }
    delete existingUser.password;
    const userJwt = jsonwebtoken_1.default.sign({
        id: existingUser.id,
        email: existingUser.email,
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt,
    };
    res.status(200).send(Object.assign(Object.assign({}, existingUser), { token: userJwt }));
}));
//# sourceMappingURL=signin.js.map