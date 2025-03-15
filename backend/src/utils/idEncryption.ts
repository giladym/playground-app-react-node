import crypto from 'crypto';
import { Types } from 'mongoose';

const ENCRYPTION_KEY = process.env.ID_ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ID_ENCRYPTION_KEY must be 32 characters long');
}

export class IdEncryption {
  static encrypt(id: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!), iv);
    let encrypted = cipher.update(id);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  static decrypt(encrypted: string): string {
    const [ivHex, encryptedHex] = encrypted.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted ID format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  static encryptId(id: Types.ObjectId): string {
    return this.encrypt(id.toString());
  }

  static decryptId(encrypted: string): Types.ObjectId {
    return new Types.ObjectId(this.decrypt(encrypted));
  }

  static encryptObject<T extends { _id: Types.ObjectId }>(obj: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = obj;
    return {
      ...rest,
      id: this.encryptId(_id),
    };
  }

  static encryptObjects<T extends { _id: Types.ObjectId }>(objects: T[]): (Omit<T, '_id'> & { id: string })[] {
    return objects.map(obj => this.encryptObject(obj));
  }
} 