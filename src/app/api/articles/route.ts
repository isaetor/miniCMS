import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export const revalidate = 3600; // revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'desc'

    const skip = (page - 1) * limit

    const where: Prisma.ArticleWhereInput = {
      published: true,
      ...(category && {
        category: {
          slug: category
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { excerpt: { contains: search, mode: Prisma.QueryMode.insensitive } }
        ]
      })
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput = {
      publishedAt: sort as Prisma.SortOrder
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        distinct: ['id'],
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
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
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