import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for review submission
const reviewSchema = z.object({
  rating: z.number().min(1).max(10),
  title: z.string().optional(),
  content: z.string().min(10).max(2000)
})

// Helper function to convert slug to site name and find site
async function findSiteBySlug(slug: string) {
  // Try multiple variations of converting slug back to name
  const siteName1 = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  
  // Try with " - " separators (common in site names)
  const siteName2 = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' - ')
  
  return prisma.diveSite.findFirst({
    where: {
      OR: [
        { name: siteName1 },
        { name: siteName2 },
        { name: { contains: siteName1.split(' ')[0] } } // Fallback: match first word
      ]
    }
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if dive site exists
    const diveSite = await findSiteBySlug(slug)

    if (!diveSite) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }

    // Check if user already has a review for this site
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_diveSiteId: {
          userId: session.user.id,
          diveSiteId: diveSite.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this dive site' },
        { status: 409 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        userId: session.user.id,
        diveSiteId: diveSite.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Find the dive site
    const diveSite = await findSiteBySlug(slug)
    
    if (!diveSite) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }

    // Check if user has a review for this site
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_diveSiteId: {
          userId: session.user.id,
          diveSiteId: diveSite.id
        }
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: {
        userId_diveSiteId: {
          userId: session.user.id,
          diveSiteId: diveSite.id
        }
      },
      data: {
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(updatedReview)

  } catch (error) {
    console.error('Error updating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find the dive site
    const diveSite = await findSiteBySlug(slug)
    
    if (!diveSite) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }

    // Check if user has a review for this site
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_diveSiteId: {
          userId: session.user.id,
          diveSiteId: diveSite.id
        }
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Delete the review
    await prisma.review.delete({
      where: {
        userId_diveSiteId: {
          userId: session.user.id,
          diveSiteId: diveSite.id
        }
      }
    })

    return NextResponse.json({ message: 'Review deleted successfully' })

  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
