import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
    return (
        <div className='flex relative items-center flex-col h-screen w-full 
        justify-center
        '>
            {children}
        </div>
    )
}

export default layout