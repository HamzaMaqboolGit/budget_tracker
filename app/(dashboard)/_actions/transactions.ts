"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }
    const { amount, category, date, discription, type } = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where: {
            userID: user.id,
            name: category,
        }
    });
    if (!categoryRow) {
        throw new Error("Category not found")
    }

    await prisma.$transaction([
        // create user transaction
        prisma.transaction.create({
            data: {
                userID: user.id,
                amount,
                date,
                discription: discription || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon
            },
        }),
        // update month aggregate table
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userID: {
                    userID: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userID: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            }
        }),


        // update year aggregate table
        prisma.yearHistory.upsert({
            where: {
                month_year_userID: {
                    userID: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userID: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            }
        }),


    ]);
}