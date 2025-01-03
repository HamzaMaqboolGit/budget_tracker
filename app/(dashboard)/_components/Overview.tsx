"use client"
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { usersettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';

function Overview({ userSettings }: { userSettings: usersettings }) {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(
        {
            from: startOfMonth(new Date()),
            to: new Date(),
        }
    );
    return (
        <>
            <div className='container flex flex-wrap items-end justify-between gap-2 py-6' >
                <h2 className="text-3xl font-bold ml-10">Overview</h2>
                <div className="flex items-center gap-3 p-20 py-0 ">
                    <DateRangePicker

                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={values => {
                            const { from, to } = values.range;
                            // we update the date range only if both dates are set
                            if (!from || !to) return;
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
                                return;
                            }
                            setDateRange({ from, to });
                        }}
                    />

                </div>
            </div>
            <div className="container flex flex-col gap-2 w-full p-10 py-0">
                <StatsCards
                    usersettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />

                {/* categories stats */}
                <CategoriesStats
                    userSettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />
            </div>
        </>
    )
}

export default Overview