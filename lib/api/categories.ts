/**
 * Helper to fetch categories data from /api/categories endpoint
 */
export async function fetchCategoriesFromApi(): Promise<any[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('fetchCategoriesFromApi error, falling back to direct db query:', error);
    try {
      const { connectToDatabase } = await import('@/lib/db');
      const Category = (await import('@/models/Category')).default;
      await connectToDatabase();
      return await Category.find().sort({ order: 1, name: 1 }).lean();
    } catch {
      return [];
    }
  }
}
