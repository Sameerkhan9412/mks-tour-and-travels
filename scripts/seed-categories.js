const mongoose = require('mongoose');

const uri = 'mongodb+srv://sameerkhann:TooE7b7ksfzNDWEU@cluster0.2nuc8ft.mongodb.net/mks_travels';

const defaultCategories = [
  {
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=300&q=80',
    description: 'Land of Gods, Rishikesh & Himalayan Trails',
    order: 1,
    featured: true,
  },
  {
    name: 'Kashmir',
    slug: 'kashmir',
    image: 'https://plus.unsplash.com/premium_photo-1697730321309-0389da6f762b?q=80',
    description: 'Paradise on Earth, Dal Lake & Gulmarg',
    order: 2,
    featured: true,
  },
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=300&q=80',
    description: 'Manali, Shimla, Snow Valleys & Apple Groves',
    order: 3,
    featured: true,
  },
  {
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=300&q=80',
    description: 'Sun-kissed Beaches, Cruises & Coastal Heritage',
    order: 4,
    featured: true,
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80',
    description: 'Royal Palaces, Desert Sand Dunes & Forts',
    order: 5,
    featured: true,
  },
  {
    name: 'Ladakh',
    slug: 'ladakh',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=80',
    description: 'Pangong Tso, Khardung La & High Passes',
    order: 6,
    featured: true,
  },
  {
    name: 'Spiti',
    slug: 'spiti',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80',
    description: 'The Middle Land, Ancient Gompas & Cold Desert',
    order: 7,
    featured: true,
  },
  {
    name: 'Andaman & Nicobar',
    slug: 'andaman-nicobar',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=300&q=80',
    description: 'Coral Reefs, Tropical Islands & Scuba Diving',
    order: 8,
    featured: true,
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    image: 'https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?q=80',
    description: "God's Own Country, Backwaters & Munnar Hills",
    order: 9,
    featured: true,
  },
  {
    name: 'Sikkim',
    slug: 'sikkim',
    image: 'https://plus.unsplash.com/premium_photo-1697729690458-2d64ca777c04?q=80&w=1170',
    description: 'Kanchenjunga Vistas & Buddhist Monasteries',
    order: 10,
    featured: true,
  },
];

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB successfully.');
  const collection = mongoose.connection.db.collection('categories');

  for (const cat of defaultCategories) {
    const res = await collection.updateOne(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: cat.description,
          order: cat.order,
          featured: cat.featured,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`Saved: ${cat.name} (Matched: ${res.matchedCount}, Upserted: ${res.upsertedCount})`);
  }

  const count = await collection.countDocuments();
  console.log(`Total categories in DB: ${count}`);

  const sample = await collection.find({}, { projection: { name: 1, slug: 1, order: 1 } }).sort({ order: 1 }).toArray();
  console.log('Categories list:');
  console.log(JSON.stringify(sample, null, 2));

  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error adding categories:', err);
  process.exit(1);
});
