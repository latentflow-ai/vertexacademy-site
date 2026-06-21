'use client';

import { useState } from 'react';
import GalleryFilters from './GalleryFilters';
import GalleryGrid from './GalleryGrid';
import GalleryStats from './GalleryStats';

interface GalleryImage {
    id: number;
    src: string;
    alt: string;
    category: string;
    title: string;
}

interface StatItem {
    icon: string;
    value: string;
    label: string;
}

interface GalleryInteractiveProps {
    images: GalleryImage[];
    categories: string[];
    stats: StatItem[];
}

export default function GalleryInteractive({
    images,
    categories,
    stats,
}: GalleryInteractiveProps) {
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <div className="container mx-auto px-4 py-12">
            <GalleryStats stats={stats} />
            <GalleryFilters
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />
            <GalleryGrid images={images} activeCategory={activeCategory} />
        </div>
    );
}