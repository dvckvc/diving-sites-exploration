'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function StarRating({ 
  rating, 
  onChange, 
  readonly = false, 
  size = 'md', 
  showValue = false,
  className 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  const handleStarClick = (starRating: number) => {
    if (!readonly && onChange) {
      onChange(starRating)
    }
  }
  
  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating)
    }
  }
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }
  
  const displayRating = hoverRating || rating
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
          const isFilled = star <= displayRating
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              disabled={readonly}
              className={cn(
                sizeClasses[size],
                'transition-colors',
                readonly 
                  ? 'cursor-default' 
                  : 'cursor-pointer hover:scale-110 transition-transform',
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 hover:text-yellow-200'
              )}
            >
              <Star className="w-full h-full" />
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {displayRating}/10
        </span>
      )}
    </div>
  )
}
