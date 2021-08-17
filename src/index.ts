import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import pool from './config/database';
import cookieSession from 'cookie-session';
import "dotenv/config";
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { addWalletRouter } from './routes/add-card';
import { allUserRouter } from './routes/all-user';
import { allWalletRouter } from './routes/all-wallet';
import { dataCountRouter } from './routes/data-count';

import { sendFundRouter } from './routes/send-fund';
import { walletDetailRouter } from './routes/walllet-details';
import { errorHandler, NotFoundError, currentUser } from './common';
var fs = require('fs');
// var sql = fs.readFileSync('dbinit.sql').toString();
const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    name: 'session',
    signed: false,
    secure: true,
  })
);
app.use(currentUser);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(addWalletRouter);
app.use(allUserRouter);
app.use(allWalletRouter);
app.use(sendFundRouter);
app.use(dataCountRouter);
app.use(walletDetailRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('MONGO_URI must be defined');
  }
 
  pool.connect(function (err, client, done) {
    if (err) throw new Error(err);
  //   client.query(sql, function(err, result){
  //     done();
  //     if(err){
  //         console.log('error: ', err);
         
  //     }
     
  // });
  console.log('Connected to DB !!!');
  }); 

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
