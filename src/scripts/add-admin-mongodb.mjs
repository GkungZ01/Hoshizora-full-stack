import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import readline from 'readline';
import * as dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

// โหลดค่า environment variables จากไฟล์ .env โดยตรง
dotenv.config();

// สร้าง interface สำหรับรับข้อมูล
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ฟังก์ชันถามคำถาม
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n===== เพิ่มผู้ใช้ Admin =====\n');
  
  // เชื่อมต่อกับ MongoDB โดยตรงแทนที่จะใช้ Prisma
  const client = new MongoClient(process.env.DATABASE_URL || '');
  
  try {
    await client.connect();
    console.log('เชื่อมต่อกับ MongoDB เรียบร้อยแล้ว');
    
    // เลือกฐานข้อมูลและคอลเลกชั่น
    const db = client.db('hoshizora'); // ชื่อฐานข้อมูลของคุณ
    const users = db.collection('User');
    
    // รับข้อมูลผู้ใช้
    const name = await question('ชื่อผู้ใช้: ');
    const email = await question('อีเมล: ');
    const password = await question('รหัสผ่าน: ');
    
    console.log('\nกำลังสร้างผู้ใช้...');
    
    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      console.log('\nมีอีเมลนี้ในระบบแล้ว');
      
      // ถามว่าต้องการอัปเดตเป็น Admin หรือไม่
      const updateToAdmin = await question('ต้องการอัปเดตผู้ใช้นี้เป็น Admin หรือไม่? (y/n): ');
      
      if (updateToAdmin.toLowerCase() === 'y') {
        await users.updateOne(
          { email },
          { $set: { role: 'ADMIN' } }
        );
        console.log('\nอัปเดตผู้ใช้เป็น Admin เรียบร้อยแล้ว');
      } else {
        console.log('\nยกเลิกการอัปเดต');
      }
    } else {
      // สร้างผู้ใช้ใหม่
      const hashedPassword = await hash(password, 12);
      
      await users.insertOne({
        _id: new ObjectId(),
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('\nสร้างผู้ใช้ Admin เรียบร้อยแล้ว');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  } finally {
    rl.close();
    await client.close();
  }
}

main();