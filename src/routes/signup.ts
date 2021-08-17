import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { Password } from '../services/password';

import {
  validateRequest,
  RequestValidationError,
  BadRequestError,
} from '../common';


const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 character'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(req.body)
    const hashed = await Password.toHash(password);
    const client = await pool.connect();
  
    const { rows } = await client.query('SELECT id FROM Users WHERE email=$1',[email]);
    const existingUser = rows[0];
  
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const newUser = await client.query('INSERT INTO Users (email, password) VALUES ($1, $2) RETURNING *',[email, hashed]);
   
    const user = newUser.rows[0];
    delete user.password
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    client.release();
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send({...user, token: userJwt});
  }
);

export { router as signupRouter };
