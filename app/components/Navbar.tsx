"use client"
import React, { useState } from 'react'
import Logo, { MobileLogo } from './Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { pre } from 'framer-motion/client'

const Navbar = () => {
    return (
        <div>
            <DesktopNavbar />
            <MobileNavbar />
        </div>

    )
}
const items = [
    {
        label: "Dashboard",
        Link: "/"
    },
    {
        label: "Transactions",
        Link: "/transactions"
    },
    {
        label: "Manage",
        Link: "/manage"
    },

]

function NavbarItem({ link, label, onClick }: {
    link: string, label: string, onClick?: () => void
}) {
    const pathname = usePathname();
    const isActive = pathname === link;
    return (
        <div className='relative flex items-center cursor-pointer'>
            <Link href={link} className={cn(
                buttonVariants({
                    variant: "ghost"

                }), "w-full justify-start text-muted-foreground text-lg hover:text-foreground ",
                isActive && "text-foreground"
            )}
                onClick={() => {
                    if (onClick)
                        onClick();
                }}
            >{label}</Link>

            {
                isActive && (
                    <div className='absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] 
                    -translate-x-1/2 rounded-xl bg-foreground md:block
                    '>

                    </div>
                )
            }
        </div>
    )
}

function DesktopNavbar() {
    return (
        <div className='hidden border-separate border-b bg:background md:block'>
            <nav className='container flex items-center justify-between px-8'>
                <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
                    <Logo />
                    <div className='flex h-full cursor-pointer'>
                        {
                            items.map((item) => (
                                <NavbarItem
                                    key={item.label}
                                    link={item.Link}
                                    label={item.label}
                                />
                            )

                            )
                        }
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>

        </div>
    )
}

function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='block border-separate bg-background md:hidden'>
            <nav className="container flex items-center justify-between px-8 ">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-[400px] sm:w-[540px]
                    
                    ' side={'left'}>
                        <Logo />
                        <div className="flex flex-col gap-1 pt-4 cursor-pointer">
                            {
                                items.map((item, index) => (
                                    <NavbarItem key={item.label}
                                        link={item.Link}
                                        label={item.label}
                                        onClick={() => setIsOpen((prev) => !prev)}
                                    />
                                ))
                            }
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">


                    <MobileLogo />
                    <div className="flex items-center gap-2 ">
                        <ThemeSwitcherBtn />
                        <UserButton afterSignOutUrl='/sign-in' />
                    </div>
                </div>
            </nav>
        </div>

    )
}

export default Navbar


