import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const client = new MongoClient(process.env.DATABASE_URL || '')
    try {
      await client.connect()
      const users = client.db('hoshizora').collection('User')

      // Check existing user
      if (await users.findOne({ email })) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      // Hash and save
      const hashed = await hash(password, 12)
      const { insertedId } = await users.insertOne({
        name,
        email,
        password: hashed,
        image: null,
        githubUsername: null,
      })

      // Return new user
      return NextResponse.json(
        { id: insertedId.toString(), name, email, image: null },
        { status: 201 }
      )
    } finally {
      await client.close()
    }
  } catch (err) {
    console.error('Reg error:', err)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
