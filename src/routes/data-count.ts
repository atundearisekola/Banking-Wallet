import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { currentUser, NotAuthorizedError, requireAuth } from '../common';

const router = express.Router();

router.get('/api/users/data-count', currentUser,requireAuth, async(req, res) => {
 
  try {
    const client = await pool.connect();
   
    const user = await client.query('SELECT COUNT(id) FROM Users');
    const wallet = await client.query('SELECT COUNT(id) FROM wallet');
    const walletBalance = await client.query('SELECT SUM(balance) FROM wallet');
    const tansaction_history = await client.query('SELECT COUNT(id) FROM tansaction_history');
    
    res.send({ user:user.rows, wallet: wallet.rows, tansaction_history: tansaction_history.rows, walletBalance: walletBalance  });
   
  } catch (error) {
    throw new NotAuthorizedError();
  }
  
});

export { router as dataCountRouter };
