'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getCategories } from '@/app/actions/categories'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
    id: string
    name: string
    slug: string
}

export default function PopularCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await getCategories({ popular: true, limit: 10 })
            setCategories(categories)
            setLoading(false)
        }
        loadCategories()
    }, [])

    if (loading) {
        return (
            <div className="flex gap-4 flex-wrap">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-10 w-32 rounded-md"
                    />
                ))}
            </div>
        )
    }
    return (
        <>
            {categories.map((category, index) => (
                <Link href={`/articles?category=${category.slug}`} key={category.id} className="w-fit flex items-center justify-center h-10 px-8 rounded-md bg-muted text-muted-foreground">
                    {category.name}
                </Link>
            ))}
            <Link href="/categories" className="w-fit flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-muted text-muted-foreground">
                دسته بندی های بیشتر
                <ChevronLeft size={20} />
            </Link>
        </>
    )
} 