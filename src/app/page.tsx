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
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero_video.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 drop-shadow-lg">
            Discover Amazing
            <span className="text-cyan-400 block drop-shadow-lg">Diving Sites</span>
          </h1>
          <p className="text-md md:text-lg lg:text-xl text-slate-200 mb-12 max-w-4xl mx-auto drop-shadow-md leading-relaxed">
            Explore underwater worlds, share your experiences, and connect with the diving community. 
            Find detailed information about dive sites worldwide.
          </p>
          
          {!session ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 h-auto" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 h-auto" asChild>
                <Link href="/explore">Explore Dive Sites</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2" asChild>
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose Diving Sites?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <MapPin className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Detailed Locations</CardTitle>
                <CardDescription className="text-slate-300">
                  Get comprehensive information about dive sites including depth, conditions, 
                  marine life, and safety details.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Star className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Community Reviews</CardTitle>
                <CardDescription className="text-slate-300">
                  Read real reviews from fellow divers and share your own experiences 
                  to help the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Users className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Expert Guides</CardTitle>
                <CardDescription className="text-slate-300">
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
        <section className="py-16 px-4 bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-900 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Waves className="h-6 w-6 text-cyan-400" />
                  Welcome back, {session.user.name}!
                </CardTitle>
                <CardDescription className="text-slate-300">
                  You&apos;re signed in as a <strong className="text-cyan-400">{session.user.role}</strong>. 
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
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Test the Platform
          </h3>
          <p className="text-slate-300 mb-8">
            Use these demo accounts to explore different user roles and features:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Admin Account</CardTitle>
                <CardDescription className="text-slate-300">Full system access</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  <strong className="text-cyan-400">Email:</strong> admin@divingsites.com<br />
                  <strong className="text-cyan-400">Password:</strong> admin123
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Guide Account</CardTitle>
                <CardDescription className="text-slate-300">Add & manage dive sites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  <strong className="text-cyan-400">Email:</strong> guide@divingsites.com<br />
                  <strong className="text-cyan-400">Password:</strong> guide123
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">User Account</CardTitle>
                <CardDescription className="text-slate-300">Review & favorite sites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">
                  <strong className="text-cyan-400">Email:</strong> user@divingsites.com<br />
                  <strong className="text-cyan-400">Password:</strong> user123
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
