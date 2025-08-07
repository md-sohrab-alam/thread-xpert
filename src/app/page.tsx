'use client'

import { useState, useEffect } from 'react'
import { Wand2, Split, Sparkles, Copy, Loader2, Edit3, Check, X, Linkedin, AlertCircle, Twitter, Mail, Instagram, MessageCircle, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface EditableResult {
  id: string
  text: string
  isEditing: boolean
  platform: string
}

interface RateLimitInfo {
  remaining: number
  resetTime: number
}

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'email', name: 'Email', icon: Mail, color: 'text-gray-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'whatsapp', name: 'WhatsApp Status', icon: MessageCircle, color: 'text-green-500' }
]

const TONES = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'motivational', name: 'Motivational' },
  { id: 'witty', name: 'Witty' },
  { id: 'persuasive', name: 'Persuasive' }
]

const PERSONAS = [
  { id: 'general-user', name: 'General User' },
  { id: 'tech-founder', name: 'Tech Founder' },
  { id: 'marketer', name: 'Marketer' },
  { id: 'hr-manager', name: 'HR Manager' },
  { id: 'influencer', name: 'Influencer' }
]

export default function AIThreadEditor() {
  const [inputType, setInputType] = useState<'context' | 'content'>('context')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<EditableResult[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter'])
  const [tone, setTone] = useState('professional')
  const [persona, setPersona] = useState('general-user')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null)
  const [showRateLimitPopup, setShowRateLimitPopup] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError('')
    setResult([])

    // Track the action with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'process_text', {
        event_category: 'ai_processing',
        event_label: inputType,
        value: input.length
      })
    }

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputType,
          text: input,
          platforms: selectedPlatforms,
          tone,
          persona,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process text')
      }

      // Update rate limit info
      if (data.rateLimit) {
        setRateLimit(data.rateLimit)
      }

      // Convert result to editable format
      const editableResults: EditableResult[] = (data.result || []).map((item: any, index: number) => ({
        id: `result-${index}`,
        text: item.content,
        platform: item.platform,
        isEditing: false
      }))
      
      setResult(editableResults)
    } catch (err) {
      console.error('Error processing text:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to process text'
      
      // Check if it's a rate limit error
      if (errorMessage.includes('Rate limit exceeded')) {
        setShowRateLimitPopup(true)
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      
      // Track copy action
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'copy', {
          event_category: 'engagement',
          event_label: 'copy_result',
          value: text.length
        })
      }
      
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const startEditing = (id: string) => {
    setResult(prev => prev.map(item => 
      item.id === id ? { ...item, isEditing: true } : item
    ))
  }

  const saveEdit = (id: string, newText: string) => {
    setResult(prev => prev.map(item => 
      item.id === id ? { ...item, text: newText, isEditing: false } : item
    ))
  }

  const cancelEdit = (id: string) => {
    setResult(prev => prev.map(item => 
      item.id === id ? { ...item, isEditing: false } : item
    ))
  }

  const updateEditText = (id: string, newText: string) => {
    setResult(prev => prev.map(item => 
      item.id === id ? { ...item, text: newText } : item
    ))
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const getCharacterStatus = (count: number, platform: string) => {
    const limits: { [key: string]: number } = {
      twitter: 280,
      linkedin: 3000,
      email: 5000,
      instagram: 2200,
      whatsapp: 139
    }
    const limit = limits[platform] || 280
    
    if (count <= limit) return 'text-green-600'
    if (count <= limit + 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCharacterLimit = (platform: string) => {
    const limits: { [key: string]: number } = {
      twitter: 280,
      linkedin: 3000,
      email: 5000,
      instagram: 2200,
      whatsapp: 139
    }
    return limits[platform] || 280
  }

  const formatResetTime = (resetTime: number) => {
    const date = new Date(resetTime)
    return date.toLocaleString()
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId)
    return platform?.icon || Twitter
  }

  const getPlatformColor = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId)
    return platform?.color || 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 lg:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Universal Social Media Content Generator ✨
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Create and polish content for all social media platforms with AI
          </p>
        </div>

        {/* Rate Limit Info */}
        {rateLimit && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Daily API Limit: <span className="font-semibold">{rateLimit.remaining}</span> requests remaining
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Resets: {formatResetTime(rateLimit.resetTime)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Type Selection */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Input Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'context' | 'content')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-2 h-auto bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="context" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Wand2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium">Context to Content</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium">Content Polishing</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-3 text-xs sm:text-sm text-gray-600">
              {inputType === 'context' 
                ? "Provide a short context or intent, and AI will generate content for selected platforms."
                : "Paste your content and AI will format and polish it for selected platforms."
              }
            </div>
          </CardContent>
        </Card>

        {/* Main Input Card */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              <Textarea
                placeholder={inputType === 'context' 
                  ? "e.g., 'Apply for 2 days leave', 'Tweet about 25% tariff hike', 'Bio for female founder from India'"
                  : "Paste or write your content here..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] resize-none text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-sm"
              />
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                <span>{inputType === 'context' ? 'Ready to generate content' : 'Ready to polish content'}</span>
                <span className={`font-medium ${input.length > 0 ? 'text-blue-600' : ''}`}>
                  {input.length} characters
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Select Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${platform.color}`} />
                    <span className="text-xs font-medium">{platform.name}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 text-xs sm:text-sm text-gray-600">
              Select the platforms where you want to create or format content
            </div>
          </CardContent>
        </Card>

        {/* Tone and Persona Selection */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Style & Persona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {TONES.map((toneOption) => (
                    <option key={toneOption.id} value={toneOption.id}>
                      {toneOption.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persona</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {PERSONAS.map((personaOption) => (
                    <option key={personaOption.id} value={personaOption.id}>
                      {personaOption.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Button */}
        <Button
          onClick={handleProcess}
          className="w-full mb-4 sm:mb-6 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
          disabled={!input.trim() || selectedPlatforms.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span className="text-lg sm:text-xl mr-2">💡</span>
              Generate Content
            </>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="text-red-600 font-medium text-center text-sm">
                Error: {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rate Limit Popup */}
        {showRateLimitPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full bg-white shadow-2xl border-0">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Daily limit reached.
                </h3>
                <p className="text-gray-600 mb-4">
                  To prevent abuse, we've added basic usage restrictions.
                </p>
                <p className="text-gray-600 mb-4">
                  👉 Premium version launching soon with unlimited access and exclusive features.
                </p>
                <p className="text-gray-600 mb-6">
                  📩 Interested in early access or full service? Connect with me on LinkedIn
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowRateLimitPopup(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // Track LinkedIn click
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'click', {
                          event_category: 'engagement',
                          event_label: 'linkedin_connect',
                          value: 1
                        })
                      }
                      window.open('https://www.linkedin.com/in/mohammad-sohrab-alam-8105474b/', '_blank')
                      setShowRateLimitPopup(false)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect on LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {result.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Generated Content
              </h2>
            </div>

            {result.map((item, index) => {
              const PlatformIcon = getPlatformIcon(item.platform)
              const platformColor = getPlatformColor(item.platform)
              
              return (
                <Card key={item.id} className="relative shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <PlatformIcon className={`h-4 w-4 ${platformColor}`} />
                          <span className="text-xs sm:text-sm text-gray-500 font-medium capitalize">
                            {item.platform}
                          </span>
                        </div>
                        
                        {item.isEditing ? (
                          <div className="space-y-3">
                            <Textarea
                              value={item.text}
                              onChange={(e) => updateEditText(item.id, e.target.value)}
                              className="min-h-[80px] sm:min-h-[100px] resize-none text-sm border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(item.id, item.text)}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-xs"
                              >
                                <Check className="h-3 w-3" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelEdit(item.id)}
                                className="flex items-center gap-1 text-xs"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-gray-900 text-sm sm:text-base leading-relaxed">
                            {item.text}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-3 font-medium ${getCharacterStatus(getCharacterCount(item.text), item.platform)}`}>
                          {getCharacterCount(item.text)} characters
                          {getCharacterCount(item.text) > getCharacterLimit(item.platform) && (
                            <span className="text-red-600 ml-1">(Over limit!)</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(item.id)}
                          className="flex items-center gap-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all flex-1 lg:flex-none text-xs"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.text)}
                          className="flex items-center gap-1 bg-white/80 backdrop-blur-sm hover:bg-white transition-all flex-1 lg:flex-none text-xs"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-8 sm:mt-12 mb-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span>© 2025 <strong className="text-gray-700">Thread Xpert</strong> by Sohrab</span>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/mohammad-sohrab-alam-8105474b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
} 