# 🌊 Diving Sites Exploration App

A modern, mobile-first web application for exploring diving sites around the world. Built with Next.js 14+, TypeScript, Prisma, and PostgreSQL.

## ✨ Features

- **🏠 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📱 Mobile-First**: Responsive design optimized for all devices
- **🔐 Authentication**: Secure user authentication with NextAuth.js
- **🌍 40+ Dive Sites**: Comprehensive database of diving locations worldwide
- **⭐ Review System**: 10-star rating system with full CRUD operations
- **🐠 Marine Life Tracking**: 20+ marine species with site associations
- **🔍 Advanced Search**: Filter by difficulty, type, location, and more
- **📊 Rich Data**: Depths, temperatures, visibility, certifications required
- **🚨 Safety Info**: Emergency contact information for each site
- **🗺️ Geographic Data**: Latitude/longitude coordinates for mapping

## 🏗️ Tech Stack

- **Frontend**: Next.js 14.2, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready
- **Development**: ESLint, Prettier, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dvckvc/diving-sites-exploration.git
   cd diving-sites-exploration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/diving_sites"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   # Run database setup script
   chmod +x scripts/setup-db.sh
   ./scripts/setup-db.sh
   
   # Or run manually:
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

The application uses a comprehensive schema with the following main models:

- **User**: Authentication and user profiles
- **DiveSite**: Diving locations with detailed information
- **Review**: 10-star rating system with comments
- **MarineLife**: Species information and descriptions
- **DiveSiteMarineLife**: Many-to-many relationship for site associations

## 🎯 API Endpoints

- `GET /api/sites` - List all diving sites with filtering
- `GET /api/sites/[slug]` - Get specific dive site details
- `GET /api/sites/[slug]/reviews` - Get reviews for a site
- `POST /api/sites/[slug]/reviews` - Add new review
- `GET /api/sites/[slug]/marine-life` - Get marine life at site
- `POST /api/sites/[slug]/marine-life` - Associate marine life with site

## 🔐 Test Accounts

The seeded database includes test accounts:

- **Admin**: `admin@divingsites.com` / `admin123`
- **Guide**: `guide@divingsites.com` / `guide123`
- **User**: `user@divingsites.com` / `user123`

## 🌍 Sample Dive Sites

The application comes pre-loaded with 40+ famous diving sites including:

- **Blue Hole** (Belize) - Advanced wall diving
- **Great Barrier Reef** (Australia) - Beginner-friendly reef diving
- **SS Thistlegorm** (Egypt) - Historic WWII wreck
- **Silfra Fissure** (Iceland) - Crystal clear glacial diving
- **Manta Point** (Indonesia) - Manta ray encounters
- And many more...

## 🐠 Marine Life Database

20+ marine species are included with detailed information:

- Fish species (Clownfish, Blue Tang, Reef Sharks, etc.)
- Marine plants (Kelp, Sea Grass, Corals)
- Each with scientific names and descriptions

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js 14 app router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── explore/        # Main exploration page
│   └── site/[slug]/    # Individual site pages
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── auth/          # Authentication components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── prisma/            # Database schema and migrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npx prisma studio` - Open Prisma database browser

### Database Operations

```bash
# Reset database and reseed
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Deploy migrations to production
npx prisma migrate deploy

# Browse database
npx prisma studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent database ORM
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- The global diving community for inspiration

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/dvckvc/diving-sites-exploration/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce and expected behavior

---

**Happy Diving! 🤿**
