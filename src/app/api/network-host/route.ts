import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    // 1. Check if running in Vercel production
    const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    if (vercelUrl) {
      // If deployed as cafe-admin.vercel.app, customer app is cafe-customer.vercel.app
      const customerUrl = vercelUrl.includes("-admin")
        ? `https://${vercelUrl.replace("-admin", "-customer")}`
        : `https://${vercelUrl}`;
      return NextResponse.json({
        host: customerUrl,
        mode: "vercel",
        ip: vercelUrl,
      });
    }

    // 2. Discover Local Network IPv4 Address for seamless mobile Wi-Fi scanning
    const networkInterfaces = os.networkInterfaces();
    let localIp = "192.168.1.86"; // Fallback detected IP

    for (const name of Object.keys(networkInterfaces)) {
      const ifaceList = networkInterfaces[name];
      if (!ifaceList) continue;
      for (const iface of ifaceList) {
        // Find IPv4 and non-internal (e.g. 192.168.x.x, 10.x.x.x, 172.16.x.x)
        if (iface.family === "IPv4" && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }

    return NextResponse.json({
      host: `http://${localIp}:3000`,
      mode: "lan",
      ip: localIp,
    });
  } catch {
    return NextResponse.json({
      host: "http://192.168.1.86:3000",
      mode: "fallback",
      ip: "192.168.1.86",
    });
  }
}
