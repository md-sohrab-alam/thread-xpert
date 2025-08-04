import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set. API functionality will be limited.')
}

const openai = apiKey ? new OpenAI({ apiKey }) : null

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_MAX = 20 // Maximum requests per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return `rate_limit:${ip}`
}

function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
  const key = getRateLimitKey(request)
  const now = Date.now()
  
  // Get current rate limit data
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    // First request or window expired, start new window
    const resetTime = now + RATE_LIMIT_WINDOW
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: 0, resetTime }
  }
  
  if (current.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  // Increment count
  current.count++
  rateLimitStore.set(key, current)
  
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_MAX - current.count, 
    resetTime: current.resetTime 
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimit = checkRateLimit(request)
    
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toISOString()
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX} requests per day. Try again after ${resetTime}`,
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime
          }
        },
        { status: 429 }
      )
    }

    const { text, mode, targetCharacters = 280, targetLanguage } = await request.json()

    if (!text || !mode) {
      return NextResponse.json(
        { error: 'Text and mode are required' },
        { status: 400 }
      )
    }

    // If no API key is configured, return a helpful error
    if (!openai) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
        },
        { status: 500 }
      )
    }

    let prompt = ''
    let systemPrompt = ''

    switch (mode) {
      case 'grammar':
        systemPrompt = `You are a professional editor.

Given the input text, correct any grammar, spelling, or punctuation errors. Do not change the meaning or tone. Preserve line breaks, formatting, and emojis.

${targetLanguage ? `IMPORTANT: Translate the text to ${targetLanguage} while correcting grammar and spelling.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Only make changes if they improve clarity or correctness.

Return only the corrected text without explanations.`
        prompt = `Input:
${text}

Output:`
        break

      case 'split':
        systemPrompt = `You are an expert at writing X (Twitter) threads.

Split the input into a clear and engaging Twitter thread using the following rules:

1. Each tweet must be under 280 characters.
2. Only use as many tweets as necessary — combine ideas if they fit well together.
3. Start with a strong hook.
4. Use simple formatting (like bullets or emojis) to boost readability.
5. End with a call-to-action or summary if appropriate.

${targetLanguage ? `IMPORTANT: Translate the text to ${targetLanguage} while creating the thread.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Return the threads as a JSON array of strings.`
        prompt = `Input:
${text}

Output Format:
Thread 1:
<Tweet 1>

<Tweet 2>

<Tweet 3>`
        break

      case 'shorten':
        systemPrompt = `You are a copywriting expert.

Your job is to shorten the input text as much as possible **without losing key information or impact**. Use concise, clear wording. Avoid fluff. Preserve the original tone and intent.

Keep emojis and bullet points if present. Keep it under ${targetCharacters} characters if possible.

${targetLanguage ? `IMPORTANT: Translate the text to ${targetLanguage} while shortening it.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Return only the shortened version without explanations.`
        prompt = `Input:
${text}

Output:`
        break

      case 'viral':
        systemPrompt = `You are a viral content strategist for X (Twitter).

Rewrite the input text to maximize engagement and shareability. Make it bold, punchy, and emotional. Use short sentences, power words, emojis, and modern internet style.

Optional: Add a question, bold opinion, or CTA to drive reactions.

Preserve the original message, but amplify it with viral energy.

${targetLanguage ? `IMPORTANT: Translate the text to ${targetLanguage} while making it viral.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Return only the viral version without explanations.`
        prompt = `Input:
${text}

Output:`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid mode' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: mode === 'split' ? 1000 : 500,
    })

    const result = completion.choices[0]?.message?.content

    if (!result) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    // Handle split mode specially to parse JSON
    if (mode === 'split') {
      try {
        const threads = JSON.parse(result)
        if (Array.isArray(threads)) {
          return NextResponse.json({ 
            result: threads,
            rateLimit: {
              remaining: rateLimit.remaining,
              resetTime: rateLimit.resetTime
            }
          })
        }
      } catch (e) {
        // If JSON parsing fails, split by newlines
        const threads = result.split('\n').filter(t => t.trim().length > 0)
        return NextResponse.json({ 
          result: threads,
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime
          }
        })
      }
    }

    return NextResponse.json({ 
      result: [result],
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime
      }
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    )
  }
} 