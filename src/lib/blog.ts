import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string // HTML content
  author: string
  category: 'guides' | 'news' | 'tips' | 'corridors' | 'industry'
  tags: string[]
  coverImage: string // emoji or gradient placeholder
  published: boolean
  publishedAt: string // ISO date
  updatedAt: string
  readTime: number // minutes
  seoTitle: string
  seoDescription: string
}

const BLOG_FILE = path.join(process.cwd(), 'src/data/blog-posts.json')

function ensureDataDir() {
  const dir = path.dirname(BLOG_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getAllPosts(): BlogPost[] {
  ensureDataDir()
  if (!fs.existsSync(BLOG_FILE)) return []
  const data = fs.readFileSync(BLOG_FILE, 'utf-8')
  return JSON.parse(data) as BlogPost[]
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter((p) => p.tags.includes(tag))
}

export function savePost(post: BlogPost): void {
  ensureDataDir()
  const posts = getAllPosts()
  const idx = posts.findIndex((p) => p.slug === post.slug)
  if (idx >= 0) {
    posts[idx] = post
  } else {
    posts.push(post)
  }
  fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2))
}

export function deletePost(slug: string): boolean {
  const posts = getAllPosts()
  const filtered = posts.filter((p) => p.slug !== slug)
  if (filtered.length === posts.length) return false
  ensureDataDir()
  fs.writeFileSync(BLOG_FILE, JSON.stringify(filtered, null, 2))
  return true
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const BLOG_CATEGORIES = [
  { value: 'guides' as const, label: 'Guides', emoji: '📖' },
  { value: 'news' as const, label: 'Industry News', emoji: '📰' },
  { value: 'tips' as const, label: 'Money Tips', emoji: '💡' },
  { value: 'corridors' as const, label: 'Corridors', emoji: '🌍' },
  { value: 'industry' as const, label: 'Industry', emoji: '🏦' },
]
