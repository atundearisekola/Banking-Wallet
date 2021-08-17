import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { currentUser, NotAuthorizedError, requireAuth } from '../common';

const router = express.Router();

router.get('/api/users/all-users', currentUser, requireAuth, async(req, res) => {
  type Payload = { id: number; name: string; email: string };
  try {
    const client = await pool.connect();
    
    const {rows} = await client.query('SELECT * FROM Users');
   
    res.send({ users: rows});
   
  } catch (error) {
   console.log("ERROR", error)
  }
  
});

export { router as allUserRouter };
