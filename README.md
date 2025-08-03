# AI Thread Editor ✨

A utility web app to help users edit and format their text for social media posts, particularly optimized for X (Twitter) threads. Now powered by OpenAI's GPT-3.5-turbo for intelligent text processing.

## Features

- **Fix Grammar**: AI-powered grammar correction using GPT-3.5-turbo
- **Split for X**: Intelligent splitting of long text into X threads with 240 character limit
- **Shorten**: AI-powered text shortening while maintaining key messages
- **Make Viral**: AI-enhanced text optimization for social media engagement

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your OpenAI API key:
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## OpenAI API Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory
3. Add your API key: `OPENAI_API_KEY=your_key_here`
4. Restart the development server

## Usage

1. Paste or type your text in the input area
2. Select one of the four AI processing modes:
   - **Fix Grammar**: AI corrects grammar, spelling, and punctuation
   - **Split for X**: AI intelligently splits text into X threads (240 char limit)
   - **Shorten**: AI shortens text while preserving key messages
   - **Make Viral**: AI optimizes text for social media engagement
3. Click "💡 Process with AI" to generate results
4. Copy individual results using the copy button

## AI Features in Detail

### Fix Grammar Mode
- Uses GPT-3.5-turbo to correct grammar, spelling, and punctuation
- Professional-grade text editing
- Maintains original meaning while improving clarity

### Split for X Mode
- AI intelligently splits text by complete thoughts and sentences
- Ensures each thread stays within 240 character limit
- Optimizes for readability and engagement
- Returns multiple threads as separate copyable items

### Shorten Mode
- AI shortens text to fit within 240 characters
- Preserves key messages and meaning
- Maintains readability and flow

### Make Viral Mode
- AI enhances text for social media engagement
- Adds relevant emojis and compelling language
- Optimizes for virality and shareability

## Mobile Responsive

- Fully responsive design that works on mobile and desktop
- Optimized touch interactions
- Clean, modern UI with proper spacing

## Development

- Built with Next.js 14 App Router
- Uses shadcn/ui components for consistent design
- Tailwind CSS for styling
- TypeScript for type safety
- OpenAI API integration for intelligent text processing

## Environment Variables

Create a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## License

MIT License 