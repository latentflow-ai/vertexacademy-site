/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    distDir: process.env.DIST_DIR || '.next',

    // Enable SWC minification for faster builds
    swcMinify: true,

    // Optimize output for performance
    compress: true,
    
    poweredByHeader: false,

    typescript: {
        ignoreBuildErrors: true,
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    // Code splitting optimization
    webpack: (config, { isServer }) => {
        config.optimization = {
            ...config.optimization,
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // Vendor code split
                    vendor: {
                        filename: 'chunks/vendor.[contenthash].js',
                        test: /node_modules/,
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                    // React libraries split
                    react: {
                        filename: 'chunks/react.[contenthash].js',
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        priority: 20,
                        reuseExistingChunk: true,
                    },
                    common: {
                        filename: 'chunks/common.[contenthash].js',
                        minChunks: 2,
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            },
        };
        return config;
    },

    images: {
        remotePatterns: [
            // Existing allowed image hosts
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pixabay.com',
            },

            // REQUIRED for your AI website builder images
            {
                protocol: "https",
                hostname: "img.rocket.new",
            },
            {
                protocol: "https",
                hostname: "rocket.new",
            },
        ],
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/homepage',
                permanent: false,
            },
            // Teacher → Faculty rename: keep old links working
            {
                source: '/teachers',
                destination: '/faculty',
                permanent: true,
            },
            {
                source: '/teacherslogin',
                destination: '/facultylogin',
                permanent: true,
            },
        ];
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.(jsx|tsx)$/,
            exclude: [/node_modules/],
            use: [
                {
                    loader: '@dhiwise/component-tagger/nextLoader',
                }
            ],
        });

        return config;
    },
};

export default nextConfig;
