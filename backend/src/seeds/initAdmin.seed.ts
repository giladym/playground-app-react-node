import { UserModel } from '../models/user.model';
import { UserRole } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

const DEFAULT_ADMIN = {
  email: 'admin@system.com',
  password: 'admin123',  // Simplified password for testing
  firstName: 'System',
  lastName: 'Admin',
  role: UserRole.ADMIN,
  isEmailVerified: true
};

export class AdminSeeder {
  static async seed() {
    try {
      // Check if admin user exists
      const adminExists = await UserModel.findOne({ role: UserRole.ADMIN });
      
      if (!adminExists) {
        console.log('🌱 Seeding: Creating initial admin user...');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
        
        const adminUser = await UserModel.create({
          ...DEFAULT_ADMIN,
          password: hashedPassword
        });
        
        console.log('✅ Seed Success: Initial admin user created');
        console.log(`📧 Admin Email: ${adminUser.email}`);
        console.log(`🔑 Admin Password: ${DEFAULT_ADMIN.password}`);
        console.log('⚠️  Please change the default password after first login!');
        return true;
      }
      
      console.log('ℹ️  Seed Skipped: Admin user already exists');
      return false;
    } catch (error) {
      console.error('❌ Seed Error:', error);
      throw error;
    }
  }
} 