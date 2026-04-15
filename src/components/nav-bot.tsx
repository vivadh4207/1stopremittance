'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, X, Send, ArrowRight, Minimize2, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  action?: { label: string; href: string }
  timestamp: Date
}

const GREETING: Message = {
  id: 'greeting',
  role: 'bot',
  text: "👋 Hi! I'm your 1Stop guide. I can help you compare remittance rates, find the best provider, or connect you with an advisor. What do you need today?",
  action: undefined,
  timestamp: new Date(),
}

const QUICK_PROMPTS = [
  '💸 Compare rates',
  '🇳🇬 Send to Nigeria',
  '🇵🇭 Send to Philippines',
  '💡 Avoid hidden fees',
  '🧑‍💼 Find an advisor',
  '📖 Read guides',
]

export function NavBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [loading, setLoading] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-open after 5 seconds on first visit (one-time)
  useEffect(() => {
    if (hasGreeted) return
    const timer = setTimeout(() => {
      setOpen(true)
      setHasGreeted(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [hasGreeted])

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open, minimized])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      const data = await res.json()
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: data.response || "I'm not sure about that. Try browsing our services or comparing rates!",
        action: data.action,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const botMsg: Message = {
        id: `bot-err-${Date.now()}`,
        role: 'bot',
        text: "Sorry, I'm having trouble right now. Please browse our services directly.",
        action: { label: 'View All Services →', href: '/' },
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-2xl shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
          aria-label="Open assistant"
        >
          <MessageCircle className="h-6 w-6 text-gray-950" />
          {/* Ping indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50 flex flex-col overflow-hidden transition-all duration-300',
            minimized ? 'h-14' : 'h-[520px]',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400">
                <Bot className="h-4 w-4 text-gray-950" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">1Stop Assistant</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized((v) => !v)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={minimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-medium'
                          : 'bg-gray-800 text-gray-200',
                      )}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.action && (
                        <Link
                          href={msg.action.href}
                          className="mt-2 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                        >
                          {msg.action.label}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-xs rounded-full border border-white/15 bg-gray-800/60 px-3 py-1.5 text-gray-300 hover:border-emerald-400/40 hover:text-white transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-white/10 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(input)
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 rounded-xl border border-white/10 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                    disabled={loading}
                    maxLength={500}
                    aria-label="Chat message"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 disabled:opacity-40 transition-opacity hover:opacity-90"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4 text-gray-950" />
                  </button>
                </form>
                <p className="mt-1.5 text-center text-[10px] text-gray-600">
                  For general information only. Always verify rates at the provider.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
