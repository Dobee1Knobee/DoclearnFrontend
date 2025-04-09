"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { SearchResults } from "@/widgets/SearchResults/ui/SearchResults"
import { setSearchQuery } from "@/entities/search/model/slice"
import type { AppDispatch } from "@/app/store"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (query) {
      dispatch(setSearchQuery(query))
    }
  }, [query, dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ marginTop: "9rem", marginBottom:"9rem" }}>
        <SearchResults initialQuery={query} />
      </div>
    </div>
  )
}

