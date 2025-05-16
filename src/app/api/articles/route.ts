import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export const revalidate = 3600; // revalidate every hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'
  const pageSize = 12

  try {
    const where: Prisma.ArticleWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
              ],
            }
          : {},
        category
          ? {
              category: {
                slug: { equals: category, mode: Prisma.QueryMode.insensitive },
              },
            }
          : {},
      ],
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: {
          ...(sort === 'newest' && { createdAt: 'desc' }),
          ...(sort === 'oldest' && { createdAt: 'asc' }),
          ...(sort === 'title' && { title: 'asc' }),
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    const hasMore = total > page * pageSize

    return NextResponse.json({
      articles,
      hasMore,
      total,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, content, excerpt, image, categoryId, published } = body

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, slug, content and category are required' },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id,
        categoryId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 