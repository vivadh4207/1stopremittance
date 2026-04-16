'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus, Edit3, Trash2, Eye, EyeOff, Save, ArrowLeft,
  FileText, Send, X, Clock, Tag, Image, Search,
  ChevronDown, CheckCircle, AlertCircle, Loader2,
  ShieldCheck, XCircle, LogIn, LogOut, User, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_EMAIL = 'vivadh4207@gmail.com'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorEmail: string
  category: string
  tags: string[]
  coverImage: string
  published: boolean
  status: 'pending' | 'approved' | 'rejected'
  publishedAt: string
  updatedAt: string
  readTime: number
  seoTitle: string
  seoDescription: string
  rejectionReason?: string
}

const CATEGORIES = [
  { value: 'guides', label: 'Guides', emoji: '📖' },
  { value: 'news', label: 'Industry News', emoji: '📰' },
  { value: 'tips', label: 'Money Tips', emoji: '💡' },
  { value: 'corridors', label: 'Corridors', emoji: '🌍' },
  { value: 'industry', label: 'Industry', emoji: '🏦' },
]

const COVER_EMOJIS = ['💸', '🌍', '💰', '📊', '🏦', '📱', '🔄', '💎', '🇳🇬', '🇵🇭', '🇮🇳', '🇲🇽', '🇰🇪', '📈', '🛡️', '⚡']

type View = 'login' | 'list' | 'editor' | 'moderate'
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function BlogAdminPage() {
  const [view, setView] = useState<View>('login')
  const [adminEmail, setAdminEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [rejectSlug, setRejectSlug] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

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
      const res = await fetch('/api/blog/moderate', {
        headers: { 'x-admin-email': ADMIN_EMAIL },
      })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      const allPosts = [...data.pending, ...data.approved, ...data.rejected]
      allPosts.sort((a: BlogPost, b: BlogPost) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setPosts(allPosts)
    } catch {
      showToast('error', 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  function handleLogin() {
    if (adminEmail.toLowerCase().trim() === ADMIN_EMAIL) {
      setIsAdmin(true)
      setView('list')
      setLoading(true)
      fetchPosts()
    } else {
      showToast('error', 'Unauthorized. Admin access only.')
    }
  }

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
          title, excerpt, content, category,
          tags: tagsInput, coverImage,
          published: shouldPublish !== undefined ? shouldPublish : published,
          seoTitle, seoDescription,
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

  async function handleModerate(slug: string, action: 'approve' | 'reject') {
    if (action === 'reject' && !rejectReason.trim()) {
      setRejectSlug(slug)
      return
    }
    try {
      const res = await fetch('/api/blog/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': ADMIN_EMAIL,
        },
        body: JSON.stringify({ slug, action, reason: rejectReason }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('success', action === 'approve' ? 'Post approved and published!' : 'Post rejected')
      setRejectSlug(null)
      setRejectReason('')
      await fetchPosts()
    } catch {
      showToast('error', `Failed to ${action} post`)
    }
  }

  function insertTag(tag: string) {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end)
    const newContent = content.slice(0, start) + `<${tag}>${selected}</${tag}>` + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length)
    }, 0)
  }

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const pendingCount = posts.filter((p) => p.status === 'pending').length

  // Toast component
  const ToastEl = toast ? (
    <div className={cn(
      'fixed top-4 right-4 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-2xl',
      toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    )}>
      {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {toast.message}
    </div>
  ) : null

  // LOGIN VIEW
  if (view === 'login') {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        {ToastEl}
        <div className="w-full max-w-md px-6">
          <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white text-center mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-center text-sm mb-8">
              Sign in to manage blog posts and review submissions
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
              <label className="block text-xs text-gray-500 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50 mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // EDITOR VIEW
  if (view === 'editor') {
    return (
      <main className="min-h-screen bg-gray-950 pt-20 pb-20">
        {ToastEl}
        <div className="mx-auto max-w-6xl px-6">
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
            <div className="lg:col-span-2 space-y-6">
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-4 text-2xl font-bold text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
              />
              <textarea
                value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief excerpt..." rows={2}
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-3 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none"
              />
              {showPreview ? (
                <div className="rounded-xl border border-white/10 bg-gray-900 p-8">
                  <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-p:text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1 rounded-t-xl border border-white/10 border-b-0 bg-gray-800 px-3 py-2">
                    {['h2','h3','strong','em','p'].map((t) => (
                      <button key={t} onClick={() => insertTag(t)} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">{t.toUpperCase()}</button>
                    ))}
                  </div>
                  <textarea
                    id="content-editor" value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in HTML..." rows={20}
                    className="w-full rounded-b-xl border border-white/10 bg-gray-900 px-5 py-4 text-sm text-gray-300 font-mono placeholder:text-gray-700 outline-none focus:border-emerald-400/50 resize-y"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.value} onClick={() => setCategory(cat.value)}
                      className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                        category === cat.value ? 'bg-emerald-400/10 text-emerald-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}>
                      <span>{cat.emoji}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Cover Emoji</h3>
                <div className="relative">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 w-full hover:border-emerald-400/40 transition-colors">
                    <span className="text-3xl">{coverImage}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-gray-800 p-3 z-20 grid grid-cols-8 gap-2">
                      {COVER_EMOJIS.map((emoji) => (
                        <button key={emoji} onClick={() => { setCoverImage(emoji); setShowEmojiPicker(false) }}
                          className="text-2xl rounded-lg p-1 hover:bg-white/10 transition-colors">{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="remittance, nigeria, fees"
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50" />
              </div>
              <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">SEO</h3>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO title (max 60)" maxLength={60}
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 mb-3" />
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description (max 160)" maxLength={160} rows={3}
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // LIST VIEW (with moderation)
  return (
    <main className="min-h-screen bg-gray-950 pt-28 pb-20">
      {ToastEl}

      {/* Rejection reason modal */}
      {rejectSlug && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" /> Reject Post
            </h3>
            <p className="text-sm text-gray-400 mb-4">Provide a reason for rejection (sent to the author).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-red-400/50 resize-none mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectSlug(null); setRejectReason('') }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModerate(rejectSlug, 'reject')}
                disabled={!rejectReason.trim()}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Reject Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-400" /> Blog Admin
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> {ADMIN_EMAIL}
              <button onClick={() => { setView('login'); setIsAdmin(false); setAdminEmail('') }}
                className="ml-2 text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </p>
          </div>
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-white">{posts.length}</p>
            <p className="text-xs text-gray-500">Total Posts</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-amber-400">{posts.filter(p => p.status === 'pending').length}</p>
            <p className="text-xs text-gray-500">Pending Review</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-emerald-400">{posts.filter(p => p.status === 'approved').length}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
            <p className="text-2xl font-bold text-red-400">{posts.filter(p => p.status === 'rejected').length}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>

        {/* Pending banner */}
        {pendingCount > 0 && (
          <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">
                {pendingCount} post{pendingCount > 1 ? 's' : ''} waiting for review
              </span>
            </div>
            <button
              onClick={() => setStatusFilter('pending')}
              className="text-xs text-amber-400 hover:underline"
            >
              Show pending
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or authors..."
              className="w-full rounded-xl border border-white/10 bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-3 py-2 text-xs font-medium capitalize transition-colors',
                  statusFilter === s ? 'bg-emerald-400/10 text-emerald-400' : 'text-gray-500 hover:text-white hover:bg-white/5'
                )}>
                {s}
              </button>
            ))}
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
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className={cn(
                  'flex items-start gap-4 rounded-xl border bg-gray-900/50 p-5 transition-colors',
                  post.status === 'pending' ? 'border-amber-400/20' : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className="text-4xl shrink-0">{post.coverImage}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white truncate">{post.title}</h3>
                    <span className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      post.status === 'approved' ? 'bg-emerald-400/10 text-emerald-400' :
                      post.status === 'pending' ? 'bg-amber-400/10 text-amber-400' :
                      'bg-red-400/10 text-red-400'
                    )}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" /> {post.author}
                    </span>
                    <span className="text-xs text-gray-600">{post.authorEmail}</span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime} min
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-600">{post.category}</span>
                  </div>
                  {post.status === 'rejected' && post.rejectionReason && (
                    <p className="mt-2 text-xs text-red-400/80 italic">
                      Rejected: {post.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Moderation buttons for pending posts */}
                  {post.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleModerate(post.slug, 'approve')}
                        className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleModerate(post.slug, 'reject')}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank"
                      className="rounded-lg p-2 text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors" title="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <button onClick={() => openEditor(post)}
                    className="rounded-lg p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors" title="Edit">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(post.slug)}
                    className="rounded-lg p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors" title="Delete">
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
