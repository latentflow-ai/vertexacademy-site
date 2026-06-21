'use client';

interface GalleryFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function GalleryFilters({ categories, activeCategory, onCategoryChange }: GalleryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-10 sm:mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`min-h-[44px] px-5 rounded-full font-semibold text-sm transition-smooth border ${
            activeCategory === category
              ? 'bg-primary text-primary-foreground border-primary shadow-blue'
              : 'bg-surface-2 text-text-secondary border-border hover:bg-primary-tint hover:text-primary'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
