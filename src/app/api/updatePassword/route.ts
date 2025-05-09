import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { hash, compare } from 'bcryptjs';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบว่ามีการล็อกอินหรือไม่
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'ต้องเข้าสู่ระบบก่อนใช้งาน' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;
    
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }
    
    const uri = process.env.DATABASE_URL || "";
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const database = client.db("hoshizora");
      const usersCollection = database.collection("User");
      
      // ค้นหาผู้ใช้ด้วย ID
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId)
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'ไม่พบผู้ใช้' },
          { status: 404 }
        );
      }
      
      // ตรวจสอบรหัสผ่านปัจจุบัน
      if (user.password) {
        const passwordValid = await compare(currentPassword, user.password);
        
        if (!passwordValid) {
          return NextResponse.json(
            { error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' },
            { status: 401 }
          );
        }
      }
      
      // แฮชรหัสผ่านใหม่
      const hashedPassword = await hash(newPassword, 12);
      
      // อัปเดตรหัสผ่าน
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
      
      return NextResponse.json(
        { message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' },
        { status: 200 }
      );
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' },
      { status: 500 }
    );
  }
}