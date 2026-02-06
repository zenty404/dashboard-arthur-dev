import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { performCheck } from "@/lib/uptime";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sites = await prisma.monitoredSite.findMany({
    where: { isActive: true },
  });

  const results = await Promise.all(
    sites.map(async (site) => {
      const result = await performCheck(site.url);

      await prisma.uptimeCheck.create({
        data: {
          siteId: site.id,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          isUp: result.isUp,
          error: result.error,
        },
      });

      return {
        url: site.url,
        isUp: result.isUp,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
      };
    })
  );

  // Cleanup: remove checks older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await prisma.uptimeCheck.deleteMany({
    where: { checkedAt: { lt: thirtyDaysAgo } },
  });

  return NextResponse.json({
    checked: results.length,
    results,
  });
}
