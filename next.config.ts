import type { NextConfig } from "next";

const base_path = process.env.BASE_URL || "";

const nextConfig: NextConfig = {
	reactStrictMode: true
};

export default nextConfig;
