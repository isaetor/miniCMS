import { getCategories } from '@/app/actions/categories'
import Link from 'next/link'
interface Category {
  id: string
  name: string
  description: string
  slug: string
  _count?: {
    articles: number
  }
}

export default async function CategoriesPage() {
  const {categories} = await getCategories()

  return (
    <div className="container mx-auto p-4">
        <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
            <div className='text-sm text-muted-foreground'>{categories.length} دسته‌بندی</div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: Category) => (
          <Link
            key={category.id}
            href={`/articles?category=${category.slug}`}
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="leading-5 font-bold">{category.name}</h2>
                <p className="text-sm text-muted-foreground leading-5">
                {category._count?.articles || 0} مقاله
                </p>
            </div>
            <p className='text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 leading-6 h-6 md:h-12'>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}