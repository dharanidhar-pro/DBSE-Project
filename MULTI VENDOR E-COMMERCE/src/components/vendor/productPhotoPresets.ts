/**
 * Curated high-resolution studio photo presets for Indian Multi-Vendor Marketplace
 * Allows vendors to quickly select multi-angle product photography
 */

export interface PhotoPreset {
  id: string;
  title: string;
  category: string;
  angle: 'Front View' | 'Angle Shot' | 'Lifestyle / In-Use' | 'Detail / Close-Up' | 'Packaging';
  url: string;
}

export const CATEGORY_PHOTO_PRESETS: Record<string, PhotoPreset[]> = {
  Electronics: [
    {
      id: 'elec-1',
      title: 'Studio Front Angle',
      category: 'Electronics',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'elec-2',
      title: 'Ergonomic Side Profile',
      category: 'Electronics',
      angle: 'Angle Shot',
      url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'elec-3',
      title: 'Workspace Desk Lifestyle',
      category: 'Electronics',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'elec-4',
      title: 'Hardware & Finish Detail',
      category: 'Electronics',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    },
  ],
  Fashion: [
    {
      id: 'fash-1',
      title: 'Clean Front Studio',
      category: 'Fashion',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'fash-2',
      title: 'Model Full-Length Shot',
      category: 'Fashion',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'fash-3',
      title: 'Fabric Texture Close-Up',
      category: 'Fashion',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'fash-4',
      title: 'Styling & Accessories Flatlay',
      category: 'Fashion',
      angle: 'Angle Shot',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    },
  ],
  Home: [
    {
      id: 'home-1',
      title: 'Modern Living Room Setting',
      category: 'Home',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'home-2',
      title: 'Minimalist Front View',
      category: 'Home',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'home-3',
      title: 'Warm Ambient Perspective',
      category: 'Home',
      angle: 'Angle Shot',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'home-4',
      title: 'Material & Craftsmanship Detail',
      category: 'Home',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    },
  ],
  'Home & Living': [
    {
      id: 'hl-1',
      title: 'Decor Setting',
      category: 'Home & Living',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'hl-2',
      title: 'Product Studio Angle',
      category: 'Home & Living',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'hl-3',
      title: 'Texture & Finish',
      category: 'Home & Living',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    },
  ],
  Sports: [
    {
      id: 'sports-1',
      title: 'Athletic Equipment Front',
      category: 'Sports',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'sports-2',
      title: 'Performance Action Lifestyle',
      category: 'Sports',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'sports-3',
      title: 'Grip & Cushioning Macro',
      category: 'Sports',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'sports-4',
      title: 'Studio Angled View',
      category: 'Sports',
      angle: 'Angle Shot',
      url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    },
  ],
  Books: [
    {
      id: 'books-1',
      title: 'Editorial Book Cover',
      category: 'Books',
      angle: 'Front View',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'books-2',
      title: 'Open Page Typography',
      category: 'Books',
      angle: 'Detail / Close-Up',
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'books-3',
      title: 'Reading Coffee Table Lifestyle',
      category: 'Books',
      angle: 'Lifestyle / In-Use',
      url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'books-4',
      title: 'Spine & Book Collection Stack',
      category: 'Books',
      angle: 'Angle Shot',
      url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
    },
  ],
};
