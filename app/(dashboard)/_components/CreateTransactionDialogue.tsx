"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/schema/transaction';
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import CategoryPicker from './CategoryPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from "date-fns"
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTransaction } from '../_actions/transactions';
import { toast } from 'sonner';
import { DateToUTCDate } from '@/lib/helpers';
import { date } from 'zod';
import { error } from 'console';

interface Props {
    trigger: ReactNode,
    type: TransactionType,
}

function CreateTransactionDialogue({ trigger, type }: Props) {

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),

        }
    })
    // const [date, setDate] = React.useState<Date>();
    const [open, setOpen] = useState(false);
    const handleCatgeoryChange = useCallback((value: string) => {
        form.setValue("category", value);
        // if (handleCatgeoryChange === null) {
        //     toast.error("Please select category");
        // }

    }, [form]);




    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully 🥳", {
                id: "create-transaction",
            });
            form.reset({
                type,
                discription: "",
                amount: 0,
                date: new Date(),
                category: undefined,

            });


            // after creating the transaction, we need to validate the overview query which will refetch the
            // data into home page
            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });
            setOpen((prev) => !prev)
        },
    });

    const onSubmit = useCallback((values: CreateTransactionSchemaType) => {
        toast.loading("Creating Transaction...", {
            id: "create-transaction"
        }),
            mutate({
                ...values,
                date: DateToUTCDate(values.date),


            });

    }, [mutate]);

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div>
                                Create a new <span className={cn("mt-1", type === 'income' ? "text-emerald-500" :
                                    "text-red-500"
                                    , "p-1"
                                )}> {type} </span>
                                transaction
                            </div>

                        </DialogTitle>
                    </DialogHeader>
                    {/* Form start */}
                    <Form {...form}>
                        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="discription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discription</FormLabel>
                                        <FormControl>
                                            { /* Your form field */}
                                            <Input defaultValue={""} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Transaction Discription (Optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            { /* Your form field */}
                                            <Input defaultValue={0} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Transaction Amount (Required)
                                        </FormDescription>

                                    </FormItem>
                                )}
                            />
                            {/* Transaction: {form.watch("category")} */}
                            <div className="flex items-center justify-between gap-2">
                                <FormField

                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                { /* Your form field */}
                                                <CategoryPicker type={type}
                                                    onChange={handleCatgeoryChange}

                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select a category for this transaction
                                            </FormDescription>

                                        </FormItem>
                                    )}
                                />

                                {/* date time popover */}
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>Transaction date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[200px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        className="rounded-md border"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(value) => {
                                                            // console.log("@@Calender" value);
                                                            if (!value) return;
                                                            field.onChange(value);


                                                        }}

                                                        initialFocus

                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Select a date for this transaction
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                            </div>
                        </form>
                    </Form>
                    {/* Form end */}


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" className="" variant={"secondary"} onClick={() => {
                                form.reset();
                            }}

                            >Cancel</Button>
                        </DialogClose>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}
                        >{!isPending && "Create"}
                            {isPending && <Loader2
                                className='animate-spin'
                            />}
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog >

        </div >
    )
}

export default CreateTransactionDialogue
