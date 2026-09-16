import { useMemo, useState } from "react"
import { PackageSearch, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge, Button, Checkbox, SearchComponent, SelectField } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { CATEGORIES } from "../../lib/data"
import { LoadingGrid, ProductCard, StatePanel } from "../../components/common"

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
]
const PRICE_BANDS = [
  { value: "all", label: "Any price" },
  { value: "0-2000", label: "Under ₹2,000" },
  { value: "2000-10000", label: "₹2,000 – ₹10,000" },
  { value: "10000-50000", label: "₹10,000 – ₹50,000" },
  { value: "50000-999999", label: "Above ₹50,000" },
]
const PAGE_SIZE = 8

export default function Shop() {
  const { products, nav, stockOf, vendors } = useStore()

  const initialCategory = nav.view === "category" ? String(nav.params?.name ?? "") : ""
  const initialQuery = nav.view === "search" ? String(nav.params?.q ?? "") : ""
  const vendorFilter = nav.params?.vendor ? Number(nav.params.vendor) : undefined

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [priceBand, setPriceBand] = useState("all")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState("featured")
  const [page, setPage] = useState(1)

  const vendor = vendorFilter ? vendors.find((v) => v.vendor_id === vendorFilter) : undefined

  const filtered = useMemo(() => {
    let list = [...products]
    if (vendorFilter) list = list.filter((p) => p.vendor_id === vendorFilter)
    if (category) list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    }
    if (priceBand !== "all") {
      const [lo, hi] = priceBand.split("-").map(Number)
      list = list.filter((p) => p.price >= lo && p.price <= hi)
    }
    if (inStockOnly) list = list.filter((p) => stockOf(p.product_id) > 0)
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        list.sort((a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")))
        break
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, query, category, priceBand, inStockOnly, sort, vendorFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const title = vendor ? vendor.business_name : category || (initialQuery ? `Search: "${initialQuery}"` : "Shop all products")

  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      <div className="mb-xl">
        <h1 className="text-title text-text-primary">{title}</h1>
        <p className="text-label-sm text-text-secondary mt-xs">
          {filtered.length} {filtered.length === 1 ? "product" : "products"} available
        </p>
      </div>

      <div className="grid gap-2xl lg:grid-cols-[264px_1fr]">
        {/* Filters */}
        <aside className="flex h-fit flex-col gap-xl lg:sticky lg:top-24">
          <div className="mh-glass mh-spatial rounded-corner-lg p-xl">
            <div className="mb-lg flex items-center gap-md">
              <SlidersHorizontal size={16} className="text-brand-primary" />
              <h2 className="text-label font-semibold text-text-primary">Filters</h2>
            </div>
            <div className="flex flex-col gap-lg">
              <SearchComponent
                placeholder="Search products"
                value={query}
                onChange={(v) => {
                  setQuery(v)
                  setPage(1)
                }}
              />
              <SelectField
                label="Category"
                options={[{ value: "", label: "All categories" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
                value={category}
                onChange={(v) => {
                  setCategory(v)
                  setPage(1)
                }}
              />
              <SelectField
                label="Price range"
                options={PRICE_BANDS}
                value={priceBand}
                onChange={(v) => {
                  setPriceBand(v)
                  setPage(1)
                }}
              />
              <Checkbox
                label="In stock only"
                description="Hide sold-out products"
                defaultChecked={false}
                onChange={(c) => {
                  setInStockOnly(c)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-xl flex flex-wrap items-center justify-between gap-md">
            <div className="flex flex-wrap items-center gap-xs">
              {category && <Badge label={category} variant="brand" removable onRemove={() => setCategory("")} />}
              {priceBand !== "all" && (
                <Badge
                  label={PRICE_BANDS.find((b) => b.value === priceBand)!.label}
                  variant="secondary"
                  removable
                  onRemove={() => setPriceBand("all")}
                />
              )}
              {inStockOnly && <Badge label="In stock" variant="success" removable onRemove={() => setInStockOnly(false)} />}
            </div>
            <div className="w-56">
              <SelectField label="" options={SORTS} value={sort} onChange={setSort} />
            </div>
          </div>

          {shown.length === 0 ? (
            <StatePanel
              icon={<PackageSearch size={26} />}
              title="No products found"
              message="Try adjusting your filters or search for something else."
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    setQuery("")
                    setCategory("")
                    setPriceBand("all")
                    setInStockOnly(false)
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((p) => (
                  <ProductCard key={p.product_id} product={p} />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="mt-2xl flex items-center justify-center gap-md">
                  <Button
                    variant="neutral"
                    size="small"
                    iconStart={<ChevronLeft size={16} />}
                    disabled={current === 1}
                    onClick={() => setPage(current - 1)}
                  >
                    Prev
                  </Button>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <Button
                      key={i}
                      variant={current === i + 1 ? "primary" : "subtle"}
                      size="small"
                      onClick={() => setPage(i + 1)}
                    >
                      {String(i + 1)}
                    </Button>
                  ))}
                  <Button
                    variant="neutral"
                    size="small"
                    iconEnd={<ChevronRight size={16} />}
                    disabled={current === pageCount}
                    onClick={() => setPage(current + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Exported for the (rare) skeleton demo — keeps LoadingGrid referenced.
export function ShopLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-xl py-2xl lg:px-2xl">
      <div className="mb-xl h-8 w-48 animate-pulse rounded-corner-md bg-bg-hover" />
      <LoadingGrid />
    </div>
  )
}
