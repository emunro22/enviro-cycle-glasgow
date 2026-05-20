"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Project = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  display_order: number;
};

export default function OurWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  return (
    <section id="our-work" className="py-24 bg-[var(--forest-dark)] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 animate-on-scroll">
          <span className="section-label">Portfolio</span>
          <h2 className="text-5xl md:text-7xl font-heading gold-text mt-4">
            Recent Projects
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mt-6"></div>
          <p className="text-cream/50 mt-4 uppercase tracking-widest text-xs">Click any image to expand</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedImg(project.image_url)}
              className="group relative h-[400px] overflow-hidden rounded-sm gold-card animate-on-scroll cursor-zoom-in"
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-dark)] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-2">
                  {project.category}
                </p>
                <h3 className="text-2xl font-heading text-cream uppercase">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 transition-all duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button 
            className="absolute top-10 right-10 text-cream text-4xl hover:text-[var(--gold)] z-[110] transition-colors"
            onClick={() => setSelectedImg(null)}
          >
            &times;
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
            <Image
              src={selectedImg}
              alt="Full screen preview"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <p className="absolute bottom-10 text-cream/50 font-medium tracking-widest uppercase text-sm">
            Click anywhere to close
          </p>
        </div>
      )}
    </section>
  );
}