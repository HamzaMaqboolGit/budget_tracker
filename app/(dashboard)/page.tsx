import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import CreateTransactionDialogue from './_components/CreateTransactionDialogue';
import Overview from './_components/Overview';
import History from './_components/History';

async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }

    const userSettings = await prisma.usersettings.findUnique({
        where: {
            userID: user.id
        },
    })
    if (!userSettings) {
        redirect("/wizard");
    }
    return (
        <div className="h-full bg-background">
            <div className="bg-card border-b">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-2xl font-bold ml-10">
                        Hello, {user.firstName}! 👋
                    </p>
                    <div className="flex items-center gap-3 ml-10 mr-10
                    ">
                        <div className="hover:scale-105 translate-x-0 duration-300 rounded-lg">

                            <CreateTransactionDialogue
                                trigger={<Button variant={"outline"} className='border-emerald-500 bg-emerald-950
                            text-white hover:border-emerald-700 hover:text-white cursor-pointer 
                            hover:bg-emerald-950
                            '>New Income 💰</Button>}
                                type='income'
                            />

                        </div>

                        <div className="hover:scale-105 translate-x-0 duration-300 rounded-lg">
                            <CreateTransactionDialogue

                                trigger={<Button variant={"outline"} className='border-rose-500 bg-rose-950
                                text-white hover:border-rose-700 hover:text-white cursor-pointer 
                                hover:bg-rose-950
                                '>New Expense 🫰</Button>}
                                type="expense"
                            />

                        </div>
                    </div>
                </div>
            </div>
            <Overview userSettings={userSettings} />
            <History userSettings={userSettings} />
        </div>
    )
}

export default DashboardPage