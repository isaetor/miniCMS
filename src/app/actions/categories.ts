'use server'

interface GetCategoriesOptions {
  popular?: boolean
  limit?: number
}

export async function getCategories(options: GetCategoriesOptions = {}) {
  try {
    const { popular, limit } = options
    const queryParams = new URLSearchParams()

    if (popular) queryParams.set('popular', 'true')
    if (limit) queryParams.set('limit', limit.toString())

    const url = `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/categories?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}