const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'مدیر',
      lastName: 'سیستم',
      role: 'ADMIN',
      image: '/images/default-avatar.jpg'
    },
  })

  // Create categories
  const categories = [
    { name: 'تکنولوژی', slug: 'technology', description: 'مقالات مرتبط با تکنولوژی و فناوری' },
    { name: 'برنامه‌نویسی', slug: 'programming', description: 'مقالات مرتبط با برنامه‌نویسی و توسعه نرم‌افزار' },
    { name: 'هوش مصنوعی', slug: 'ai', description: 'مقالات مرتبط با هوش مصنوعی و یادگیری ماشین' },
    { name: 'طراحی وب', slug: 'web-design', description: 'مقالات مرتبط با طراحی و توسعه وب' },
    { name: 'امنیت', slug: 'security', description: 'مقالات مرتبط با امنیت سایبری' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create sample articles
  const articles = Array.from({ length: 50 }, (_, index) => ({
    title: `مقاله نمونه ${index + 1}`,
    slug: `sample-article-${index + 1}`,
    content: `این یک مقاله نمونه با شماره ${index + 1} است. در این مقاله به بررسی موضوعات مختلف می‌پردازیم...`,
    excerpt: `خلاصه مقاله نمونه ${index + 1} که در آن به بررسی موضوعات مختلف می‌پردازیم.`,
    image: `/images/articles/article${(index % 3) + 1}.jpg`,
    categorySlug: categories[index % categories.length].slug,
    published: true,
  }))

  for (const article of articles) {
    const category = await prisma.category.findUnique({
      where: { slug: article.categorySlug },
    })

    if (category) {
      await prisma.article.create({
        data: {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          image: article.image,
          published: article.published,
          publishedAt: new Date(),
          authorId: admin.id,
          categoryId: category.id,
        },
      })
    }
  }

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 