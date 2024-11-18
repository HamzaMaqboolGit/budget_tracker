import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    let userSettings = await prisma.usersettings.findUnique({
        where: {
            userID: user.id,
        },

    });
    if (!userSettings) {
        userSettings = await prisma.usersettings.create({
            data: {
                userID: user.id,
                currency: "USD",
            }
        })
    }

    return Response.json({ userSettings });

    //redirect to home page that uses user currency
    revalidatePath('/dashboard')
    return Response.json(userSettings);
}