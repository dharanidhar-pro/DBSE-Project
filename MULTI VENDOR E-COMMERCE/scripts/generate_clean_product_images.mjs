import fs from 'fs';
import { newProducts } from './expand_catalog_data.mjs';

// Base 1..30 images
const baseImages = {
  1: '/products/product_1.jpg',
  2: '/products/product_2.jpg',
  3: '/products/product_3.jpg',
  4: '/products/product_4.jpg',
  5: '/products/product_5.jpg',
  6: '/products/product_6.jpg',
  7: '/products/product_7.jpg',
  8: '/products/product_8.jpg',
  9: '/products/product_9.jpg',
  10: '/products/product_10.jpg',
  11: '/products/product_11.jpg',
  12: '/products/product_12.jpg',
  13: '/products/product_13.jpg',
  14: '/products/product_14.jpg',
  15: '/products/product_15.jpg',
  16: '/products/product_16.jpg',
  17: '/products/product_17.jpg',
  18: '/products/product_18.jpg',
  19: '/products/product_19.jpg',
  20: '/products/product_20.jpg',
  21: '/products/product_21.jpg',
  22: '/products/product_22.jpg',
  23: '/products/product_23.jpg',
  24: '/products/product_24.jpg',
  25: '/products/product_25.jpg',
  26: '/products/product_26.jpg',
  27: '/products/product_27.jpg',
  28: '/products/product_28.jpg',
  29: '/products/product_29.jpg',
  30: '/products/product_30.jpg',
  // Products 31..50 from initial dump
  31: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  32: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  33: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  34: 'https://images.unsplash.com/photo-1584990347449-30dfb0bfa442?w=800&auto=format&fit=crop&q=80',
  35: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  36: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  37: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  38: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
  39: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
  40: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  41: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  42: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
  43: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  44: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80',
  45: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
  46: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
  47: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
  48: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  49: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  50: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
};

const baseBackups = {
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  3: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
  4: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  5: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
  6: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
  7: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
  8: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
  9: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
  10: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  11: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  12: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
  13: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  14: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
  15: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
  16: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=800&auto=format&fit=crop&q=80',
  17: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
  18: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  19: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
  20: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
  21: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
  22: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80',
  23: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  24: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
  25: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80',
  26: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80',
  27: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  28: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
  29: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  30: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
  31: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  32: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  33: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  34: 'https://images.unsplash.com/photo-1584990347449-30dfb0bfa442?w=800&auto=format&fit=crop&q=80',
  35: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  36: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  37: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  38: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
  39: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
  40: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  41: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  42: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
  43: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  44: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80',
  45: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
  46: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
  47: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
  48: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  49: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  50: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
};

// Combine 1..164
const allImages = { ...baseImages };
const allBackups = { ...baseBackups };

for (const p of newProducts) {
  allImages[p.product_id] = p.imageUrl;
  allBackups[p.product_id] = p.imageUrl;
}

const lines1 = Object.entries(allImages).map(([id, url]) => `  ${id}: '${url}',`).join('\n');
const lines2 = Object.entries(allBackups).map(([id, url]) => `  ${id}: '${url}',`).join('\n');

const fileContent = `/**
 * MarketHub Product Image Service
 * Stable application-level mapping of product_id -> realistic product photography
 * All 164 catalog products deterministically mapped to dedicated high-resolution photography.
 */

export const productImages: Record<number, string> = {
${lines1}
};

export const productBackupImages: Record<number, string> = {
${lines2}
};

export const categoryFallbackImages: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  Fashion: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
  Home: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
  Sports: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
  Books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
};

export const getProductImageUrl = (productId: number, category?: string): string => {
  if (productImages[productId]) {
    return productImages[productId];
  }
  const cyclicId = ((Math.abs(productId) - 1) % 164) + 1;
  if (productImages[cyclicId]) {
    return productImages[cyclicId];
  }
  if (category && categoryFallbackImages[category]) {
    return categoryFallbackImages[category];
  }
  return '/products/product_1.jpg';
};

export const getProductBackupUrl = (productId: number, category?: string): string => {
  if (productBackupImages[productId]) {
    return productBackupImages[productId];
  }
  const cyclicId = ((Math.abs(productId) - 1) % 164) + 1;
  if (productBackupImages[cyclicId]) {
    return productBackupImages[cyclicId];
  }
  if (category && categoryFallbackImages[category]) {
    return categoryFallbackImages[category];
  }
  return productBackupImages[1];
};
`;

fs.writeFileSync('./src/services/productImages.ts', fileContent, 'utf8');
console.log('Successfully wrote clean src/services/productImages.ts with all 164 unique IDs');
