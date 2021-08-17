import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotAuthorizedError } from '../common';
import { body } from 'express-validator';
import pool from '../config/database';
const router = express.Router();
router.post(
  '/api/wallet/send-fund',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Title is requires'),
    body('description').not().isEmpty().withMessage('Description is requires'),
    body('transfer_to').not().isEmpty().withMessage('destination is required'),
    body('walletId').not().isEmpty().withMessage('wallet is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .not()
      .isEmpty()
      .withMessage('amount must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, amount, transfer_to, walletId, description } = req.body;
    const userId = req.currentUser!.id
    const client = await pool.connect();
    const userWallet = await client.query('SELECT id FROM wallet WHERE id=$1 AND ownerId=$2',[walletId,userId]);
    const transferEallet = await client.query('SELECT id FROM wallet WHERE id=$1',[transfer_to]);
    const existingUserWallet = userWallet.rows[0];
    const existingDestinationWallet = transferEallet.rows[0];
    if (!existingUserWallet || !existingDestinationWallet) {
      throw new NotAuthorizedError();
    }

    client.query('INSERT INTO transaction_history (name, amount, beneficialId, walletId, description, ownerId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, amount, transfer_to, walletId, description, userId], (error, results) => {
      if (error) {
        throw error
      }
      
      res.status(201).send( results.rows[0])
    })


  }
);

export { router as sendFundRouter };
