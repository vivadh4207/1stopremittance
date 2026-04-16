'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Send, ArrowLeft, CheckCircle, AlertCircle, Loader2,
  FileText, Tag, Image, ChevronDown, Eye, EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'guides', label: 'Guides', emoji: '📖' },
  { value: 'news', label: 'Industry News', emoji: '📰' },
  { value: 'tips', label: 'Money Tips', emoji: '💡' },
  { value: 'corridors', label: 'Corridors', emoji: '🌍' },
  { value: 'industry', label: 'Industry', emoji: '🏦' },
]

const COVER_EMOJIS = ['💸', '🌍', '💰', '📊', '🏦', '📱', '🔄', '💎', '🇳🇬', '🇵🇭', '🇮🇳', '🇲🇽', '🇰🇪', '📈', '🛡️', '⚡']

export default function SubmitBlogPage() {
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('guides')
  const [tagsInput, setTagsInput] = useState('')
  const [coverImage, setCoverImage] = useState('📝')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !authorName.trim() || !authorEmail.trim()) {
      setError('Please fill in your name, email, title, and content.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/blog/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          authorEmail,
          title,
          excerpt,
          content,
          category,
          tags: tagsInput,
          coverImage,
          seoTitle,
          seoDescription,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 flex items-center justify-center">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">Post Submitted!</h1>
          <p className="text-gray-400 mb-2">
            Thank you for your contribution. Your post has been submitted for review.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our editorial team will review your post and publish it if it meets our guidelines.
            You&apos;ll receive an email notification once a decision is made.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/blog"
              className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:border-emerald-400/40 hover:text-white transition-colors"
            >
              Back to Blog
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setTitle('')
                setExcerpt('')
                setContent('')
                setTagsInput('')
                setSeoTitle('')
                setSeoDescription('')
              }}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
            >
              Submit Another
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Submit a Blog Post</h1>
          <p className="text-gray-400">
            Share your knowledge about remittances, money transfers, or fintech.
            All submissions are reviewed by our editorial team before publishing.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Author info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Your Email *</label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Post Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your post title..."
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-4 text-xl font-bold text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Brief Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of your post (shows in blog listing)..."
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-3 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-gray-500">Content (HTML) *</label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {showPreview ? (
                <div className="rounded-xl border border-white/10 bg-gray-900 p-6 min-h-[300px]">
                  <div
                    className="prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-emerald-400 prose-strong:text-white prose-ul:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Write your post content in HTML...

<h2>Introduction</h2>
<p>Your content here...</p>

<h2>Key Points</h2>
<ul>
  <li>Point one</li>
  <li>Point two</li>
</ul>`}
                  rows={16}
                  className="w-full rounded-xl border border-white/10 bg-gray-900 px-5 py-4 text-sm text-gray-300 font-mono placeholder:text-gray-700 outline-none focus:border-emerald-400/50 resize-y"
                />
              )}
            </div>

            {/* Guidelines */}
            <div className="rounded-xl border border-white/10 bg-gray-900/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" /> Submission Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>Content must be original and related to remittances or money transfers</li>
                <li>Use proper HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</li>
                <li>Minimum 300 words of useful, non-promotional content</li>
                <li>No spam, affiliate links, or promotional content for specific providers</li>
                <li>Posts will be reviewed within 48 hours</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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

            {/* Cover Emoji */}
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

            {/* SEO (optional) */}
            <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">SEO (Optional)</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO title (max 60 chars)"
                  maxLength={60}
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
                />
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description (max 160 chars)"
                  maxLength={160}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-emerald-400/50 resize-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
