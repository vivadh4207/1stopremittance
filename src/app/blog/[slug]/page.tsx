import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPublishedPosts, BLOG_CATEGORIES } from '@/lib/blog'
import { ArrowLeft, Clock, Calendar, Tag, Share2, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    alternates: {
      canonical: `https://1stopremittance.com/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || !post.published) notFound()

  const allPosts = getPublishedPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3)

  const category = BLOG_CATEGORIES.find((c) => c.value === post.category)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: '1StopRemittance',
      url: 'https://1stopremittance.com',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `https://1stopremittance.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <main className="min-h-screen bg-gray-950 pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              {category?.emoji} {category?.label || post.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime} min read
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-gray-400 mb-6">{post.excerpt}</p>

          <div className="flex items-center justify-between border-t border-b border-white/10 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="flex gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400"
                >
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Cover */}
        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/10 p-16 mb-10 text-8xl">
          {post.coverImage}
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-emerald max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-gray-300 prose-li:mb-2
            prose-ol:text-gray-300
            prose-blockquote:border-emerald-400 prose-blockquote:text-gray-400
            prose-table:text-gray-300
            prose-th:text-white prose-th:bg-gray-800/50 prose-th:px-4 prose-th:py-2
            prose-td:px-4 prose-td:py-2 prose-td:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to compare rates?
          </h3>
          <p className="text-gray-400 mb-4">
            Find the cheapest provider for your next transfer in seconds.
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
          >
            Compare Rates Now
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-white/10 bg-gray-900/50 p-5 hover:border-emerald-400/30 transition-all"
                >
                  <div className="text-4xl mb-3">{p.coverImage}</div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}
