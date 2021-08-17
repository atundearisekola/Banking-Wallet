import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { currentUser, NotAuthorizedError, requireAuth } from '../common';

const router = express.Router();

router.get('/api/wallet/:id', currentUser,requireAuth, async(req, res) => {
 
  try {
    const walletId = req.params.id
    const client = await pool.connect();
  const userId = req.currentUser?.id
  
    const wallet = await client.query(`SELECT wallet.ownerId, wallet.monthly_interest, wallet.balance
    wallet.description, wallet.name, wallet.createdAt, wallet.id, user.name, user.email FROM wallet WHERE ownerId=$1 AND id=$2 LEFT JOIN user ON wallet.ownerId = users.id`,[userId, walletId]);
    const walletData = wallet.rows[0]
    const tansaction_history = await client.query('SELECT * FROM tansaction_history WHERE walletId=$1',[walletData.id]);
    
    res.send({  wallet: wallet.rows, tansaction_history: tansaction_history.rows  });
   
  } catch (error) {
    throw new NotAuthorizedError();
  }
  
});

export { router as walletDetailRouter };
