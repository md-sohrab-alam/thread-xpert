# AI Thread Editor ✨

An AI-powered web app to transform long-form text into optimized, engaging X (Twitter) threads. Features include grammar correction, smart thread splitting, customizable numbering, multilingual support (20+ languages), and viral content generation. Built with GPT-3.5-turbo and designed as a responsive, mobile-friendly PWA.

🔗 https://thread-xpert.vercel.app
## Features

- **Fix Grammar**: AI-powered grammar correction using GPT-3.5-turbo
- **Split for X**: Intelligent splitting of long text into X threads with 280 character limit
- **Shorten**: AI-powered text shortening while maintaining key messages
- **Make Viral**: AI-enhanced text optimization for social media engagement
- **Live Character Counter**: Real-time character counting with color coding
- **Editable Results**: Edit AI-generated content inline
- **X Preview**: Preview how your threads will look on X
- **Responsive Design**: Works perfectly on mobile and desktop

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

## Deployment

### Option 1: Vercel (Recommended)

1. **Connect to GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your `thread-xpert` repository

2. **Add Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `OPENAI_API_KEY`
   - Set the value to your OpenAI API key

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Get a live URL instantly

### Option 2: Netlify

1. **Connect repository** to Netlify
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment variables** in Netlify dashboard

### Option 3: Railway

1. **Connect GitHub** to Railway
2. **Add environment variables**
3. **Deploy** with one click

## OpenAI API Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory
3. Add your API key: `OPENAI_API_KEY=your_key_here`
4. Restart the development server

## Usage

1. Paste or type your text in the input area
2. Select one of the four AI processing modes:
   - **Fix Grammar**: AI corrects grammar, spelling, and punctuation
   - **Split for X**: AI intelligently splits text into X threads (280 char limit)
   - **Shorten**: AI shortens text while preserving key messages
   - **Make Viral**: AI optimizes text for social media engagement
3. Click "💡 Process with AI" to generate results
4. Edit results inline if needed
5. Copy individual results using the copy button

## AI Features in Detail

### Fix Grammar Mode
- Uses GPT-3.5-turbo to correct grammar, spelling, and punctuation
- Professional-grade text editing
- Maintains original meaning while improving clarity

### Split for X Mode
- AI intelligently splits text by complete thoughts and sentences
- Ensures each thread stays within 280 character limit
- Optimizes for readability and engagement
- Returns multiple threads as separate copyable items
- X Preview shows how threads will appear

### Shorten Mode
- AI shortens text to fit within target character limit
- Preserves key messages and meaning
- Maintains readability and flow
- Adjustable character limit (100-500 characters)

### Make Viral Mode
- AI enhances text for social media engagement
- Adds relevant emojis and compelling language
- Optimizes for virality and shareability

## Mobile Responsive

- Fully responsive design that works on mobile and desktop
- Optimized touch interactions
- Clean, modern UI with proper spacing
- Compact layout fits on single screen

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
