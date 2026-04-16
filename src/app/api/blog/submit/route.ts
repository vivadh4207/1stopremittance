import { NextRequest, NextResponse } from 'next/server'
import { savePost, slugify, getAllPosts, type BlogPost } from '@/lib/blog'

// POST /api/blog/submit — public submission (creates post as pending)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      authorName,
      authorEmail,
      title,
      excerpt,
      content,
      category,
      tags,
      coverImage,
      seoTitle,
      seoDescription,
    } = body

    if (!title?.trim() || !content?.trim() || !authorName?.trim() || !authorEmail?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, title, and content are required' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Basic content validation
    const plainText = content.replace(/<[^>]*>/g, '')
    if (plainText.split(/\s+/).length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 words' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    let slug = slugify(title)

    // Ensure unique slug
    const existing = getAllPosts()
    if (existing.find((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now()}`
    }

    const wordCount = plainText.split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    const post: BlogPost = {
      slug,
      title: title.trim(),
      excerpt: excerpt?.trim() || plainText.slice(0, 160) + '...',
      content,
      author: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      category: category || 'guides',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      coverImage: coverImage || '📝',
      published: false,
      status: 'pending',
      publishedAt: now,
      updatedAt: now,
      readTime,
      seoTitle: seoTitle?.trim() || title.trim().slice(0, 60),
      seoDescription: seoDescription?.trim() || plainText.slice(0, 155) + '...',
    }

    savePost(post)

    return NextResponse.json(
      { success: true, message: 'Post submitted for review', slug: post.slug },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
