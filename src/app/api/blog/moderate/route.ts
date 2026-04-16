import { NextRequest, NextResponse } from 'next/server'
import { approvePost, rejectPost, getPendingPosts, getAllPosts, ADMIN_EMAIL } from '@/lib/blog'

// GET /api/blog/moderate — get all posts with moderation status (admin only)
export async function GET(req: NextRequest) {
  const email = req.headers.get('x-admin-email')
  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = getAllPosts()
  const pending = all.filter((p) => p.status === 'pending')
  const approved = all.filter((p) => p.status === 'approved')
  const rejected = all.filter((p) => p.status === 'rejected')

  return NextResponse.json({
    pending,
    approved,
    rejected,
    stats: {
      total: all.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
    },
  })
}

// POST /api/blog/moderate — approve or reject a post (admin only)
export async function POST(req: NextRequest) {
  const email = req.headers.get('x-admin-email')
  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug, action, reason } = await req.json()

    if (!slug || !action) {
      return NextResponse.json({ error: 'slug and action are required' }, { status: 400 })
    }

    if (action === 'approve') {
      const post = approvePost(slug)
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json({ success: true, post })
    }

    if (action === 'reject') {
      const post = rejectPost(slug, reason)
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json({ success: true, post })
    }

    return NextResponse.json({ error: 'Invalid action. Use "approve" or "reject".' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
