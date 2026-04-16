'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Save, ArrowLeft,
  FileText, Send, X, Clock, Tag, Image, Search,
  ChevronDown, CheckCircle, AlertCircle, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  coverImage: string
  published: boolean
  publishedAt: string
  updatedAt: string
  readTime: number
  seoTitle: string
  seoDescription: string
}

const CATEGORIES = [
  { value: 'guides', label: 'Guides', emoji: '📖' },
  { value: 'news', label: 'Industry News', emoji: '📰' },
  { value: 'tips', label: 'Money Tips', emoji: '💡' },
  { value: 'corridors', label: 'Corridors', emoji: '🌍' },
  { value: 'industry', label: 'Industry', emoji: '🏦' },
]

const COVER_EMOJIS = ['💸', '🌍', '💰', '📊', '🏦', '📱', '🔄', '💎', '🇳🇬', '🇵🇭', '🇮🇳', '🇲🇽', '🇰🇪', '📈', '🛡️', '⚡']

type View = 'list' | 'editor'

export default function BlogAdminPage() {
  const [view, setView] = useState<View>('list')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Editor state
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('guides')
  const [tagsInput, setTagsInput] = useState('')
  const [coverImage, setCoverImage] = useState('📝')
  const [published, setPublished] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data)
    } catch {
      showToast('error', 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  function resetEditor() {
    setEditingSlug(null)
    setTitle('')
    setExcerpt('')
    setContent('')
    setCategory('guides')
    setTagsInput('')
    setCoverImage('📝')
    setPublished(false)
    setSeoTitle('')
    setSeoDescription('')
    setShowPreview(false)
  }

  function openEditor(post?: BlogPost) {
    if (post) {
      setEditingSlug(post.slug)
      setTitle(post.title)
      setExcerpt(post.excerpt)
      setContent(post.content)
      setCategory(post.category)
      setTagsInput(post.tags.join(', '))
      setCoverImage(post.coverImage)
      setPublished(post.published)
      setSeoTitle(post.seoTitle)
      setSeoDescription(post.seoDescription)
    } else {
      resetEditor()
    }
    setView('editor')
  }

  async function handleSave(shouldPublish?: boolean) {
    if (!title.trim() || !content.trim()) {
      showToast('error', 'Title and content are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingSlug || undefined,
          title,
          excerpt,
          content,
          category,
          tags: tagsInput,
          coverImage,
          published: shouldPublish !== undefined ? shouldPublish : published,
          seoTitle,
          seoDescription,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      const data = await res.json()
      showToast('success', shouldPublish ? 'Post published!' : 'Post saved!')
      setEditingSlug(data.post.slug)
      setPublished(data.post.published)
      await fetchPosts()
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      showToast('success', 'Post deleted')
      await fetchPosts()
    } catch {
      showToast('error', 'Failed to delete post')
    }
  }

  // Toolbar actions for content editor
  function insertTag(tag: string, closingTag?: string) {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end)
    const close = closingTag || tag
    const newContent = content.slice(0, start) + `<${tag}>${selected}</${close}>` + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length)
    }, 0)
  }

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (view === 'editor') {
    return (
      <main className="min-h-screen bg-gray-950 pt-20 pb-20">
        {/* Toast */}
        {toast && (
          <div className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-2xl animate-in slide-in-from-right',
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          )}>
            {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.message}
          </div>
        )}

        <div className="mx-auto max-w-6xl px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => { resetEditor(); setView('list') }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Posts
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Draft
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publish
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-4 text-2xl font-bold text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
              />

              {/* Excerpt */}
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief excerpt (shows in blog listing)..."
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-3 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none"
              />

              {showPreview ? (
                /* Preview */
                <div className="rounded-xl border border-white/10 bg-gray-900 p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                  <div
                    className="prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-emerald-400 prose-strong:text-white prose-ul:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              ) : (
                /* Content editor */
                <div>
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 rounded-t-xl border border-white/10 border-b-0 bg-gray-800 px-3 py-2">
                    <button onClick={() => insertTag('h2')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">H2</button>
                    <button onClick={() => insertTag('h3')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">H3</button>
                    <span className="mx-1 h-4 w-px bg-white/10" />
                    <button onClick={() => insertTag('strong')} className="rounded px-2 py-1 text-xs font-bold text-gray-400 hover:bg-gray-700 hover:text-white">B</button>
                    <button onClick={() => insertTag('em')} className="rounded px-2 py-1 text-xs italic text-gray-400 hover:bg-gray-700 hover:text-white">I</button>
                    <button onClick={() => insertTag('a href=""')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">Link</button>
                    <span className="mx-1 h-4 w-px bg-white/10" />
                    <button onClick={() => insertTag('ul>\n  <li')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">UL</button>
                    <button onClick={() => insertTag('ol>\n  <li')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">OL</button>
                    <button onClick={() => insertTag('blockquote')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">Quote</button>
                    <span className="mx-1 h-4 w-px bg-white/10" />
                    <button onClick={() => insertTag('p')} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">¶</button>
                  </div>

                  <textarea
                    id="content-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in HTML...

<h2>Introduction</h2>
<p>Your content here...</p>

<h2>Key Points</h2>
<ul>
  <li>Point one</li>
  <li>Point two</li>
</ul>"
                    rows={20}
                    className="w-full rounded-b-xl border border-white/10 bg-gray-900 px-5 py-4 text-sm text-gray-300 font-mono placeholder:text-gray-700 outline-none focus:border-emerald-400/50 resize-y"
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Status
                </h3>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'h-2 w-2 rounded-full',
                    published ? 'bg-emerald-400' : 'bg-amber-400'
                  )} />
                  <span className="text-sm text-gray-300">
                    {published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {editingSlug && (
                  <Link
                    href={`/blog/${editingSlug}`}
                    target="_blank"
                    className="mt-3 flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <Eye className="h-3 w-3" /> View live post
                  </Link>
                )}
              </div>

              {/* Category */}
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                        category === cat.value
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span>{cat.emoji}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Image className="h-4 w-4" /> Cover Emoji
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 w-full hover:border-emerald-400/40 transition-colors"
                  >
                    <span className="text-3xl">{coverImage}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-gray-800 p-3 z-20 grid grid-cols-8 gap-2">
                      {COVER_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => { setCoverImage(emoji); setShowEmojiPicker(false) }}
                          className="text-2xl rounded-lg p-1 hover:bg-white/10 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </h3>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="remittance, nigeria, fees"
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                />
                <p className="mt-1.5 text-[10px] text-gray-600">Comma-separated</p>
              </div>

              {/* SEO */}
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">SEO Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">SEO Title (max 60 chars)</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || 'SEO title...'}
                      maxLength={60}
                      className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                    />
                    <p className="mt-1 text-[10px] text-gray-600">{seoTitle.length}/60</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Meta Description (max 160 chars)</label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || 'Meta description...'}
                      maxLength={160}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none"
                    />
                    <p className="mt-1 text-[10px] text-gray-600">{seoDescription.length}/160</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // LIST VIEW
  return (
    <main className="min-h-screen bg-gray-950 pt-28 pb-20">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-2xl',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Blog Manager</h1>
            <p className="text-gray-400 mt-1">Create, edit, and publish blog posts</p>
          </div>
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-white/10 bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-emerald-400/50"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-white">{posts.length}</p>
            <p className="text-xs text-gray-500">Total Posts</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-emerald-400">{posts.filter(p => p.published).length}</p>
            <p className="text-xs text-gray-500">Published</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-amber-400">{posts.filter(p => !p.published).length}</p>
            <p className="text-xs text-gray-500">Drafts</p>
          </div>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No posts yet</p>
            <p className="text-gray-600 text-sm">Create your first blog post to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-gray-900/50 p-5 hover:border-white/20 transition-colors"
              >
                <div className="text-4xl shrink-0">{post.coverImage}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{post.title}</h3>
                    <span className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      post.published ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    )}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime} min
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-600">{post.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => openEditor(post)}
                    className="rounded-lg p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="rounded-lg p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
