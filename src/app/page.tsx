"use client"

import { useSession } from "next-auth/react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Waves, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing
            <span className="text-blue-600 block">Diving Sites</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore underwater worlds, share your experiences, and connect with the diving community. 
            Find detailed information about dive sites worldwide.
          </p>
          
          {!session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/explore">Explore Dive Sites</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Diving Sites?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Detailed Locations</CardTitle>
                <CardDescription>
                  Get comprehensive information about dive sites including depth, conditions, 
                  marine life, and safety details.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Community Reviews</CardTitle>
                <CardDescription>
                  Read real reviews from fellow divers and share your own experiences 
                  to help the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Expert Guides</CardTitle>
                <CardDescription>
                  Connect with certified dive guides and instructors who share 
                  professional insights and recommendations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Status Section */}
      {session && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-6 w-6 text-blue-600" />
                  Welcome back, {session.user.name}!
                </CardTitle>
                <CardDescription>
                  You&apos;re signed in as a <strong>{session.user.role}</strong>. 
                  {session.user.role === 'ADMIN' && ' You have full system access.'}
                  {session.user.role === 'GUIDE' && ' You can add and manage dive sites.'}
                  {session.user.role === 'USER' && ' You can review sites and manage favorites.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/sites">Browse Dive Sites</Link>
                  </Button>
                  {(session.user.role === 'GUIDE' || session.user.role === 'ADMIN') && (
                    <Button variant="outline" asChild>
                      <Link href="/sites/new">Add New Site</Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Test Accounts Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Test the Platform
          </h3>
          <p className="text-gray-600 mb-8">
            Use these demo accounts to explore different user roles and features:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Account</CardTitle>
                <CardDescription>Full system access</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> admin@divingsites.com<br />
                  <strong>Password:</strong> admin123
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guide Account</CardTitle>
                <CardDescription>Add & manage dive sites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> guide@divingsites.com<br />
                  <strong>Password:</strong> guide123
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Account</CardTitle>
                <CardDescription>Review & favorite sites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> user@divingsites.com<br />
                  <strong>Password:</strong> user123
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
