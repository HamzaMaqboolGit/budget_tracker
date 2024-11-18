"use client"
import { DateToUTCDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import SkeletonWrapper from '@/app/components/SkeletonWrapper';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, DownloadIcon, MoreHorizontal, TrashIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader';
import { cn } from '@/lib/utils';
import { Value } from '@radix-ui/react-select';
import { DataTableFacetedFilter } from '@/components/datatable/Faceted-Filter';
import { DataTableViewOptions } from '@/components/datatable/DataTableViewOption';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
interface Props {
    from: Date;
    to: Date;
}

import { download, generateCsv, mkConfig } from 'export-to-csv'
import { Transaction } from '@prisma/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteCategoryDialogue from '../../_components/DeleteCategoryDialogue';
import DeleteTransactionDialogue from './DeleteTransactionDialogue';

const emptyData: any[] = [];

type TransactionHistoryRow = getTransactionsHistoryResponseType[0];

const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => (
            <div className="flex gap-2 capitalize ">
                {
                    row.original.categoryIcon
                }
                <div className="capitalize">
                    {row.original.category}
                </div>
            </div>
        )
    },

    {
        accessorKey: "discription",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Discription" />
        ),
        cell: ({ row }) => (
            <div className="capitalize ">
                {
                    row.original.discription
                }
            </div>
        )
    },

    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });
            return <div className="text-muted-foreground ">{formattedDate}</div>;

        }
    },

    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });

            return <div className={cn("capitalize rounded-lg text-center",
                row.original.type === "income" && "bg-emerald-400/10 text-emerald-500",
                row.original.type === "expense" && "bg-red-400/10 text-red-500"
            )} >{
                    row.original.type
                }</div>;

        }
    },

    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <p className="text-md rounded-lg bg-gray-400/5 text-center font-medium">
                {row.original.formattedAmount}
            </p>

        )
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <RowActions
                transaction={row.original} />
        )

    }
];

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,

})

function TransactionTable({ from, to }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setcolumnFilters] = useState<ColumnFiltersState>([]);

    const history = useQuery<getTransactionsHistoryResponseType>({
        queryKey: ["transactions", "history", from, to],
        queryFn: () => fetch(`/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(
            (res) => res.json()),
    });

    const handleExportCSV = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    }

    const table = useReactTable({
        data: history.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // initialState: {
        //     pagination: {
        //         pageSize: 2
        //     }
        // },
        state: {
            sorting,
            columnFilters,

        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setcolumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();
        history.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                value: transaction,
                label: `${transaction.categoryIcon} ${transaction.category}`,
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [history.data]);
    return (
        <div className="w-full">
            {/* <pre className="">{JSON.stringify(categoriesOptions, null, 2)}</pre> */}
            <div className="flex flex-wrap items-end justify-between gap-2 py-4 ">
                <div className="flex gap-2 ">
                    {/* {table.getColumn("category") && (
                        <DataTableFacetedFilter title='Category' column={table.getColumn("category")}
                            options={categoriesOptions}
                        />
                    )} */}

                    {table.getColumn("type") && (
                        <DataTableFacetedFilter title='Type' column={table.getColumn("type")}
                            options={[
                                {
                                    label: "Income", value: "income"

                                },
                                {
                                    label: "Expense", value: "expense"

                                }
                            ]
                            }
                        />
                    )}
                </div>
                <div className="flex flex-wrap gap-2 ">
                    <Button variant={"outline"} size={"sm"}
                        className='ml-auto h-8 lg:flex '
                        onClick={() => {
                            const data = table.getFilteredRowModel().rows.map((row) => ({
                                category: row.original.category,
                                categoryIcon: row.original.categoryIcon,
                                discription: row.original.discription,
                                type: row.original.type,
                                amount: row.original.amount,
                                date: row.original.date,
                                formattedAmount: row.original.formattedAmount,
                            }));
                            handleExportCSV(data);
                        }}
                    >
                        <DownloadIcon className='mr-2 h-4 w-4' />
                        Export CSV
                    </Button>
                    <DataTableViewOptions
                        table={table}
                    />

                </div>
            </div>
            <SkeletonWrapper isLoading={history.isLoading}>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className='p-5'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className='p-5'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </SkeletonWrapper>
        </div>

    )
}

export default TransactionTable

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
    const [showDeleteDialog, setshowDeleteDialog] = useState(false);
    return (
        <>
            <DeleteTransactionDialogue
                open={showDeleteDialog}
                setOpen={setshowDeleteDialog}
                transactionId={transaction.id} />
            <DropdownMenu>

                <DropdownMenuTrigger
                    asChild
                >
                    <Button variant={"ghost"}
                        className='h-8 w-8 p-0 '
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className='h-4 w-4 ' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align='end'
                >
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='flex items-center gap-2 ' onSelect={() => {
                        setshowDeleteDialog((prev) => !prev)
                    }}>
                        <TrashIcon
                            className='h-4 w-4 text-muted-foreground'
                        />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
