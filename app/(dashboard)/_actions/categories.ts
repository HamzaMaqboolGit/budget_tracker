"use server"

import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;
    return await prisma.category.create({
        data: {
            userID: user.id,
            name,
            icon,
            type,
        }
    })
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    return await prisma.category.delete({
        where: {
            name_userID_type: {
                userID: user.id,
                name: parsedBody.data.name,
                type: parsedBody.data.type,
            }
        }
    })
}