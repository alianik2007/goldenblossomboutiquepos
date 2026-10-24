// ==============================================================
// GOLDEN BLOSSOM BOUTIQUE - PORTABLE PERSISTENT DATABASE
// ==============================================================
// This file stores all your boutique data directly inside your folder.
// When you copy this folder to another PC or system, all your products,
// categories, sales history, and staff load automatically without resetting!
// ==============================================================

window.GBB_DATA = {
  "version": "2.0.0",
  "updatedAt": "2026-10-24T15:00:00.000Z",
  "categories": [
    { "id": "Clothes", "name": "Clothes (Caftans & Dresses)", "icon": "👗" },
    { "id": "Scarves", "name": "Scarves (Silk & Shawls)", "icon": "🧣" },
    { "id": "Jewelry", "name": "Jewelry (Luxury Jewelry)", "icon": "✨" },
    { "id": "Boots", "name": "Boots & Shoes", "icon": "👢" },
    { "id": "Accessories", "name": "Accessories (Bags & Belts)", "icon": "👜" }
  ],
  "products": [
    {
      "id": "GBB-SCV-00101",
      "title": "Hand-Printed Floral Silk Scarf",
      "category": "Scarves",
      "price": 250,
      "stock": 18,
      "image": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400"
    },
    {
      "id": "GBB-BOT-00102",
      "title": "Artisanal Chic Leather Boots",
      "category": "Boots",
      "price": 850,
      "stock": 8,
      "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"
    },
    {
      "id": "GBB-JWL-00103",
      "title": "Royal Gold & Pearl Choker Necklace",
      "category": "Jewelry",
      "price": 450,
      "stock": 12,
      "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"
    },
    {
      "id": "GBB-CLO-00104",
      "title": "Haute Couture Velvet Moroccan Caftan",
      "category": "Clothes",
      "price": 1450,
      "stock": 5,
      "image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400"
    },
    {
      "id": "GBB-ACC-00105",
      "title": "Casablanca Leather Handbag",
      "category": "Accessories",
      "price": 680,
      "stock": 10,
      "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    }
  ],
  "staffList": [
    { "name": "Summer", "pin": "0000", "role": "owner", "title": "Boutique Owner" },
    { "name": "Khadija (Manager)", "pin": "1234", "role": "manager", "title": "Store Manager" },
    { "name": "Youssef", "pin": "5678", "role": "cashier", "title": "Sales Associate" }
  ],
  "salesHistory": []
};
