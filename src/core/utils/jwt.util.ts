import jwt, { Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback_secret_key';

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1d',
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};