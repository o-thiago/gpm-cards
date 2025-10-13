const nextConfig = {
	output: "standalone",
	compress: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
