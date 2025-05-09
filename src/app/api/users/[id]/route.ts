import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

// GET - ดึงข้อมูลผู้ใช้ตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    // ตรวจสอบการล็อกอิน
    if (!session?.user) {
      return NextResponse.json({ error: 'ต้องเข้าสู่ระบบก่อนใช้งาน' }, { status: 401 });
    }

    const id = params.id;
    const uri = process.env.DATABASE_URL || "";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("hoshizora");
      const usersCollection = database.collection("User");

      const user = await usersCollection.findOne({
        _id: new ObjectId(id)
      });

      if (!user) {
        return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
      }

      // ปกปิดข้อมูลรหัสผ่าน
      const { password, ...userWithoutPassword } = user;

      return NextResponse.json(userWithoutPassword);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    // ตรวจสอบการล็อกอิน
    if (!session?.user) {
      return NextResponse.json({ error: 'ต้องเข้าสู่ระบบก่อนใช้งาน' }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (ผู้ใช้สามารถอัปเดตได้เฉพาะข้อมูลของตัวเอง)
    const userId = params.id;
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้นี้' }, { status: 403 });
    }

    const body = await request.json();

    // ป้องกันการแก้ไขฟิลด์ที่ละเอียดอ่อน
    const { password, email, ...safeData } = body;

    const uri = process.env.DATABASE_URL || "";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("hoshizora");
      const usersCollection = database.collection("User");

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: safeData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
      }

      // ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว
      const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
      const { password: _, ...updatedUserWithoutPassword } = updatedUser as any;

      return NextResponse.json(updatedUserWithoutPassword);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('User PUT error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้' }, { status: 500 });
  }
}

// DELETE - ลบผู้ใช้
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    // ตรวจสอบการล็อกอิน
    if (!session?.user) {
      return NextResponse.json({ error: 'ต้องเข้าสู่ระบบก่อนใช้งาน' }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (ผู้ใช้สามารถลบได้เฉพาะบัญชีของตัวเอง)
    const userId = params.id;
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบผู้ใช้นี้' }, { status: 403 });
    }

    const uri = process.env.DATABASE_URL || "";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("hoshizora");
      const usersCollection = database.collection("User");

      const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
      }

      return NextResponse.json({ message: 'ลบผู้ใช้สำเร็จ' });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' }, { status: 500 });
  }
}