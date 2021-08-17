import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { currentUser, NotAuthorizedError, requireAuth } from '../common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, async(req, res) => {
 
  try {
    const client = await pool.connect();
  const userId = req.currentUser?.id
    let user = await client.query('SELECT * FROM Users WHERE id=$1',[userId]);
    user = user.rows[0]
    delete user.password

    const wallet = await client.query('SELECT * FROM wallet WHERE ownerid=$1',[userId]);
    const tansaction_history = await client.query('SELECT * FROM transaction_history WHERE ownerid=$1',[userId]);
  
    res.send({ user, wallet: wallet.rows, tansaction_history: tansaction_history.rows  });
   
  } catch (error) {
    console.log("ERROR", error)
    
    res.status(301).send(error);
  }
  
});

export { router as currentUserRouter };
