'use client';

import Icon from '@/components/ui/AppIcon';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

interface Feature {
    icon: string;
    title: string;
    description: string;
    color: string;
}

interface FeatureGridProps {
    features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
    return (
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, index) => {
                // de-genericize: feature the first card, vary emphasis across the grid
                const featured = index === 0;
                return (
                    <StaggerItem
                        key={index}
                        className={`group relative rounded-xl border p-6 sm:p-7 hover-lift transition-smooth ${
                            featured
                                ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2 bg-primary-tint border-primary/15'
                                : 'bg-surface-2 border-border'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span
                                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${
                                    featured
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-primary-tint text-primary'
                                }`}
                            >
                                <Icon name={feature.icon as any} size={22} variant="solid" />
                            </span>
                            <span className="font-display text-2xl text-text-faint/60 leading-none">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl text-text-primary mb-2">{feature.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                    </StaggerItem>
                );
            })}
        </Stagger>
    );
}
