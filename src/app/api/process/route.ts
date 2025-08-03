import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set. API functionality will be limited.')
}

const openai = apiKey ? new OpenAI({ apiKey }) : null

export async function POST(request: NextRequest) {
  try {
    const { text, mode, targetCharacters = 280 } = await request.json()

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
          return NextResponse.json({ result: threads })
        }
      } catch (e) {
        // If JSON parsing fails, split by newlines
        const threads = result.split('\n').filter(t => t.trim().length > 0)
        return NextResponse.json({ result: threads })
      }
    }

    return NextResponse.json({ result: [result] })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    )
  }
} 