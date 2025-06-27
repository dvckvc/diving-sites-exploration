'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRating } from '@/components/ui/star-rating'
import { ReviewForm } from '@/components/ReviewForm'
import { MarineLifeDisplay } from '@/components/MarineLifeDisplay'

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
      return 'bg-green-100 text-green-800 border-green-200'
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'ADVANCED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'TECHNICAL':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-24 mb-6" />
        
        {/* Hero section skeleton */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <Skeleton className="h-64 w-full" />
          <div className="p-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="overflow-hidden mb-6">
          {/* Site Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-500/20 to-teal-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Waves className="h-16 w-16 text-blue-500/40" />
            </div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
              {session && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className={`bg-white/90 hover:bg-white ${
                    isFavorited ? 'text-red-500' : 'text-gray-600'
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
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {site.name}
                </CardTitle>
                <CardDescription className="flex items-center text-base">
                  <MapPin className="h-4 w-4 mr-1" />
                  {site.location}
                </CardDescription>
              </div>
              
              {session && site.averageRating && (
                <div className="ml-4">
                  {renderStarRating(site.averageRating)}
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {site.counts?.reviews} review{site.counts?.reviews !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
            
            {/* Dive Types */}
            <div className="flex flex-wrap gap-2 mt-4">
              {site.diveType.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {formatDiveType(type)}
                </Badge>
              ))}
            </div>
            
            {/* Description */}
            {site.description && (
              <p className="text-gray-700 mt-4 leading-relaxed">
                {site.description}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Gauge className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-sm">
                {site.depthMin}-{site.depthMax}m
              </div>
              <div className="text-xs text-gray-500">Depth</div>
            </CardContent>
          </Card>
          
          {session && site.temperatureMin && site.temperatureMax && (
            <Card>
              <CardContent className="p-4 text-center">
                <Thermometer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">
                  {site.temperatureMin}-{site.temperatureMax}°C
                </div>
                <div className="text-xs text-gray-500">Temperature</div>
              </CardContent>
            </Card>
          )}
          
          {session && site.visibilityMin && site.visibilityMax && (
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">
                  {site.visibilityMin}-{site.visibilityMax}m
                </div>
                <div className="text-xs text-gray-500">Visibility</div>
              </CardContent>
            </Card>
          )}
          
          {session && site.averageDiveDuration && (
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">
                  {site.averageDiveDuration} min
                </div>
                <div className="text-xs text-gray-500">Avg Duration</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content Tabs */}
        {session ? (
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="marine-life">Marine Life</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Diving Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Diving Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {site.currentConditions && (
                    <div>
                      <div className="font-medium text-sm text-gray-600">Current Conditions</div>
                      <div className="text-gray-900">{site.currentConditions}</div>
                    </div>
                  )}
                  
                  {site.driftPotential && (
                    <div>
                      <div className="font-medium text-sm text-gray-600">Drift Potential</div>
                      <div className="text-gray-900">{site.driftPotential}</div>
                    </div>
                  )}
                  
                  {site.entryPoint && (
                    <div>
                      <div className="font-medium text-sm text-gray-600">Entry Point</div>
                      <div className="text-gray-900">{site.entryPoint}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications Required */}
              {site.requiredCertification && site.requiredCertification.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Required Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {site.requiredCertification.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hazards & Safety */}
              {(site.hazards || site.emergencyInfo) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Safety Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {site.hazards && (
                      <div>
                        <div className="font-medium text-sm text-gray-600">Potential Hazards</div>
                        <div className="text-gray-900">{site.hazards}</div>
                      </div>
                    )}
                    
                    {site.emergencyInfo && (
                      <div>
                        <div className="font-medium text-sm text-gray-600">Emergency Information</div>
                        <div className="text-gray-900">{site.emergencyInfo}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Permits & Fees */}
              {site.permitsFees && (
                <Card>
                  <CardHeader>
                    <CardTitle>Permits & Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{site.permitsFees}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="marine-life">
              <MarineLifeDisplay siteId={params.slug as string} />
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
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
                
                {/* Reviews List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Reviews ({site.counts?.reviews || 0})
                      </div>
                      <div className="flex gap-2">
                        {userReview ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowReviewForm(true)}
                            >
                              Edit Review
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={handleDeleteReview}
                            >
                              Delete Review
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => setShowReviewForm(true)}
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
                          <div key={review.id || index} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {review.user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {review.user?.name || 'Anonymous'}
                                    {review.user?.id === session?.user?.id && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Your Review
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              {renderStarRating(review.rating)}
                            </div>
                            {review.title && (
                              <div className="font-medium text-sm mb-1">{review.title}</div>
                            )}
                            <p className="text-gray-700 text-sm">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">
                        No reviews yet. Be the first to review this dive site!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photos ({site.counts?.photos || 0})
                    </div>
                    <Button size="sm">Add Photo</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {site.photos && site.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {site.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">
                      No photos yet. Share your underwater shots!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          /* Guest View - Limited Information */
          <Card>
            <CardHeader>
              <CardTitle>Sign in for Full Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sign in to access detailed diving conditions, marine life information, reviews, and photos.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Site Metadata */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  Added by {site.createdBy.name || 'Anonymous'} 
                  {site.createdBy.role === 'GUIDE' && (
                    <Badge variant="outline" className="ml-2 text-xs">
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