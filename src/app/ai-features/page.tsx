import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Sparkles, Shirt, Palette, Users, ArrowRight } from "lucide-react";

/**
 * AI Features Page
 * Showcases the AI capabilities of the platform
 */
export default function AIFeaturesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-accent-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary-800 dark:text-white md:text-5xl lg:text-6xl">
              AI-Powered Shopping Experience
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              Discover how artificial intelligence enhances your shopping journey with personalized recommendations, 
              virtual try-on, and unique designs.
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-accent-100 px-4 py-1 text-sm font-medium text-accent-800 dark:bg-accent-900/30 dark:text-accent-400">
              <Cpu className="mr-2 h-4 w-4" />
              AI Features
            </div>
            <h2 className="mb-4 text-3xl font-bold text-primary-800 dark:text-white md:text-4xl">
              Transforming Fashion with AI
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Our platform leverages cutting-edge AI technologies to create a unique and personalized shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Virtual Try-On */}
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Shirt className="h-6 w-6" />
                </div>
                <CardTitle>Virtual Try-On</CardTitle>
                <CardDescription>
                  See how clothes look on you before buying with our AI-powered virtual fitting room.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/features/virtual-try-on.jpg"
                    alt="Virtual Try-On"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link href="/virtual-try-on">
                  <a className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Try It Now
                  </a>
                </Link>
              </CardContent>
            </Card>

            {/* Artist Design Platform */}
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Palette className="h-6 w-6" />
                </div>
                <CardTitle>Artist Design Platform</CardTitle>
                <CardDescription>
                  Discover unique designs created with the help of AI by independent artists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/features/artist-designs.jpg"
                    alt="Artist Designs"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link href="/artist-designs">
                  <a className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Explore Designs
                  </a>
                </Link>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Get clothing suggestions tailored to your style preferences and past purchases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/features/recommendations.jpg"
                    alt="Personalized Recommendations"
                    fill
                    className="object-cover"
                  />
                </div>
                <Link href="/ai-recommendations">
                  <a className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Recommendations
                  </a>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-800 dark:text-white md:text-4xl">
              How Our AI Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Behind the scenes, our platform uses sophisticated AI models to deliver a seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/features/ai-technology.jpg"
                alt="AI Technology"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold text-primary-800 dark:text-white">
                Cutting-Edge Technology
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 rounded-full bg-accent-100 p-1 dark:bg-accent-900/30">
                    <svg className="h-5 w-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Computer Vision</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our AI analyzes body shapes and clothing styles to create realistic virtual try-ons.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 rounded-full bg-accent-100 p-1 dark:bg-accent-900/30">
                    <svg className="h-5 w-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Machine Learning</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Recommendation engines learn from your preferences to suggest items you'll love.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 rounded-full bg-accent-100 p-1 dark:bg-accent-900/30">
                    <svg className="h-5 w-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Generative AI</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Artists use AI tools to create unique designs that stand out from mass-produced fashion.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/technology">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Learn More About Our Technology
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-800 py-20 text-white dark:bg-primary-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Experience the Future of Fashion?
            </h2>
            <p className="mb-8 text-lg text-gray-200">
              Join thousands of customers who have transformed their shopping experience with our AI-powered platform.
            </p>
            <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/products">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Shop Now
                </a>
              </Link>
              <Link href="/register">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-white text-white hover:bg-white/10">
                  Create Account
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 