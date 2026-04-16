import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, deletePost } from '@/lib/blog'

type Params = Promise<{ slug: string }>

// GET /api/blog/[slug] — get single post
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  return NextResponse.json(post)
}

// DELETE /api/blog/[slug] — delete a post
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { slug } = await params
  const deleted = deletePost(slug)
  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
