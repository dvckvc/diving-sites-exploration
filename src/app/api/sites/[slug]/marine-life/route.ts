import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Find the dive site using the helper function
    const diveSite = await findSiteBySlug(slug)
    
    if (!diveSite) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }
    
    // Get marine life for this dive site
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marineLife = await (prisma as any).diveSiteMarineLife.findMany({
      where: {
        diveSiteId: diveSite.id
      },
      include: {
        marineLife: true
      },
      orderBy: {
        marineLife: {
          name: 'asc'
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMarineLife = marineLife.map((item: any) => item.marineLife)

    return NextResponse.json(formattedMarineLife)

  } catch (error) {
    console.error('Error fetching marine life:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { marineLifeIds } = await request.json()
    
    if (!Array.isArray(marineLifeIds)) {
      return NextResponse.json(
        { error: 'marineLifeIds must be an array' },
        { status: 400 }
      )
    }

    // Find the dive site using the helper function
    const diveSite = await findSiteBySlug(slug)
    
    if (!diveSite) {
      return NextResponse.json(
        { error: 'Dive site not found' },
        { status: 404 }
      )
    }

    // Remove existing associations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).diveSiteMarineLife.deleteMany({
      where: {
        diveSiteId: diveSite.id
      }
    })

    // Add new associations
    const associations = marineLifeIds.map(marineLifeId => ({
      diveSiteId: diveSite.id,
      marineLifeId
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).diveSiteMarineLife.createMany({
      data: associations
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating marine life:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
