import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import supabase from '../utils/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    // add other claims if needed
  };
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  /* 
  // Verification Strategy 1: Local JWT Verify (Requires exact JWT Secret)
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) { ... }
  */

  // Debug log: Check which project signed the token
  const unverifiedDecode = jwt.decode(token);
  console.log('Token Issuer:', (unverifiedDecode as any)?.iss);
  console.log('Server Supabase URL:', process.env.SUPABASE_URL);

  // Verification Strategy 2: Call Supabase Auth API (Robust, uses Service Key)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Supabase Auth verification failed details:', {
        message: error?.message,
        status: error?.status,
        name: error?.name
      });
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
