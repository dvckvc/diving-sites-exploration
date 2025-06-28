import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables (without exposing sensitive values)
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Try to connect to database
    let dbStatus = 'unknown'
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      await prisma.user.count()
      dbStatus = 'connected'
      await prisma.$disconnect()
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown error'}`
    }

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
