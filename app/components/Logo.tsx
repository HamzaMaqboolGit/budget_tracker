import React from 'react'
import { Landmark, PiggyBank } from 'lucide-react'

const Logo = () => {
    return (
        <div>
            <a href='/' className='flex items-center gap-2'>
                <Landmark
                    className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5]'
                />
                <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl
                font-bold leading-tight tracking-tighter text-transparent
                '>
                    Budget Tracker
                </p>
            </a>
        </div>
    )
}

export function MobileLogo() {
    return (
        <div>
            <a href="/" className='flex items-center gap-2'>

                <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl
                font-bold leading-tight tracking-tighter text-transparent
                '>
                    Budget Tracker
                </p>
            </a>
        </div>
    )
}

export default Logo