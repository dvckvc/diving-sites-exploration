'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Waves, Fish, Star, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigation } from '@/components/Navigation'

interface DiveSite {
  id: string
  name: string
  location: string
  description: string | null
  latitude: number | null
  longitude: number | null
  difficulty: string
  maxDepth: number | null
  visibility: number | null
  waterTemp: number | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  sites: DiveSite[]
  total: number
  hasMore: boolean
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'ADVANCED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'EXPERT':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const formatDifficulty = (difficulty: string) => {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase()
}

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function SiteCard({ site }: { site: DiveSite }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {site.imageUrl ? (
          <Image
            src={site.imageUrl}
            alt={site.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
            <Waves className="h-12 w-12 text-blue-500/40" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getDifficultyColor(site.difficulty)}`}>
          {formatDifficulty(site.difficulty)}
        </Badge>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{site.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {site.location}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">4.5</span>
            <span className="text-sm text-gray-500 ml-1">(12)</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {site.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{site.description}</p>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {site.maxDepth && (
              <div>
                <span className="text-gray-500">Max Depth:</span>
                <span className="ml-1 font-medium">{site.maxDepth}m</span>
              </div>
            )}
            {site.visibility && (
              <div>
                <span className="text-gray-500">Visibility:</span>
                <span className="ml-1 font-medium">{site.visibility}m</span>
              </div>
            )}
            {site.waterTemp && (
              <div>
                <span className="text-gray-500">Temperature:</span>
                <span className="ml-1 font-medium">{site.waterTemp}°C</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Best Time:</span>
              <span className="ml-1 font-medium">Year Round</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1" asChild>
            <Link href={`/site/${generateSlug(site.name)}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="icon">
            <Fish className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SiteCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExplorePage() {
  const [sites, setSites] = useState<DiveSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (debouncedQuery) {
          params.append('search', debouncedQuery)
        }
        if (selectedDifficulty !== 'all') {
          params.append('difficulty', selectedDifficulty)
        }
        params.append('limit', '12')
        
        const response = await fetch(`/api/sites?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch dive sites')
        }
        
        const data: ApiResponse = await response.json()
        setSites(data.sites)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [debouncedQuery, selectedDifficulty])

  const filteredSitesByDifficulty = (difficulty: string) => {
    return sites.filter(site => site.difficulty === difficulty)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Discover Amazing Diving Sites</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the world&apos;s most incredible underwater destinations. From coral reefs to historic wrecks, find your
            next diving adventure.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search diving sites or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <section className="px-4 mb-8">
          <div className="container mx-auto">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="px-4 pb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${sites.length} Diving Sites Found`}
            </h3>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SiteCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Sites Grid */}
          {!loading && !error && sites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sites.length === 0 && (
            <div className="text-center py-12">
              <Fish className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No diving sites found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      {!loading && sites.length > 0 && (
        <section className="bg-blue-50 py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Destinations</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover some of the most popular and highly-rated diving destinations by difficulty level.
              </p>
            </div>

            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sites.slice(0, 3).map((site) => (
                    <Card key={site.id} className="text-center hover:shadow-md transition-shadow">
                      <CardHeader>
                        {site.imageUrl ? (
                          <Image
                            src={site.imageUrl}
                            alt={site.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-lg mb-4 flex items-center justify-center">
                            <Waves className="h-8 w-8 text-blue-500/40" />
                          </div>
                        )}
                        <CardTitle>{site.name}</CardTitle>
                        <CardDescription>{site.location}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="beginner" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredSitesByDifficulty('BEGINNER').slice(0, 3).map((site) => (
                    <Card key={site.id} className="text-center hover:shadow-md transition-shadow">
                      <CardHeader>
                        {site.imageUrl ? (
                          <Image
                            src={site.imageUrl}
                            alt={site.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg mb-4 flex items-center justify-center">
                            <Waves className="h-8 w-8 text-green-500/40" />
                          </div>
                        )}
                        <CardTitle>{site.name}</CardTitle>
                        <CardDescription>{site.location}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                {filteredSitesByDifficulty('BEGINNER').length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No beginner sites available at the moment.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredSitesByDifficulty('ADVANCED').slice(0, 3).map((site) => (
                    <Card key={site.id} className="text-center hover:shadow-md transition-shadow">
                      <CardHeader>
                        {site.imageUrl ? (
                          <Image
                            src={site.imageUrl}
                            alt={site.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg mb-4 flex items-center justify-center">
                            <Waves className="h-8 w-8 text-red-500/40" />
                          </div>
                        )}
                        <CardTitle>{site.name}</CardTitle>
                        <CardDescription>{site.location}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                {filteredSitesByDifficulty('ADVANCED').length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No advanced sites available at the moment.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
    </div>
  )
}