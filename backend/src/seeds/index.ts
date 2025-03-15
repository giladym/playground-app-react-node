import { AdminSeeder } from './initAdmin.seed';

export class DatabaseSeeder {
  static async run() {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Run all seeds in sequence
      await AdminSeeder.seed();
      
      console.log('✅ Database seeding completed');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
} 