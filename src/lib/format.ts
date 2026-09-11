// Centralized INR formatting. Every price in MarketHub flows through here.
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatINR(amount: number): string {
  return inr.format(amount)
}

// Compact INR for dashboard stat tiles (e.g. ₹12.4L, ₹3.2Cr)
export function formatINRCompact(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`
  return formatINR(amount)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
