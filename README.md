# Universal Social Media Content Generator ✨

A powerful, enterprise-level web app to create and polish content for all social media platforms. Powered by OpenAI's GPT-3.5-turbo with intelligent platform-specific formatting and professional content generation.

🔗 https://thread-xpert.vercel.app

## 🌟 Key Features

### 🤖 Two Input Modes
- **Context to Content**: Provide short context/intent, AI generates full content for selected platforms
- **Content Polishing**: Paste your content, AI formats and polishes it for selected platforms

### 📱 Multi-Platform Support
- **Twitter**: Short, engaging tweets with thread support (280 char limit)
- **LinkedIn**: Professional thought-leadership posts (3000 char limit)
- **Email**: Complete emails with subject lines and proper structure (5000 char limit)
- **Instagram**: Engaging captions with emojis and hashtags (2200 char limit)
- **WhatsApp**: Casual, conversational messages (1000 char limit)

### 🎨 Style Customization
- **Tone Options**: Professional, Casual, Motivational, Friendly, Formal
- **Persona Selection**: Tech Founder, Marketer, Entrepreneur, Professional, Student, Influencer
- **Platform-Specific Formatting**: Each platform gets optimized content structure

### ✨ User Experience
- **Live Character Counter**: Real-time character counting with platform-specific limits
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

### Mode 1: Context to Content
1. **Select "Context to Content"** mode
2. **Enter your intent** (e.g., "Apply for 2 days leave", "Tweet about 25% tariff hike")
3. **Choose platforms** where you want content generated
4. **Select tone and persona** for your content style
5. **Click "Generate Content"** to create platform-specific content

### Mode 2: Content Polishing
1. **Select "Content Polishing"** mode
2. **Paste your content** in the input area
3. **Choose platforms** where you want the content formatted
4. **Select tone and persona** for your content style
5. **Click "Generate Content"** to polish and format your content

### Platform-Specific Features

#### 🐦 Twitter
- **Character Limit**: 280 characters per tweet
- **Style**: Short, punchy, engaging
- **Features**: Thread support, hashtag optimization
- **Format**: Single tweet or thread format

#### 💼 LinkedIn
- **Character Limit**: 3000 characters
- **Style**: Professional, thought leadership
- **Features**: Paragraph formatting, call-to-action
- **Format**: Professional post with proper formatting

#### 📧 Email
- **Character Limit**: 5000 characters
- **Style**: Formal, clear, professional
- **Features**: Subject line, greeting, body, sign-off
- **Format**: Complete email with proper structure

#### 📸 Instagram
- **Character Limit**: 2200 characters
- **Style**: Visual, engaging, emoji-friendly
- **Features**: Emoji optimization, hashtag suggestions
- **Format**: Instagram caption with emojis and hashtags

#### 💬 WhatsApp
- **Character Limit**: 1000 characters
- **Style**: Casual, friendly, conversational
- **Features**: Simple, direct messaging
- **Format**: Simple, casual message

## 🤖 AI Features in Detail

### Context to Content Mode
- **Intelligent Generation**: AI understands your intent and creates appropriate content
- **Platform Optimization**: Each platform gets tailored content structure
- **Style Consistency**: Maintains selected tone and persona across platforms
- **Character Compliance**: Respects platform-specific character limits

### Content Polishing Mode
- **Grammar Correction**: Improves grammar, spelling, and punctuation
- **Platform Formatting**: Adapts content structure for each platform
- **Engagement Enhancement**: Makes content more engaging and shareable
- **Style Application**: Applies selected tone and persona to existing content

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
- **OpenAI API integration** for intelligent content generation
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
- **Multi-platform content creation** for comprehensive social media presence
- **Professional appearance** in search results
- **Social media friendly** with optimized sharing
- **Mobile-first design** for modern users
- **Enterprise-level features** for professional use

## 📊 Analytics & Insights

The app includes Google Analytics integration to track:
- User engagement and feature usage
- Popular platforms and content types
- Tone and persona preferences
- Copy actions and social sharing
- Performance metrics

## License

MIT License 
