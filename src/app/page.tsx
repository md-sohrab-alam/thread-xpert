'use client'

import { useState } from 'react'
import { Wand2, Split, Sparkles, Copy, Loader2, Edit3, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface EditableResult {
  id: string
  text: string
  isEditing: boolean
}

export default function AIThreadEditor() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<EditableResult[]>([])
  const [mode, setMode] = useState('grammar')
  const [targetCharacters, setTargetCharacters] = useState(280)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError('')
    setResult([])

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          mode: mode,
          targetCharacters: mode === 'shorten' ? targetCharacters : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process text')
      }

      // Convert result to editable format
      const editableResults: EditableResult[] = (data.result || []).map((text: string, index: number) => ({
        id: `result-${index}`,
        text: text,
        isEditing: false
      }))
      
      setResult(editableResults)
    } catch (err) {
      console.error('Error processing text:', err)
      setError(err instanceof Error ? err.message : 'Failed to process text')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
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

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const getCharacterStatus = (count: number) => {
    const limit = mode === 'split' ? 280 : targetCharacters
    if (count <= limit) return 'text-green-600'
    if (count <= limit + 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCharacterLimit = () => {
    return mode === 'split' ? 280 : targetCharacters
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 lg:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            AI Thread Editor ✨
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Transform your text into perfect social media posts with AI
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Paste or type your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] resize-none text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-sm"
              />
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                <span>Ready to process your text</span>
                <span className={`font-medium ${input.length > 0 ? 'text-blue-600' : ''}`}>
                  {input.length} characters
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Characters for Shorten Mode */}
        {mode === 'shorten' && (
          <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Target Character Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={targetCharacters}
                    onChange={(e) => setTargetCharacters(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-base sm:text-lg font-bold text-blue-600 min-w-[50px] text-center">
                    {targetCharacters}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Drag to adjust the target character limit for shortening
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <Tabs value={mode} onValueChange={setMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="grammar" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Wand2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium">Fix Grammar</span>
                </TabsTrigger>
                <TabsTrigger value="split" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Split className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium">Split for X</span>
                </TabsTrigger>
                <TabsTrigger value="shorten" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <span className="text-sm sm:text-base">✂️</span>
                  <span className="text-xs font-medium">Shorten</span>
                </TabsTrigger>
                <TabsTrigger value="viral" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium">Make Viral</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Process Button */}
        <Button
          onClick={handleProcess}
          className="w-full mb-4 sm:mb-6 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span className="text-lg sm:text-xl mr-2">💡</span>
              Process with AI
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

        {/* Results */}
        {result.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                AI Results
              </h2>
              {mode === 'split' && (
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all text-sm"
                >
                  {showPreview ? 'Hide' : 'Show'} X Preview
                </Button>
              )}
            </div>

            {/* X Preview */}
            {showPreview && mode === 'split' && (
              <Card className="mb-4 sm:mb-6 bg-black text-white shadow-2xl border-0">
                <CardContent className="p-3 sm:p-4">
                  <div className="max-w-sm mx-auto">
                    <div className="bg-black rounded-xl p-3 sm:p-4 border border-gray-700 shadow-inner">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-white text-sm">Your Name</div>
                          <div className="text-gray-400 text-xs">@username</div>
                        </div>
                      </div>
                      {result.map((item, index) => (
                        <div key={item.id} className="mb-3 last:mb-0">
                          <div className="text-xs text-gray-400 mb-1">
                            {index + 1}/{result.length}
                          </div>
                          <div className="text-white text-sm leading-relaxed">{item.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.map((item, index) => (
              <Card key={item.id} className="relative shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-3">
                    <div className="flex-1 w-full">
                      <div className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">
                        {mode === 'split' ? `Thread ${index + 1}` : 'AI Result'}
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
                      
                      <div className={`text-xs mt-3 font-medium ${getCharacterStatus(getCharacterCount(item.text))}`}>
                        {getCharacterCount(item.text)} characters
                        {getCharacterCount(item.text) > getCharacterLimit() && (
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 