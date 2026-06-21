'use client';

import React from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

export default function AppImage({
    src,
    alt,
    width,
    height,
    fill,
    className = '',
    priority = false,
    sizes = "(max-width: 768px) 100vw, 33vw",
    ...props
}: AppImageProps) {

    const imageProps = fill
        ? { fill: true } // Use fill mode, no width/height allowed
        : { width: width || 500, height: height || 500 }; // Use width/height mode

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            priority={priority}
            sizes={sizes}
            {...imageProps}
            {...props}
        />
    );
}
