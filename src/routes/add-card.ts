import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '../common';
import { body } from 'express-validator';
import pool from '../config/database';

const router = express.Router();

router.post(
  '/api/wallet/add-wallet',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is requires'),
    body('description').not().isEmpty().withMessage('Description is requires'),
    
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const userId = req.currentUser!.id
    const client = await pool.connect();
    client.query('INSERT INTO wallet (name, description, ownerid) VALUES ($1, $2, $3) RETURNING *', [name, description, userId], (error, results) => {
      if (error) {
        throw error
      }
      
      res.status(201).send(results.rows[0])
    })
    
  }
);

export { router as addWalletRouter };
