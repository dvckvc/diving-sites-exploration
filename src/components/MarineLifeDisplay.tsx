'use client'

import { useState, useEffect } from 'react'
import { Fish, Leaf, Waves } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface MarineLifeItem {
  id: string
  name: string
  latinName?: string
  type: 'FISH' | 'PLANT' | 'CORAL' | 'INVERTEBRATE' | 'MAMMAL' | 'REPTILE'
  image?: string
  description?: string
}

interface MarineLifeDisplayProps {
  siteId: string
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'FISH':
    case 'MAMMAL':
    case 'REPTILE':
      return <Fish className="h-4 w-4" />
    case 'PLANT':
      return <Leaf className="h-4 w-4" />
    case 'CORAL':
    case 'INVERTEBRATE':
      return <Waves className="h-4 w-4" />
    default:
      return <Fish className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'FISH':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PLANT':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CORAL':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'INVERTEBRATE':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'MAMMAL':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'REPTILE':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function MarineLifeDisplay({ siteId }: MarineLifeDisplayProps) {
  const [marineLife, setMarineLife] = useState<MarineLifeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarineLife = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/sites/${siteId}/marine-life`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch marine life')
        }
        
        const data = await response.json()
        setMarineLife(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (siteId) {
      fetchMarineLife()
    }
  }, [siteId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Marine Life
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Marine Life
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (marineLife.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Marine Life
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic text-center py-8">
            No marine life information available for this dive site yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group by type for better organization
  const groupedMarineLife = marineLife.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, MarineLifeItem[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fish className="h-5 w-5" />
          Marine Life ({marineLife.length} species)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedMarineLife).map(([type, items]) => (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              {getTypeIcon(type)}
              <h4 className="font-medium text-sm text-gray-700 capitalize">
                {type.toLowerCase().replace('_', ' ')}s ({items.length})
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  {/* Placeholder for marine life image */}
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h5>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(item.type)} flex-shrink-0`}
                      >
                        {item.type.toLowerCase()}
                      </Badge>
                    </div>
                    
                    {item.latinName && (
                      <p className="text-xs text-gray-500 italic mb-2">
                        {item.latinName}
                      </p>
                    )}
                    
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
