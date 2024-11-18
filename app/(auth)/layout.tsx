import React, { ReactNode } from 'react'
import Logo from '../components/Logo'

type Props = {
    children: React.ReactNode
}

function Layout({ children }: Props) {
    return (
        <div
            className='flex h-screen w-full relative flex-col items-center justify-center'
        >
            <Logo />
            <div className='mt-12'> {children}</div>
        </div>
    )
}

export default Layout