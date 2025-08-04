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

${targetLanguage && targetLanguage !== 'same' ? `IMPORTANT: Translate the text to ${targetLanguage} while correcting grammar and spelling.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Only make changes if they improve clarity or correctness.

Return only the corrected text without explanations.`
        prompt = `Input:
${text}

Output:`
        break

      case 'split':
        systemPrompt = `You are an expert at writing X (Twitter) threads.

Split the input into the fewest number of tweets possible using these rules:

1. Each tweet MUST be ≤280 characters - this is a hard limit for X (Twitter).
2. Fill up as much of the 280-character limit as possible without breaking sentences.
3. Each tweet must end at a logical sentence or clause boundary.
4. Do not truncate or omit any content - preserve all information.
5. Start with a strong hook to engage readers.
6. Use simple formatting (bullets, emojis) to boost readability.
7. End with a call-to-action or summary if appropriate.

OPTIMIZATION STRATEGY:
- Maximize character usage (aim for 250-280 characters per tweet)
- Break only at natural sentence/clause boundaries
- Combine related ideas into single tweets when possible
- Ensure smooth flow between tweets

CRITICAL: Double-check that every tweet is under 280 characters before returning.

${targetLanguage && targetLanguage !== 'same' ? `IMPORTANT: Translate the text to ${targetLanguage} while creating the thread.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

Return the threads as a JSON array of strings.`
        prompt = `Input:
${text}

Output:`
        break

      case 'shorten':
        const actualTarget = Math.min(targetCharacters, text.length)
        systemPrompt = `You are a copywriting expert.

Your job is to shorten the input text as much as possible **without losing key information or impact**. Use concise, clear wording. Avoid fluff. Preserve the original tone and intent.

Keep emojis and bullet points if present. Keep it under ${actualTarget} characters if possible.

${targetLanguage && targetLanguage !== 'same' ? `IMPORTANT: Translate the text to ${targetLanguage} while shortening it.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

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

${targetLanguage && targetLanguage !== 'same' ? `IMPORTANT: Translate the text to ${targetLanguage} while making it viral.` : 'IMPORTANT: Maintain the exact same language as the input text. If the input is in Hindi, Spanish, French, or any other language, respond in that same language. Do not translate to English.'}

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

    // Handle split mode specially to parse JSON and validate character limits
    if (mode === 'split') {
      try {
        const threads = JSON.parse(result)
        if (Array.isArray(threads)) {
          // Validate that all threads are under 280 characters
          const validThreads = threads.filter(thread => thread.length <= 280)
          
          if (validThreads.length !== threads.length) {
            console.warn('Some threads exceeded 280 characters and were filtered out')
          }
          
          return NextResponse.json({ 
            result: validThreads,
            rateLimit: {
              remaining: rateLimit.remaining,
              resetTime: rateLimit.resetTime
            }
          })
        }
      } catch (e) {
        // If JSON parsing fails, split by newlines and validate limits
        const threads = result.split('\n').filter(t => t.trim().length > 0)
        const validThreads = threads.filter(thread => thread.length <= 280)
        
        if (validThreads.length !== threads.length) {
          console.warn('Some threads exceeded 280 characters and were filtered out')
        }
        
        return NextResponse.json({ 
          result: validThreads,
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