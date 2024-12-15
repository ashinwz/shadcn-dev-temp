import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { username, email, name, password } = body
    console.log('Processing registration for:', email)

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
      select: { id: true, email: true, username: true } // Only select id, email and username for performance
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with optional name field
    const userData = {
      username,
      email,
      password: hashedPassword,
      ...(name ? { name } : {})  // Only include name if it's provided
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true
      }
    })

    console.log('User created successfully:', user.id)

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        ...(user.name ? { name: user.name } : {})
      }
    })

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      const prismaError = {
        code: error.code,
        message: error.message
      }
      console.error('Prisma error:', prismaError)

      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email or username already exists' },
          { status: 400 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
