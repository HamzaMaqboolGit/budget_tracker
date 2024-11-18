"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "../hooks/use-media-query"
import { Currencies, currency } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import SkeletonWrapper from "./SkeletonWrapper"
import { usersettings } from "@prisma/client"
import { updateUserCurrency } from "../wizard/_actions/userSettings"
import { toast } from "sonner"


export function CurrencyComboBox() {

    const userSettings = useQuery<usersettings>({
        queryKey: ["userSettings"],
        queryFn: () => fetch("/api/user-settings").then(res => (res.json())),
    });

    React.useEffect(() => {
        if (!userSettings.data)
            return
        const userCurrency = Currencies.find((currency) => currency.value === userSettings.data.currency);
        if (userCurrency) setSelectedOption(userCurrency);
    }, [userSettings.data])

    //mutation
    const mutation = useMutation({
        mutationFn: updateUserCurrency,
        onSuccess: (data: usersettings) => {
            toast.success("Currency updated successfully", {
                id: "update-currency",
            });

            setSelectedOption(
                Currencies.find(c => c.value === data.currency) || null
            );
        },
        onError: (e) => {
            toast.error("Something went wrong", {
                id: "update-currency",
            });

        },
    });

    const selectOption = React.useCallback((currency_value: currency | null) => {
        if (!currency_value) {
            toast.error("Please select a currency");
            return
        }
        toast.loading("Updating currency...", {
            id: "update-currency",
        });
        mutation.mutate(currency_value.value);


    }, [mutation])

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedOption, setSelectedOption] = React.useState<currency | null>(
        null
    )

    if (isDesktop) {


        return (
            <SkeletonWrapper isLoading={userSettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                            {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={userSettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                        {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    )
}

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void
    setSelectedOption: (status: currency | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find((priority) => priority.value === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
