"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import CategoryPicker from './CategoryPicker';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategory } from '../_actions/categories';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface Props {
    type: TransactionType,
    successCallBack: (category: Category) => void,
    trigger?: ReactNode;
}
function CreateCategoryDialogue({ type, successCallBack, trigger }: Props) {

    const [open, setOpen] = useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        }
    });

    const queryClient = useQueryClient();

    const theme = useTheme();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset(
                {
                    name: "",
                    icon: "",
                    type,
                });
            toast.success(`Category ${data.name} created successfully!`, {
                id: "create-category"
            });

            successCallBack(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            setOpen((prev) => !prev);
        },

        onError: () => {
            toast.error("Something went wrong", {
                id: "create-category",
            });
        }
    });

    const onSubmit = useCallback((values: CreateCategorySchemaType) => {
        toast.loading("Creating Category...", {
            id: "create-category"
        });
        mutate(values);
    }, [mutate]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (

                    trigger

                ) : (

                    <Button


                        variant={"ghost"} className="flex justify-start border-b
                    border-separate items-center rounded-none px-3 py-3 text-muted-foreground
                    ">
                        <PlusSquare className='mr-2 h-4 w-4 ' />
                        Create New
                    </Button>

                )}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create <span className={cn(
                        "m-1",
                        type === "income" ? "text-emerald-500" : "text-red-500"
                    )}>
                        {type}
                    </span> Category</DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        { /* Your form field */}
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>

                                    <FormDescription>
                                        Create Category
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className='h-[100px]
                                                w-full
                                                '>
                                                    {form.watch("icon") ? (
                                                        <div className='flex flex-col items-center gap-2'>
                                                            <span className="text-5xl " role='img'>{field.value}</span>
                                                            <p className="text-muted-foreground text-xs">
                                                                Click to change
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col items-center gap-2'>
                                                            <CircleOff className='h-[48px] w-[48px] ' />
                                                            <p className="text-muted-foreground text-xs">
                                                                Click to Select
                                                            </p>
                                                        </div>

                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-full'>
                                                <Picker data={data}
                                                    theme={theme.resolvedTheme}
                                                    onEmojiSelect={(emoji: { native: string }) => {
                                                        field.onChange(emoji.native)
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>

                                    <FormDescription>
                                        Your category will looks like
                                    </FormDescription>
                                </FormItem>
                            )}
                        />


                    </form>
                </Form>

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
        </ Dialog >
    )
}

export default CreateCategoryDialogue