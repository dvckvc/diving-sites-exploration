import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma, DifficultyLevel, DiveType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    const diveType = searchParams.get('diveType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: Prisma.DiveSiteWhereInput = {
      isActive: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (difficulty && Object.values(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'TECHNICAL']).includes(difficulty)) {
      where.difficulty = difficulty as DifficultyLevel
    }

    if (diveType && Object.values(['SHORE', 'BOAT', 'WRECK', 'CAVE', 'DRIFT', 'WALL', 'REEF', 'NIGHT', 'TECHNICAL']).includes(diveType)) {
      where.diveType = {
        has: diveType as DiveType
      }
    }

    // Get total count for pagination
    const total = await prisma.diveSite.count({ where })

    // Get dive sites with creator info
    const diveSites = await prisma.diveSite.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    return NextResponse.json({
      sites: diveSites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching dive sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dive sites' },
      { status: 500 }
    )
  }
}
