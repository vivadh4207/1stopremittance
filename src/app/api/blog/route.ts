import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, savePost, slugify, ADMIN_EMAIL, type BlogPost } from '@/lib/blog'

// GET /api/blog — list all posts (including drafts, for admin)
export async function GET() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  return NextResponse.json(posts)
}

// POST /api/blog — create or update a post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      published,
      seoTitle,
      seoDescription,
      slug: existingSlug,
    } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const slug = existingSlug || slugify(title)

    // Check for duplicate slug on new posts
    if (!existingSlug) {
      const existing = getAllPosts().find((p) => p.slug === slug)
      if (existing) {
        return NextResponse.json(
          { error: 'A post with this title already exists' },
          { status: 409 }
        )
      }
    }

    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    const existingPost = existingSlug ? getAllPosts().find((p) => p.slug === slug) : null

    const post: BlogPost = {
      slug,
      title,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
      content,
      author: existingPost?.author || '1Stop Editorial Team',
      authorEmail: existingPost?.authorEmail || ADMIN_EMAIL,
      category,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()) : [],
      coverImage: coverImage || '📝',
      published: published ?? false,
      status: published ? 'approved' : (existingPost?.status || 'approved'),
      publishedAt: existingSlug ? (existingPost?.publishedAt || now) : now,
      updatedAt: now,
      readTime,
      seoTitle: seoTitle || title.slice(0, 60),
      seoDescription: seoDescription || (excerpt || content.replace(/<[^>]*>/g, '').slice(0, 155)) + '...',
    }

    savePost(post)

    return NextResponse.json({ success: true, post }, { status: existingSlug ? 200 : 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
