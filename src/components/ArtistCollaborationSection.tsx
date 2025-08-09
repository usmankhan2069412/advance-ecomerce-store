import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Info, Leaf, Star } from "lucide-react";

interface ArtistCollaboration {
  id: string;
  name: string;
  artistName: string;
  description: string;
  imageUrl: string;
  isLimited: boolean;
  isSustainable: boolean;
  releaseDate: string;
}

interface ArtistCollaborationSectionProps {
  collaborations?: ArtistCollaboration[];
  title?: string;
  subtitle?: string;
}

const ArtistCollaborationSection = ({
  collaborations = [
    {
      id: "1",
      name: "Neural Couture Collection",
      artistName: "Sophia Chen",
      description:
        "A limited edition collection of AI-generated patterns transformed into haute couture pieces that blend digital creativity with traditional craftsmanship.",
      imageUrl:
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
      isLimited: true,
      isSustainable: true,
      releaseDate: "2023-11-15",
    },
    {
      id: "2",
      name: "Quantum Silk Series",
      artistName: "Marcus Rivera",
      description:
        "Inspired by quantum physics, these pieces feature AI-generated patterns that change appearance based on viewing angle and lighting conditions.",
      imageUrl:
        "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80",
      isLimited: true,
      isSustainable: false,
      releaseDate: "2023-12-01",
    },
    {
      id: "3",
      name: "Digital Renaissance",
      artistName: "Amara Johnson",
      description:
        "A fusion of classical art motifs and futuristic design, created through a collaboration between AI algorithms and traditional artisans.",
      imageUrl:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
      isLimited: false,
      isSustainable: true,
      releaseDate: "2024-01-10",
    },
  ],
  title = "Artist Collaborations",
  subtitle = "Limited edition pieces co-created with AI",
}: ArtistCollaborationSectionProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 ">
            {title}
          </h2>
          <p className="text-lg text-gray-600  max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborations.map((collab) => (
            <Card
              key={collab.id}
              className="overflow-hidden border border-gray-200  transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={collab.imageUrl}
                  alt={collab.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
                {collab.isLimited && (
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Limited Edition
                  </div>
                )}
                {collab.isSustainable && (
                  <div className="absolute top-4 right-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="md"
                            className="h-8 w-8 rounded-full bg-green-50 border-green-200 hover:bg-green-100"
                          >
                            <Leaf className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Sustainably produced</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 ">
                    {collab.name}
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="md" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          AI co-created with {collab.artistName}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700 ">
                    By {collab.artistName}
                  </span>
                </div>

                <p className="text-gray-600  text-sm mb-6 line-clamp-3">
                  {collab.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 ">
                    Release:{" "}
                    {new Date(collab.releaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="group">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="group">
            View All Collaborations
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistCollaborationSection;
