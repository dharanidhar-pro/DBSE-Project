// Application-level product image mapping. The MySQL `product` table has no
// image column, so images are matched here by stable product_id. The same
// product_id ALWAYS resolves to the same image across every screen. When a
// product can't be confidently matched we fall back to a category image.

const W = "&w=1080&q=80"

// Exact per-product images, keyed by stable product_id.
export const PRODUCT_IMAGES: Record<number, string> = {
  1: `https://images.unsplash.com/photo-1631543561906-200fa465682a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // laptop
  2: `https://images.unsplash.com/photo-1617696992381-16b65f34b3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // smartphone
  3: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // running shoes
  4: `https://images.unsplash.com/photo-1567928513899-997d98489fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // headphones
  5: `https://images.unsplash.com/photo-1622560481156-01fc7e1693e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // backpack
  6: `https://images.unsplash.com/photo-1546868871-7041f2a55e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // smartwatch
  7: `https://images.unsplash.com/photo-1608354580875-30bd4168b351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // coffee maker
  8: `https://images.unsplash.com/photo-1618677366787-9727aacca7ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // sunglasses
  9: `https://images.unsplash.com/photo-1635987391914-cb84b567e68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // mechanical keyboard
  10: `https://images.unsplash.com/photo-1544003484-3cd181d17917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // water bottle
  11: `https://images.unsplash.com/photo-1637157216470-d92cd2edb2e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // yoga mat
  12: `https://images.unsplash.com/photo-1667312939978-64cf31718a6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // desk lamp
  13: `https://images.unsplash.com/photo-1624031000828-dba1b7a3e4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // cookware
  14: `https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // wireless mouse
  15: `https://images.unsplash.com/photo-1631543561989-98c3bfd1bb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // laptop 2
  16: `https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg${W}`, // shoes 2
}

// Category fallbacks — used only when a product has no exact match.
export const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: PRODUCT_IMAGES[1],
  Audio: PRODUCT_IMAGES[4],
  Footwear: PRODUCT_IMAGES[3],
  Accessories: PRODUCT_IMAGES[5],
  Wearables: PRODUCT_IMAGES[6],
  "Home & Kitchen": PRODUCT_IMAGES[7],
  Fitness: PRODUCT_IMAGES[11],
}

// Vendor-uploaded product photos override the built-in map for the session.
const PRODUCT_IMAGE_OVERRIDES: Record<number, string> = {}

export function setProductImage(productId: number, dataUrl: string) {
  PRODUCT_IMAGE_OVERRIDES[productId] = dataUrl
}

export function productImage(productId: number, category: string): string {
  return PRODUCT_IMAGE_OVERRIDES[productId] ?? PRODUCT_IMAGES[productId] ?? CATEGORY_IMAGES[category] ?? PRODUCT_IMAGES[1]
}
