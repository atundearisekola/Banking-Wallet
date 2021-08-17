import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { validateRequest, BadRequestError } from '../common';
import pool from '../config/database';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const client = await pool.connect();
    const sql = "SELECT * FROM users WHERE email=$1";
    const { rows } = await client.query(sql,[email]);
    
    const existingUser = rows[0];

    client.release();
    if (!existingUser) {
      throw new BadRequestError('Invalid credential');
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credential');
    }
 delete existingUser.password
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({...existingUser, token: userJwt });
  }
);

export { router as signinRouter };
