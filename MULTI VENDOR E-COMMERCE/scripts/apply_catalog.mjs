import fs from 'fs';
import { newProducts } from './expand_catalog_data.mjs';

// 1. Update src/data/seedData.ts
const seedDataPath = './src/data/seedData.ts';
let seedDataContent = fs.readFileSync(seedDataPath, 'utf8');

// Find insertion point in initialProducts
// Existing products end at product_id: 50
const product50Regex = /\{\s*product_id:\s*50[^\n]+\n\];/;
if (!product50Regex.test(seedDataContent)) {
  console.error("Could not find product 50 in seedData.ts");
  process.exit(1);
}

const newProductLines = newProducts.map(p => 
  `  { product_id: ${p.product_id}, vendor_id: ${p.vendor_id}, product_name: ${JSON.stringify(p.product_name)}, description: ${JSON.stringify(p.description)}, price: ${p.price.toFixed(2)}, category: ${JSON.stringify(p.category)}, product_status: 'Active', rating: ${p.rating}, review_count: ${p.review_count}, brand: ${JSON.stringify(p.brand)} },`
).join('\n');

seedDataContent = seedDataContent.replace(
  /(\{\s*product_id:\s*50[^\n]+)(\n\];)/,
  `$1,\n${newProductLines}$2`
);

// Find insertion point in initialInventory
const inventory50Regex = /\{\s*inventory_id:\s*50[^\n]+\n\];/;
if (!inventory50Regex.test(seedDataContent)) {
  console.error("Could not find inventory 50 in seedData.ts");
  process.exit(1);
}

const newInventoryLines = newProducts.map(p => 
  `  { inventory_id: ${p.product_id}, product_id: ${p.product_id}, vendor_id: ${p.vendor_id}, business_name: ${JSON.stringify(p.brand)}, price: ${p.price.toFixed(2)}, quantity: ${p.stock}, last_updated: '2026-09-01' },`
).join('\n');

seedDataContent = seedDataContent.replace(
  /(\{\s*inventory_id:\s*50[^\n]+)(\n\];)/,
  `$1,\n${newInventoryLines}$2`
);

fs.writeFileSync(seedDataPath, seedDataContent, 'utf8');
console.log("Successfully updated src/data/seedData.ts with 164 products and inventory items");

// 2. Update src/services/productImages.ts
const productImagesPath = './src/services/productImages.ts';
let productImagesContent = fs.readFileSync(productImagesPath, 'utf8');

// Check if 51 already exists in productImages
if (!productImagesContent.includes('51:')) {
  // Add to productImages: Record<number, string> = { ... }
  // We can map 51..164 to their imageUrl
  const newProductImagesEntries = newProducts.map(p => 
    `  ${p.product_id}: '${p.imageUrl}', // ${p.product_name}`
  ).join('\n');

  productImagesContent = productImagesContent.replace(
    /(\s*30:\s*'\/products\/product_30\.jpg'[^\n]+)/,
    `$1\n\n  // Expanded Catalog Products (51 to 164)\n${newProductImagesEntries}`
  );

  // Add to productBackupImages: Record<number, string> = { ... }
  const newBackupImagesEntries = newProducts.map(p => 
    `  ${p.product_id}: '${p.imageUrl}',`
  ).join('\n');

  productImagesContent = productImagesContent.replace(
    /(\s*30:\s*'https:\/\/[^']+'\s*,)/,
    `$1\n\n  // Expanded Catalog Backups (51 to 164)\n${newBackupImagesEntries}`
  );

  fs.writeFileSync(productImagesPath, productImagesContent, 'utf8');
  console.log("Successfully updated src/services/productImages.ts with 164 image mappings");
}

// 3. Update backend/database/multi_vendor_ecommerce.sql
const sqlPath = './backend/database/multi_vendor_ecommerce.sql';
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

if (!sqlContent.includes('(51,')) {
  // Find product 50 in LOCK TABLES `product` WRITE;
  const sqlProductInsert = newProducts.map(p => {
    const escName = p.product_name.replace(/'/g, "\\'");
    const escDesc = p.description.replace(/'/g, "\\'");
    return `(${p.product_id},${p.vendor_id},'${escName}','${escDesc}',${p.price.toFixed(2)},'${p.category}','Active')`;
  }).join(',\n');

  sqlContent = sqlContent.replace(
    /(\(50,50,'Soundbar','Home theatre soundbar',6999\.00,'Books','Active'\));/,
    `$1,\n${sqlProductInsert};`
  );

  // Find inventory 50 in LOCK TABLES `inventory` WRITE;
  const sqlInventoryInsert = newProducts.map(p => {
    const escBrand = p.brand.replace(/'/g, "\\'");
    return `(${p.product_id},${p.product_id},${p.vendor_id},'${escBrand}',${p.price.toFixed(2)},${p.stock})`;
  }).join(',\n');

  sqlContent = sqlContent.replace(
    /(\(50,50,50,'Super Deals',6999\.00,0)\);/,
    `$1,\n${sqlInventoryInsert};`
  );

  fs.writeFileSync(sqlPath, sqlContent, 'utf8');
  console.log("Successfully updated backend/database/multi_vendor_ecommerce.sql with 164 products & inventory");
}

// 4. Update src/services/storage.ts version key so browser re-seeds
const storagePath = './src/services/storage.ts';
let storageContent = fs.readFileSync(storagePath, 'utf8');
storageContent = storageContent.replace(
  /SEEDED:\s*'[^']+'/,
  "SEEDED: 'markethub_seeded_v5_164products'"
);
fs.writeFileSync(storagePath, storageContent, 'utf8');
console.log("Successfully bumped storage SEEDED key in src/services/storage.ts");
