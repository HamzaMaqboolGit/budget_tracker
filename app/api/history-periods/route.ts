import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }
    const periods = await getHistoryPeriods(user.id)
    return Response.json(periods)
}
export type getHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>;

async function getHistoryPeriods(userID: string) {
    const result = await prisma.monthHistory.findMany({
        where: {
            userID,
        },
        select: {
            year: true,
        },
        distinct: ["year"],
        orderBy: {
            year: "asc",
        },
    });
    const years = result.map((el) => el.year);
    if (years.length === 0) {
        // retun the current year
        return [new Date().getFullYear()];
    }
    return years;
}