'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Gauge, 
  Thermometer, 
  Eye,
  Clock,
  Heart,
  Share2,
  AlertTriangle,
  Award,
  Info,
  Camera,
  MessageCircle,
  Users,
  Waves
} from 'lucide-react'

import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRating } from '@/components/ui/star-rating'
import { ReviewForm } from '@/components/ReviewForm'
import { MarineLifeDisplay } from '@/components/MarineLifeDisplay'

// Dynamically import the map component to avoid SSR issues
const DiveSiteMap = dynamic(
  () => import('@/components/DiveSiteMap').then((mod) => mod.DiveSiteMap),
  { 
    ssr: false,
    loading: () => (
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-slate-400">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  createdAt: string
  user?: {
    id: string
    name: string | null
    avatar: string | null
  }
}

interface Photo {
  id: string
  url: string
  caption?: string
  createdAt: string
  user?: {
    id: string
    name: string | null
  }
}

interface DiveSite {
  id: string
  name: string
  description: string | null
  location: string
  latitude: number
  longitude: number
  depthMin: number
  depthMax: number
  diveType: string[]
  difficulty: string
  createdBy: {
    id: string
    name: string | null
    role: string
  }
  createdAt: string
  // Authenticated user data
  currentConditions?: string
  driftPotential?: string
  entryPoint?: string
  visibilityMin?: number
  visibilityMax?: number
  temperatureMin?: number
  temperatureMax?: number
  emergencyInfo?: string
  requiredCertification?: string[]
  marineLife?: string
  averageDiveDuration?: number
  hazards?: string
  permitsFees?: string
  ecoData?: string
  reviews?: Review[]
  photos?: Photo[]
  averageRating?: number
  counts?: {
    reviews: number
    favorites: number
    photos: number
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'bg-green-900 text-green-300 border-green-700'
    case 'INTERMEDIATE':
      return 'bg-yellow-900 text-yellow-300 border-yellow-700'
    case 'ADVANCED':
      return 'bg-red-900 text-red-300 border-red-700'
    case 'TECHNICAL':
      return 'bg-purple-900 text-purple-300 border-purple-700'
    default:
      return 'bg-slate-800 text-slate-300 border-slate-600'
  }
}

const formatDifficulty = (difficulty: string) => {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase()
}

const formatDiveType = (type: string) => {
  return type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-24 mb-6 bg-slate-800" />
        
        {/* Hero section skeleton */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden mb-6">
          <Skeleton className="h-64 w-full bg-slate-700" />
          <div className="p-6">
            <Skeleton className="h-8 w-3/4 mb-2 bg-slate-700" />
            <Skeleton className="h-4 w-1/2 mb-4 bg-slate-700" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20 bg-slate-700" />
              <Skeleton className="h-6 w-24 bg-slate-700" />
            </div>
            <Skeleton className="h-20 w-full bg-slate-700" />
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DiveSiteDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [site, setSite] = useState<DiveSite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/sites/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Dive site not found')
          }
          throw new Error('Failed to fetch dive site')
        }
        
        const data = await response.json()
        setSite(data)
        
        // Check if the current user has already reviewed this site
        if (session?.user?.id && data.reviews) {
          const existingUserReview = data.reviews.find(
            (review: Review) => review.user?.id === session.user.id
          )
          setUserReview(existingUserReview || null)
        }
        
        // Update document title dynamically
        if (data.name && data.location) {
          document.title = `${data.name} - ${data.location} | Diving Sites`
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchSite()
    }
  }, [params.slug, session?.user?.id])

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    // Refetch the site data to get updated reviews
    if (params.slug) {
      const fetchSite = async () => {
        try {
          const response = await fetch(`/api/sites/${params.slug}`)
          if (response.ok) {
            const data = await response.json()
            setSite(data)
            
            // Update user's review state
            if (session?.user?.id && data.reviews) {
              const existingUserReview = data.reviews.find(
                (review: Review) => review.user?.id === session.user.id
              )
              setUserReview(existingUserReview || null)
            }
          }
        } catch (err) {
          console.error('Error refetching site data:', err)
        }
      }
      fetchSite()
    }
  }

  const handleDeleteReview = async () => {
    if (!userReview || !params.slug) return
    
    try {
      const response = await fetch(`/api/sites/${params.slug}/reviews`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        handleReviewSuccess() // This will refetch the data
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Alert className="border-red-700 bg-red-900/50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!site) {
    return null
  }

  const renderStarRating = (rating: number) => {
    return (
      <StarRating 
        rating={rating} 
        readonly 
        size="sm" 
        showValue 
        className="justify-center"
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden mb-6">
          {/* Site Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-cyan-500/20 to-teal-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Waves className="h-16 w-16 text-cyan-400/60" />
            </div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="bg-slate-800/90 hover:bg-slate-800 border-slate-600">
                <Share2 className="h-4 w-4" />
              </Button>
              {session && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className={`bg-slate-800/90 hover:bg-slate-800 border-slate-600 ${
                    isFavorited ? 'text-red-400' : 'text-slate-400'
                  }`}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
            
            {/* Difficulty Badge */}
            <div className="absolute bottom-4 left-4">
              <Badge className={getDifficultyColor(site.difficulty)}>
                {formatDifficulty(site.difficulty)}
              </Badge>
            </div>
          </div>
          
          {/* Site Info */}
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {site.name}
                </CardTitle>
                <CardDescription className="flex items-center text-base text-slate-300">
                  <MapPin className="h-4 w-4 mr-1" />
                  {site.location}
                </CardDescription>
              </div>
              
              {session && site.averageRating && (
                <div className="ml-4">
                  {renderStarRating(site.averageRating)}
                  <div className="text-xs text-slate-400 text-center mt-1">
                    {site.counts?.reviews} review{site.counts?.reviews !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
            
            {/* Dive Types */}
            <div className="flex flex-wrap gap-2 mt-4">
              {site.diveType.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                  {formatDiveType(type)}
                </Badge>
              ))}
            </div>
            
            {/* Description */}
            {site.description && (
              <p className="text-slate-300 mt-4 leading-relaxed">
                {site.description}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Gauge className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <div className="font-semibold text-sm text-white">
                {site.depthMin}-{site.depthMax}m
              </div>
              <div className="text-xs text-slate-400">Depth</div>
            </CardContent>
          </Card>
          
          {session && site.temperatureMin && site.temperatureMax && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Thermometer className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="font-semibold text-sm text-white">
                  {site.temperatureMin}-{site.temperatureMax}°C
                </div>
                <div className="text-xs text-slate-400">Temperature</div>
              </CardContent>
            </Card>
          )}
          
          {session && site.visibilityMin && site.visibilityMax && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold text-sm text-white">
                  {site.visibilityMin}-{site.visibilityMax}m
                </div>
                <div className="text-xs text-slate-400">Visibility</div>
              </CardContent>
            </Card>
          )}
          
          {session && site.averageDiveDuration && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="font-semibold text-sm text-white">
                  {site.averageDiveDuration} min
                </div>
                <div className="text-xs text-slate-400">Avg Duration</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Location Map */}
        <DiveSiteMap
          latitude={site.latitude}
          longitude={site.longitude}
          siteName={site.name}
          location={site.location}
          className="mb-6"
        />

        {/* Content Sections */}
        {session ? (
          <div className="space-y-6">
            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm
                siteId={params.slug as string}
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
                existingReview={userReview ? {
                  rating: userReview.rating,
                  title: userReview.title,
                  content: userReview.content
                } : undefined}
              />
            )}

            {/* Diving Conditions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5 text-cyan-400" />
                  Diving Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {site.currentConditions && (
                  <div>
                    <div className="font-medium text-sm text-slate-400">Current Conditions</div>
                    <div className="text-slate-200">{site.currentConditions}</div>
                  </div>
                )}
                
                {site.driftPotential && (
                  <div>
                    <div className="font-medium text-sm text-slate-400">Drift Potential</div>
                    <div className="text-slate-200">{site.driftPotential}</div>
                  </div>
                )}
                
                {site.entryPoint && (
                  <div>
                    <div className="font-medium text-sm text-slate-400">Entry Point</div>
                    <div className="text-slate-200">{site.entryPoint}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications Required */}
            {site.requiredCertification && site.requiredCertification.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="h-5 w-5 text-cyan-400" />
                    Required Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {site.requiredCertification.map((cert, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                        {cert.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hazards & Safety */}
            {(site.hazards || site.emergencyInfo) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Safety Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {site.hazards && (
                    <div>
                      <div className="font-medium text-sm text-slate-400">Potential Hazards</div>
                      <div className="text-slate-200">{site.hazards}</div>
                    </div>
                  )}
                  
                  {site.emergencyInfo && (
                    <div>
                      <div className="font-medium text-sm text-slate-400">Emergency Information</div>
                      <div className="text-slate-200">{site.emergencyInfo}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Permits & Fees */}
            {site.permitsFees && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Permits & Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{site.permitsFees}</p>
                </CardContent>
              </Card>
            )}

            {/* Marine Life */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Waves className="h-5 w-5 text-teal-400" />
                  Marine Life
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarineLifeDisplay siteId={params.slug as string} />
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-cyan-400" />
                    Reviews ({site.counts?.reviews || 0})
                  </div>
                  <div className="flex gap-2">
                    {userReview ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowReviewForm(true)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Edit Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={handleDeleteReview}
                          className="bg-red-900 hover:bg-red-800 text-red-300"
                        >
                          Delete Review
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => setShowReviewForm(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        Write Review
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {site.reviews && site.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {site.reviews.map((review, index) => (
                      <div key={review.id || index} className="border-b border-slate-700 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-200">
                                {review.user?.name || 'Anonymous'}
                                {review.user?.id === session?.user?.id && (
                                  <Badge variant="outline" className="ml-2 text-xs border-slate-600 text-slate-300">
                                    Your Review
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {renderStarRating(review.rating)}
                        </div>
                        {review.title && (
                          <div className="font-medium text-sm mb-1 text-slate-200">{review.title}</div>
                        )}
                        <p className="text-slate-300 text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-center py-8">
                    No reviews yet. Be the first to review this dive site!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-cyan-400" />
                    Photos ({site.counts?.photos || 0})
                  </div>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Add Photo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {site.photos && site.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {site.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-slate-700 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="h-8 w-8 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-center py-8">
                    No photos yet. Share your underwater shots!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Guest View - Limited Information */
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sign in for Full Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Sign in to access detailed diving conditions, marine life information, reviews, and photos.
              </p>
              <div className="flex gap-2">
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Site Metadata */}
        <Card className="mt-6 bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  Added by {site.createdBy.name || 'Anonymous'} 
                  {site.createdBy.role === 'GUIDE' && (
                    <Badge variant="outline" className="ml-2 text-xs border-slate-600 text-slate-300">
                      Dive Guide
                    </Badge>
                  )}
                </span>
              </div>
              <div>
                {new Date(site.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}