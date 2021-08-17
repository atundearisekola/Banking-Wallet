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
exports.signupRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../services/password");
const common_1 = require("../common");
const router = express_1.default.Router();
exports.signupRouter = router;
router.post('/api/users/signup', [
    express_validator_1.body('email').isEmail().withMessage('Email must be valid'),
    express_validator_1.body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 character'),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    const hashed = yield password_1.Password.toHash(password);
    const client = yield database_1.default.connect();
    const { rows } = yield client.query('SELECT id FROM Users WHERE email=$1', [email]);
    const existingUser = rows[0];
    if (existingUser) {
        throw new common_1.BadRequestError('Email in use');
    }
    const newUser = yield client.query('INSERT INTO Users (email, password) VALUES ($1, $2) RETURNING *', [email, hashed]);
    const user = newUser.rows[0];
    delete user.password;
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY);
    client.release();
    req.session = {
        jwt: userJwt,
    };
    res.status(201).send(Object.assign(Object.assign({}, user), { token: userJwt }));
}));
//# sourceMappingURL=signup.js.map