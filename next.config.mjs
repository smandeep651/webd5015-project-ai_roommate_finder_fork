/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost",'source.unsplash.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/512x512/?portrait,face',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Add this
        port: ""
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: ""
      }
    ]
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    });

    return config;
  }
};

export default nextConfig;
