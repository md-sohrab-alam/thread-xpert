# AI Thread Editor ✨

A powerful, enterprise-level web app to transform and optimize text for social media posts, particularly designed for X (Twitter) threads. Powered by OpenAI's GPT-3.5-turbo with advanced multilingual support and SEO optimization.

## 🌟 Key Features

### 🤖 AI Processing Modes
- **Fix Grammar**: AI-powered grammar correction using GPT-3.5-turbo
- **Split for X**: Intelligent splitting of long text into X threads with 280 character limit
- **Shorten**: AI-powered text shortening while maintaining key messages
- **Make Viral**: AI-enhanced text optimization for social media engagement

### 🌍 Multilingual Support
- **20+ Languages**: Translate content to English, Hindi, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Bengali, Urdu, Tamil, Telugu, Marathi, Gujarati, Punjabi
- **Language Preservation**: Keep original language or translate to your choice
- **Cultural Adaptation**: AI understands context for different languages

### 🧵 Thread Management
- **Auto-numbering**: Customizable thread numbering (1/8, 1:, 1., etc.)
- **Smart Formatting**: Flexible numbering formats for different styles
- **X Preview**: Real-time preview of how threads will appear on X
- **Character Limits**: Automatic 280-character enforcement for X threads

### ✨ User Experience
- **Live Character Counter**: Real-time character counting with color coding
- **Editable Results**: Edit AI-generated content inline
- **Copy to Clipboard**: One-click copying of individual results
- **Responsive Design**: Works perfectly on mobile and desktop
- **PWA Support**: Installable as a mobile app

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo
- **SEO**: Comprehensive metadata, Open Graph, Twitter Cards
- **PWA**: Web App Manifest, Service Workers ready
- **Analytics**: Google Analytics integration

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

## 📖 Usage Guide

### Basic Usage
1. **Paste or type** your text in the input area
2. **Select language** (optional) - choose output language or keep original
3. **Choose AI mode**:
   - **Fix Grammar**: AI corrects grammar, spelling, and punctuation
   - **Split for X**: AI intelligently splits text into X threads (280 char limit)
   - **Shorten**: AI shortens text while preserving key messages
   - **Make Viral**: AI optimizes text for social media engagement
4. **Configure options**:
   - For Split mode: Enable auto-numbering and customize format
   - For Shorten mode: Adjust target character limit
5. **Click "💡 Process with AI"** to generate results
6. **Edit results** inline if needed
7. **Copy individual results** using the copy button

### Advanced Features

#### 🌍 Language Translation
- Select your desired output language from the dropdown
- Choose "Keep original language" to preserve input language
- Supports 20+ languages including major world languages and Indian languages

#### 🧵 Thread Auto-numbering
- Enable auto-numbering for split mode
- Customize format: `{current}/{total}`, `{current}:`, `{current}.`, etc.
- Examples: "1/8", "1:", "1.", "Tweet 1 of 8"

#### 📱 Mobile Experience
- Install as PWA on mobile devices
- Responsive design works on all screen sizes
- Touch-optimized interface

## 🤖 AI Features in Detail

### Fix Grammar Mode
- Uses GPT-3.5-turbo to correct grammar, spelling, and punctuation
- Professional-grade text editing
- Maintains original meaning while improving clarity
- **Multilingual support**: Works in any language

### Split for X Mode
- AI intelligently splits text by complete thoughts and sentences
- Ensures each thread stays within 280 character limit
- Optimizes for readability and engagement
- Returns multiple threads as separate copyable items
- X Preview shows how threads will appear
- **Auto-numbering**: Customizable thread numbering
- **Smart formatting**: Flexible numbering styles

### Shorten Mode
- AI shortens text to fit within target character limit
- Preserves key messages and meaning
- Maintains readability and flow
- Adjustable character limit (100-500 characters)
- **Language preservation**: Maintains original language

### Make Viral Mode
- AI enhances text for social media engagement
- Adds relevant emojis and compelling language
- Optimizes for virality and shareability
- **Cultural adaptation**: Understands context for different languages

## 📱 Mobile & PWA Features

- **Fully responsive design** that works on mobile and desktop
- **PWA support** - installable as a mobile app
- **Optimized touch interactions** for mobile devices
- **Clean, modern UI** with proper spacing
- **Compact layout** fits on single screen
- **Offline-ready** with service worker support
- **App-like experience** on mobile devices

## 🚀 Development & SEO

- **Built with Next.js 14 App Router** for optimal performance
- **Uses shadcn/ui components** for consistent design
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **OpenAI API integration** for intelligent text processing
- **Comprehensive SEO optimization** with metadata, Open Graph, Twitter Cards
- **Structured data** (JSON-LD) for rich search snippets
- **Google Analytics** integration for user insights
- **PWA ready** with web app manifest

## Environment Variables

Create a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 SEO & Performance Benefits

### Search Engine Optimization
- **Rich metadata** for better search rankings
- **Open Graph tags** for beautiful social media sharing
- **Twitter Cards** for enhanced Twitter previews
- **Structured data** for rich search snippets
- **Sitemap.xml** for search engine discovery
- **Robots.txt** for proper crawling

### Performance Features
- **Fast loading** with Next.js optimization
- **PWA support** for mobile app-like experience
- **Responsive design** for all devices
- **Analytics tracking** for user insights
- **Offline capability** with service workers

### Business Benefits
- **Global reach** with 20+ language support
- **Professional appearance** in search results
- **Social media friendly** with optimized sharing
- **Mobile-first design** for modern users
- **Enterprise-level features** for professional use

## 📊 Analytics & Insights

The app includes Google Analytics integration to track:
- User engagement and feature usage
- Popular processing modes
- Language preferences
- Copy actions and social sharing
- Performance metrics

## License

MIT License 