/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "digitalhippo-production.up.railway.app",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

const withPWA = require("next-pwa")({
	dest: "public",
	disable: process.env.NODE_ENV === 'development',
	register: true,
	skipWaiting: true,
});

module.exports = withPWA(nextConfig);
