import type { NextConfig } from "next";
import { execSync } from "child_process";

let commitCount = "1.0";
try {
  commitCount = execSync("git rev-list --count HEAD").toString().trim();
} catch (e) {
  // Fallback if git is not available
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: `V 1.${commitCount}`,
  },
};

export default nextConfig;
