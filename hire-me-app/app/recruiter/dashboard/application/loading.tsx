
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const loading = () => {
  return (
   <div className="w-full min-h-screen bg-black text-white">
      {/* Header Skeleton */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 bg-zinc-800 rounded-lg mb-3" />
          <Skeleton className="h-4 w-96 bg-zinc-800 rounded-lg" />
        </div>
      </section>

      {/* Filter Section Skeleton */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-10">
            <div className="bg-black border border-white/10 rounded-2xl p-6 shadow-xl">
              <Skeleton className="h-5 w-40 mb-4 bg-zinc-800 rounded-md" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-full rounded-xl bg-zinc-900"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="relative bg-[#0f0f0f] border border-gray-800/50 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-[#0f0f0f]/95 border-b border-gray-800/50">
                <TableRow>
                  {[
                    "#",
                    "Job Title",
                    "Company",
                    "Status",
                    "Chances",
                    "Applied Date",
                    "Actions",
                  ].map((head, i) => (
                    <TableHead
                      key={i}
                      className="text-gray-400 font-semibold text-xs md:text-sm px-4 py-3"
                    >
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(6)].map((_, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="border-gray-800/50 hover:bg-transparent"
                  >
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="px-4 py-3 text-xs md:text-sm"
                      >
                        <Skeleton className="h-4 w-24 bg-zinc-800 rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 w-8 rounded-lg bg-zinc-900"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default loading
