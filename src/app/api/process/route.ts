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

const PLATFORM_GUIDELINES = {
  twitter: {
    maxLength: 280,
    style: "Short, punchy, engaging. Use hashtags sparingly. Split into threads if needed.",
    format: "Single tweet or thread format"
  },
  linkedin: {
    maxLength: 3000,
    style: "Professional, thought leadership. Use paragraphs. Include call-to-action.",
    format: "Professional post with proper formatting"
  },
  email: {
    maxLength: 5000,
    style: "Formal, clear, professional. Include subject line, greeting, body, sign-off.",
    format: "Complete email with subject line and proper structure"
  },
  instagram: {
    maxLength: 2200,
    style: "Visual, engaging, emoji-friendly. Use relevant hashtags. Include call-to-action.",
    format: "Instagram caption with emojis and hashtags"
  },
  whatsapp: {
    maxLength: 139,
    style: "Short, personal, status-like. Keep it brief and meaningful. Use emojis sparingly.",
    format: "WhatsApp status update"
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

    const { inputType, text, platforms, tone, persona } = await request.json()

    if (!text || !inputType || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Text, inputType, and platforms are required' },
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

    const results = []

    // Generate content for each selected platform
    for (const platform of platforms) {
      const guidelines = PLATFORM_GUIDELINES[platform as keyof typeof PLATFORM_GUIDELINES]
      if (!guidelines) continue

      let systemPrompt = ''
      let userPrompt = ''

      if (inputType === 'context') {
        // Mode 1: Context to Content
        systemPrompt = `You are an expert content creator specializing in ${platform} content.

Your task is to generate ${platform} content based on the user's context/intent.

Platform Guidelines for ${platform}:
- Style: ${guidelines.style}
- Format: ${guidelines.format}
- Max Length: ${guidelines.maxLength} characters
- Tone: ${tone}
- Persona: ${persona}

IMPORTANT RULES:
1. Generate content that fits the ${platform} platform perfectly
2. Respect the ${guidelines.maxLength} character limit
3. Use the specified ${tone} tone and ${persona} persona
4. Make it engaging and platform-appropriate
5. Return only the generated content, no explanations

For Twitter: Create engaging tweets that can be part of a thread if needed
For LinkedIn: Create professional, thought-leadership content
For Email: Create complete emails with subject line and proper structure
For Instagram: Create engaging captions with emojis and hashtags
For WhatsApp: Create short, personal status updates`

        userPrompt = `Context/Intent: ${text}

Generate ${platform} content:`
      } else {
        // Mode 2: Content Polishing
        systemPrompt = `You are an expert content editor specializing in ${platform} content.

Your task is to polish and format the user's content for ${platform}.

Platform Guidelines for ${platform}:
- Style: ${guidelines.style}
- Format: ${guidelines.format}
- Max Length: ${guidelines.maxLength} characters
- Tone: ${tone}
- Persona: ${persona}

IMPORTANT RULES:
1. Polish the content while maintaining the original message
2. Format it appropriately for ${platform}
3. Respect the ${guidelines.maxLength} character limit
4. Apply the specified ${tone} tone and ${persona} persona
5. Improve grammar, clarity, and engagement
6. Return only the polished content, no explanations

For Twitter: Make it concise and engaging, split into threads if needed
For LinkedIn: Make it professional and thought-leadership oriented
For Email: Format as complete email with proper structure
For Instagram: Add emojis and hashtags, make it visually appealing
For WhatsApp: Keep it short and personal for status updates`

        userPrompt = `Original Content: ${text}

Polish this content for ${platform}:`
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const result = completion.choices[0]?.message?.content

      if (result) {
        results.push({
          platform: platform,
          content: result.trim()
        })
      }
    }

    return NextResponse.json({ 
      result: results,
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