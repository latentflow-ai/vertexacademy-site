'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  activeCategory: string;
}

export default function GalleryGrid({ images, activeCategory }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages =
    activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredImages.length
        : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, currentIndex]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredImages.map((image, index) => {
          // grid-breaking moment: feature the first tile larger
          const featured = index === 0;
          return (
            <button
              key={image.id}
              onClick={() => openLightbox(image, index)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer bg-surface hover-lift ${
                featured ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : 'aspect-square'
              }`}
            >
              <AppImage src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="PhotoIcon" size={18} className="text-navy" variant="solid" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-display text-lg">{image.title}</h3>
                <p className="text-gold text-sm font-medium">{image.category}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10" aria-label="Close lightbox">
            <Icon name="XMarkIcon" size={24} className="text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }} className="absolute left-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Previous image">
            <Icon name="ChevronLeftIcon" size={24} className="text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigateImage('next'); }} className="absolute right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Next image">
            <Icon name="ChevronRightIcon" size={24} className="text-white" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <AppImage src={selectedImage.src} alt={selectedImage.alt} width={1200} height={800} className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <div className="mt-4 text-center">
              <h3 className="text-white font-display text-xl mb-1">{selectedImage.title}</h3>
              <p className="text-white/70 text-sm">{currentIndex + 1} / {filteredImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
