import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts, BLOG_CATEGORIES, type BlogPost } from '@/lib/blog'
import { ArrowRight, Clock, Calendar, Tag, PenLine } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Blog — Money Transfer Tips, Guides & News | 1StopRemittance',
  description:
    'Expert guides on sending money abroad. Compare providers, avoid hidden fees, and find the cheapest way to send remittances worldwide.',
  openGraph: {
    title: 'Blog — Money Transfer Tips, Guides & News',
    description:
      'Expert guides on sending money abroad. Compare providers, avoid hidden fees, and find the cheapest way to send remittances worldwide.',
  },
}

export const dynamic = 'force-dynamic'

function categoryColor(cat: BlogPost['category']) {
  const map: Record<string, string> = {
    guides: 'bg-blue-500/20 text-blue-400',
    news: 'bg-purple-500/20 text-purple-400',
    tips: 'bg-amber-500/20 text-amber-400',
    corridors: 'bg-emerald-500/20 text-emerald-400',
    industry: 'bg-cyan-500/20 text-cyan-400',
  }
  return map[cat] || 'bg-gray-500/20 text-gray-400'
}

function categoryEmoji(cat: BlogPost['category']) {
  return BLOG_CATEGORIES.find((c) => c.value === cat)?.emoji || '📝'
}

type SearchParams = Promise<{ category?: string }>

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category } = await searchParams
  const allPosts = getPublishedPosts()
  const validCategories = BLOG_CATEGORIES.map((c) => c.value)
  const activeCategory = category && validCategories.includes(category as BlogPost['category'])
    ? (category as BlogPost['category'])
    : null

  const posts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-950 pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-4">
            Blog & Resources
          </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Money Transfer{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Expert guides, provider comparisons, and tips to help you send money
            abroad faster and cheaper.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? 'border border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
                : 'border border-white/10 text-gray-400 hover:border-emerald-400/40 hover:text-white'
            }`}
          >
            All Posts ({allPosts.length})
          </Link>
          {BLOG_CATEGORIES.map((cat) => {
            const count = allPosts.filter((p) => p.category === cat.value).length
            if (count === 0) return null
            return (
              <Link
                key={cat.value}
                href={`/blog?category=${cat.value}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? 'border border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
                    : 'border border-white/10 text-gray-400 hover:border-emerald-400/40 hover:text-white'
                }`}
              >
                {cat.emoji} {cat.label} ({count})
              </Link>
            )
          })}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No posts in this category yet.</p>
            <Link href="/blog" className="mt-4 inline-block text-emerald-400 hover:underline text-sm">
              View all posts
            </Link>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group block mb-16 rounded-2xl border border-white/10 bg-gray-900/50 overflow-hidden hover:border-emerald-400/30 transition-all"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-12 text-8xl">
                    {featured.coverImage}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColor(featured.category)}`}
                      >
                        {categoryEmoji(featured.category)} {featured.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {featured.readTime} min read
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                      {featured.title}
                    </h2>
                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      Read article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-white/10 bg-gray-900/50 overflow-hidden hover:border-emerald-400/30 transition-all"
                  >
                    <div className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-6xl">
                      {post.coverImage}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTime} min
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-0.5 rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500"
                            >
                              <Tag className="h-2.5 w-2.5" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Submit CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8">
            <h3 className="text-xl font-bold text-white mb-2">Have expertise to share?</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Write about remittances, money transfers, or fintech. All submissions are reviewed by our editorial team.
            </p>
            <Link
              href="/blog/submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
            >
              <PenLine className="h-4 w-4" /> Submit a Post
            </Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
