# AI Producer App

A comprehensive video content creation platform built with Next.js, Prisma, and modern React patterns.

## Features

- **Database Integration**: Prisma ORM with SQLite database
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Form Management**: Multi-step form with validation
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive design

## Recent Fixes

- ✅ Database schema fixes: Changed videoDuration from Int? to Float? for decimal support
- ✅ UI improvements: Removed redundant 'AI Producer' text, enlarged logo for better visibility
- ✅ Step 5 validation fixes: Enhanced form validation and error handling
- ✅ Production-ready build configuration

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── scripts/            # Database seeding scripts
```

## Database Schema

The application uses Prisma with the following key models:
- User management
- Project data with video duration support (Float for decimal values)
- Platform-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
