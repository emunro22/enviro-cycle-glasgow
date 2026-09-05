"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  display_order: number;
};

const PREVIEW_COUNT = 8;

export default function OurWork({ projects }: { projects: Project[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImg]);

  const visibleProjects = projects.slice(0, PREVIEW_COUNT);
  const hasMore = projects.length > PREVIEW_COUNT;
  const totalCount = projects.length;

  return (
    <section id="our-work" className="py-16 md:py-24 bg-[var(--forest-dark)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10 md:mb-16 animate-on-scroll">
          <span className="section-label">Portfolio</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-heading gold-text mt-4">
            Recent Projects
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mt-6"></div>
          <p className="text-cream/50 mt-4 uppercase tracking-widest text-xs">
            Tap any image to expand
          </p>
        </div>

        {visibleProjects.length === 0 ? (
          <p className="text-center text-cream/50 uppercase tracking-widest text-xs">
            Gallery coming soon
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {visibleProjects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedImg(project.image_url)}
                  className="group relative h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden rounded-sm gold-card cursor-zoom-in"
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image_url}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-dark)] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="absolute bottom-0 left-0 p-5 sm:p-6 md:p-8 w-full pointer-events-none">
                    <p className="text-[var(--gold)] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-heading text-cream uppercase leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 md:mt-14 text-center">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #d4a017, #f0c040)",
                    color: "#0a1f0b",
                    boxShadow: "0 8px 32px rgba(212,160,23,0.3)",
                  }}
                >
                  View All {totalCount} Projects
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* FULL SCREEN MODAL */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 transition-all duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center text-cream text-4xl hover:text-[var(--gold)] z-[110] transition-colors bg-black/40 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
            aria-label="Close"
          >
            &times;
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImg}
            alt="Full screen preview"
            className="max-w-5xl max-h-[80vh] w-auto h-auto object-contain"
          />

          <p className="absolute bottom-6 md:bottom-10 text-cream/50 font-medium tracking-widest uppercase text-[10px] sm:text-sm px-4 text-center">
            Tap anywhere to close
          </p>
        </div>
      )}
    </section>
  );
}
