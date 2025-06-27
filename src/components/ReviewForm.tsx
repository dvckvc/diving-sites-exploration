'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StarRating } from '@/components/ui/star-rating'

// Temporary inline Textarea component
const Textarea = ({ className, ...props }: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={`border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className || ''}`}
      {...props}
    />
  )
}

interface ReviewFormProps {
  siteId: string
  onSuccess: () => void
  onCancel: () => void
  existingReview?: {
    rating: number
    title?: string
    content: string
  }
}

export function ReviewForm({ siteId, onSuccess, onCancel, existingReview }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [content, setContent] = useState(existingReview?.content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!existingReview

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Please sign in to write a review.
          </p>
          <Button onClick={onCancel} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (content.trim().length < 10) {
      setError('Review content must be at least 10 characters long')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const url = `/api/sites/${siteId}/reviews`
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          content: content.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </CardTitle>
          <Button 
            onClick={onCancel} 
            variant="ghost" 
            size="sm"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-3">
              <StarRating 
                rating={rating} 
                onChange={setRating}
                size="lg"
                showValue
              />
            </div>
            <p className="text-xs text-gray-500">
              Click on a star to rate (1-10 stars)
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Title (optional)</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="e.g., Amazing visibility!"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="review-content">Review *</Label>
            <Textarea
              id="review-content"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Share your diving experience at this site..."
              rows={4}
              maxLength={2000}
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-gray-500">
              {content.length}/2000 characters (minimum 10 required)
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0 || content.trim().length < 10}
              className="flex-1"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
