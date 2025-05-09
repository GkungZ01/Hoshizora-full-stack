import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' }, { status: 500 });
  }
}

// POST - เพิ่มผู้ใช้ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, image, githubUsername } = body;
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        githubUsername
      }
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' }, { status: 500 });
  }
}