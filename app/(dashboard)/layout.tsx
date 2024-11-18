import { SignIn, UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import DashboardPage from './page'


const layout = ({ children }: { children: ReactNode }) => {
    return (

        <div className='relative h-screen w-full flex-col flex'>
            <Navbar />
            <div className='w-full'>
                {children}
            </div>
        </div>
    )
}

export default layout