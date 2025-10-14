"use client";

import { useState, useEffect } from "react";
import { Play, Lock } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  client_name: string;
  category: string;
  cloudflare_video_uid?: string;
  thumbnail_url?: string;
  description: string;
  is_featured: boolean;
  is_coming_soon: boolean;
  display_order: number;
}

export default function PortfolioGrid() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading portfolio items - replace with actual Supabase call
    setTimeout(() => {
      const mockItems: PortfolioItem[] = [
        {
          id: "1",
          title: "Brand Story",
          client_name: "Fort Wayne Vintage",
          category: "commercial",
          cloudflare_video_uid: "sample-uid-1",
          thumbnail_url: "/api/placeholder/600/400",
          description: "Capturing the essence of vintage fashion",
          is_featured: true,
          is_coming_soon: false,
          display_order: 1,
        },
        {
          id: "2",
          title: "Product Launch",
          client_name: "Ride Worx",
          category: "commercial",
          cloudflare_video_uid: "sample-uid-2",
          thumbnail_url: "/api/placeholder/600/400",
          description: "Dynamic automotive showcase",
          is_featured: false,
          is_coming_soon: false,
          display_order: 2,
        },
        {
          id: "3",
          title: "Event Coverage",
          client_name: "City Festival",
          category: "event",
          cloudflare_video_uid: "sample-uid-3",
          thumbnail_url: "/api/placeholder/600/400",
          description: "Capturing community moments",
          is_featured: false,
          is_coming_soon: false,
          display_order: 3,
        },
        {
          id: "4",
          title: "Corporate Profile",
          client_name: "Tech Solutions",
          category: "corporate",
          cloudflare_video_uid: "sample-uid-4",
          thumbnail_url: "/api/placeholder/600/400",
          description: "Professional business showcase",
          is_featured: false,
          is_coming_soon: false,
          display_order: 4,
        },
        {
          id: "5",
          title: "Coming Soon",
          client_name: "Major Brand",
          category: "commercial",
          description: "Something big is coming",
          is_featured: false,
          is_coming_soon: true,
          display_order: 5,
        },
        {
          id: "6",
          title: "Music Video",
          client_name: "Local Artist",
          category: "music_video",
          cloudflare_video_uid: "sample-uid-6",
          thumbnail_url: "/api/placeholder/600/400",
          description: "Creative visual storytelling",
          is_featured: false,
          is_coming_soon: false,
          display_order: 6,
        },
      ];
      setPortfolioItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-32">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="py-32 border-t">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="mb-20">
            <h2 className="text-6xl md:text-7xl font-black uppercase mb-6">PORTFOLIO</h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              A selection of our work across commercials, brand films, and event coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {portfolioItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                {item.is_coming_soon ? (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="text-center z-10">
                      <Lock className="text-gray-400 mx-auto mb-3" size={32} />
                      <p className="text-white font-bold uppercase tracking-wide">Coming Soon</p>
                      <p className="text-gray-400 text-sm mt-1">{item.client_name}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedVideo(item)}
                    className="space-y-4"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <Play
                          size={64}
                          className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.client_name}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-6xl w-full">
            <div className="aspect-video bg-black rounded-lg">
              {/* Cloudflare Stream Player would go here */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Cloudflare Stream Player: {selectedVideo.cloudflare_video_uid}</p>
              </div>
            </div>
            <div className="mt-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-300">{selectedVideo.client_name}</p>
              <p className="text-gray-400 mt-2">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}