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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const database_1 = __importDefault(require("./config/database"));
const cookie_session_1 = __importDefault(require("cookie-session"));
require("dotenv/config");
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signout_1 = require("./routes/signout");
const signup_1 = require("./routes/signup");
const add_card_1 = require("./routes/add-card");
const all_user_1 = require("./routes/all-user");
const all_wallet_1 = require("./routes/all-wallet");
const data_count_1 = require("./routes/data-count");
const send_fund_1 = require("./routes/send-fund");
const walllet_details_1 = require("./routes/walllet-details");
const common_1 = require("./common");
var fs = require('fs');
const fastcsv = require("fast-csv");
var sql = fs.readFileSync('dbinit.sql').toString();
const app = express_1.default();
app.set('trust proxy', true);
app.use(body_parser_1.json());
app.use(cookie_session_1.default({
    name: 'session',
    signed: false,
    secure: true,
}));
app.use(common_1.currentUser);
app.use(current_user_1.currentUserRouter);
app.use(signin_1.signinRouter);
app.use(signout_1.signoutRouter);
app.use(signup_1.signupRouter);
app.use(add_card_1.addWalletRouter);
app.use(all_user_1.allUserRouter);
app.use(all_wallet_1.allWalletRouter);
app.use(send_fund_1.sendFundRouter);
app.use(data_count_1.dataCountRouter);
app.use(walllet_details_1.walletDetailRouter);
app.all('*', () => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.DATABASE_URL) {
        throw new Error('MONGO_URI must be defined');
    }
    let stream = fs.createReadStream("state_lga.csv");
    let csvData = [];
    let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
        csvData.push(data);
    })
        .on("end", function () {
        // remove the first line: header
        csvData.shift();
        database_1.default.connect(function (err, client, done) {
            if (err)
                throw new Error(err);
            const query = "INSERT INTO state_lga (lga, state) VALUES ($1, $2)";
            try {
                csvData.forEach(row => {
                    client.query(query, row, (err, res) => {
                        if (err) {
                            console.log(err.stack);
                        }
                        else {
                            console.log("inserted " + res.rowCount + " row:", row);
                        }
                    });
                });
            }
            finally {
                done();
            }
            console.log('Connected to Mongo DB !!!');
        });
    });
    stream.pipe(csvStream);
    app.listen(3000, () => {
        console.log('Listening on port 3000!!!');
    });
});
start();
//# sourceMappingURL=index.js.map