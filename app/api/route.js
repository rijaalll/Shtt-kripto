import { NextResponse } from "next/server";
import os from "os";
import { version as nextVersion } from "next/package.json";

// Store app start time (survives warm-start container)
if (!globalThis.appStartTime) {
    globalThis.appStartTime = Date.now();
}

export async function GET() {
    // 1. App uptime (not server uptime)
    const now = Date.now();
    const uptimeMs = now - globalThis.appStartTime;

    const uptime = {
        seconds: Math.floor(uptimeMs / 1000),
        minutes: Math.floor(uptimeMs / (1000 * 60)),
        hours: Math.floor(uptimeMs / (1000 * 60 * 60)),
    };

    // 2. Server time (works in Vercel)
    const serverTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
        hour12: false,
    });

    // 3. OS info (safe for Vercel)
    const osInfo = {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
    };

    // 4. Next.js version
    const nextInfo = {
        next_version: nextVersion,
    };

    return NextResponse.json({
        message: "Server info",
        uptime_app: uptime,
        server_time: serverTime,
        os: osInfo,
        next: nextInfo,
    });
}
