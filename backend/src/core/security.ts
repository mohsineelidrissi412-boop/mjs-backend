import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyforlocaldashboard';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'anothersecretkeyforrefreshingtokens';

export class Security {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate short-lived access token.
  // Cast as any bypasses strict StringValue type check on newer jsonwebtoken typings.
  static generateAccessToken(payload: { userId: number; role: string }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30m'
    } as any);
  }

  // Generate long-lived refresh token
  static generateRefreshToken(payload: { userId: number }): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    } as any);
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
      return null;
    }
  }
}
