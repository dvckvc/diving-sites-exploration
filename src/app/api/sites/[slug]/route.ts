import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    const isAuthenticated = !!session?.user
    
    // Try multiple variations of converting slug back to name
    const siteName1 = slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    // Try with " - " separators (common in site names)
    const siteName2 = slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' - ')
    
    // Find site by name with multiple variations
    const site = await prisma.diveSite.findFirst({
      where: {
        OR: [
          { name: siteName1 },
          { name: siteName2 },
          { name: { contains: siteName1.split(' ')[0] } } // Fallback: match first word
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        ...(isAuthenticated && {
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          photos: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
              photos: true
            }
          }
        })
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }

    // Calculate average rating if authenticated and reviews exist
    let averageRating = null
    if (isAuthenticated && 'reviews' in site && site.reviews) {
      const ratings = site.reviews.map((review: { rating: number }) => review.rating)
      if (ratings.length > 0) {
        averageRating = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      }
    }

    // Return different data based on authentication status
    const response = {
      id: site.id,
      name: site.name,
      description: site.description,
      location: site.location,
      latitude: site.latitude,
      longitude: site.longitude,
      depthMin: site.depthMin,
      depthMax: site.depthMax,
      diveType: site.diveType,
      difficulty: site.difficulty,
      createdBy: site.createdBy,
      createdAt: site.createdAt,
      ...(isAuthenticated && {
        // Additional data for authenticated users
        currentConditions: site.currentConditions,
        driftPotential: site.driftPotential,
        entryPoint: site.entryPoint,
        visibilityMin: site.visibilityMin,
        visibilityMax: site.visibilityMax,
        temperatureMin: site.temperatureMin,
        temperatureMax: site.temperatureMax,
        emergencyInfo: site.emergencyInfo,
        requiredCertification: site.requiredCertification,
        marineLife: site.marineLife,
        averageDiveDuration: site.averageDiveDuration,
        hazards: site.hazards,
        permitsFees: site.permitsFees,
        ecoData: site.ecoData,
        reviews: 'reviews' in site ? site.reviews : undefined,
        photos: 'photos' in site ? site.photos : undefined,
        averageRating,
        counts: '_count' in site ? site._count : undefined
      })
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching dive site:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
