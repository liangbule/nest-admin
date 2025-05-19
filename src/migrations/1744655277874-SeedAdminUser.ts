import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1744655277874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if any user exists
    const userCount = await queryRunner.query(
      `SELECT COUNT(*) as count FROM users`,
    );

    // Only seed if no users exist
    if (userCount[0].count === '0') {
      console.log('No users found. Creating test user...');

      // Create hashed password
      const saltRounds = 10;
      const password = 'test123';
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert test user
      await queryRunner.query(
        `INSERT INTO users (username, email, password, status) 
                VALUES (?, ?, ?, ?)`,
        ['testuser', 'test@example.com', hashedPassword, 1],
      );

      console.log('Test user created successfully!');
      console.log('Username: testuser');
      console.log('Password: test123');
    } else {
      console.log(
        'Users already exist in the database. Skipping user creation.',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE username = 'testuser'`);
  }
}
