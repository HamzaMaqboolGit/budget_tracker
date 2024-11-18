import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '../components/Logo';
import { CurrencyComboBox } from '../components/CurrencyComboBox';



async function page() {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }
    return (


        <div className='container flex max-w-2xl flex-col justify-between items-center gap-4'>
            <h1 className="text-3xl text-center">
                Welcome
                <span className="ml-2 font-bold ">{user.firstName} 👋</span>
            </h1>
            <h2 className="mt-4 text-center text-base text-muted-foreground">
                Let &apos;s get started by setting up your currency
            </h2>
            <h3 className="mt-2 text-center text-sm text-muted-foreground">
                You can change these settings at any time
            </h3>
            <Separator />

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>Set your default currecny for transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <CurrencyComboBox />
                    </div>

                </CardContent>
            </Card>
            <Separator />
            <Button className='w-full'>

                <Link href={'/'}>I&apos;am done. Take me to the dashboard.</Link>
            </Button>
            <div className="mt-8">
                <Logo />
            </div>

        </div >
    )
}

export default page
