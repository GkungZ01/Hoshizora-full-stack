import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import readline from 'readline';
import * as dotenv from 'dotenv';

// โหลดค่า environment variables จากไฟล์ .env โดยตรง
dotenv.config();

const prisma = new PrismaClient();

// สร้าง interface สำหรับรับข้อมูล
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ฟังก์ชันถามคำถาม
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n===== เพิ่มผู้ใช้ Admin =====\n');
  
  try {
    // รับข้อมูลผู้ใช้
    const name = await question('ชื่อผู้ใช้: ');
    const email = await question('อีเมล: ');
    const password = await question('รหัสผ่าน: ');
    
    console.log('\nกำลังสร้างผู้ใช้...');
    
    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('\nมีอีเมลนี้ในระบบแล้ว');
      
      // ถามว่าต้องการอัปเดตเป็น Admin หรือไม่
      const updateToAdmin = await question('ต้องการอัปเดตผู้ใช้นี้เป็น Admin หรือไม่? (y/n): ');
      
      if (updateToAdmin.toLowerCase() === 'y') {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        console.log('\nอัปเดตผู้ใช้เป็น Admin เรียบร้อยแล้ว');
      } else {
        console.log('\nยกเลิกการอัปเดต');
      }
    } else {
      // สร้างผู้ใช้ใหม่
      const hashedPassword = await hash(password, 12);
      
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('\nสร้างผู้ใช้ Admin เรียบร้อยแล้ว');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();