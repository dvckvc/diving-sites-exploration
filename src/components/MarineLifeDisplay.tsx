'use client'

import { useState, useEffect } from 'react'
import { Fish, Leaf, Waves } from 'lucide-react'
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
      return 'bg-blue-900 text-blue-300 border-blue-700'
    case 'PLANT':
      return 'bg-green-900 text-green-300 border-green-700'
    case 'CORAL':
      return 'bg-orange-900 text-orange-300 border-orange-700'
    case 'INVERTEBRATE':
      return 'bg-purple-900 text-purple-300 border-purple-700'
    case 'MAMMAL':
      return 'bg-indigo-900 text-indigo-300 border-indigo-700'
    case 'REPTILE':
      return 'bg-emerald-900 text-emerald-300 border-emerald-700'
    default:
      return 'bg-slate-800 text-slate-300 border-slate-600'
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 border border-slate-700 rounded-lg bg-slate-800">
              <Skeleton className="h-12 w-12 rounded-full bg-slate-700" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2 bg-slate-700" />
                <Skeleton className="h-3 w-32 mb-2 bg-slate-700" />
                <Skeleton className="h-3 w-full bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (marineLife.length === 0) {
    return (
      <div>
        <p className="text-slate-400 italic text-center py-8">
          No marine life information available for this dive site yet.
        </p>
      </div>
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
    <div className="space-y-6">
      {Object.entries(groupedMarineLife).map(([type, items]) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-3">
            {getTypeIcon(type)}
            <h4 className="font-medium text-sm text-slate-300 capitalize">
              {type.toLowerCase().replace('_', ' ')}s ({items.length})
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-start gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors bg-slate-800"
              >
                {/* Placeholder for marine life image */}
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-medium text-sm text-slate-200 truncate">
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
                    <p className="text-xs text-slate-400 italic mb-2">
                      {item.latinName}
                    </p>
                  )}
                  
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
