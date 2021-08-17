import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { currentUser, NotAuthorizedError, requireAuth } from '../common';

const router = express.Router();

router.get('/api/wallet/all-wallet', currentUser, requireAuth, async(req, res) => {
  
  try {
    const client = await pool.connect();
   
    const wallet = await client.query('SELECT * FROM wallet ');
 
    res.send({ wallets: wallet.rows  });
   
  } catch (error) {
   console.log("ERROR", error)
  }
  
});

export { router as allWalletRouter };
