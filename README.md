# Course Central

An AI-powered course planning tool for university students.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deploy on Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your changes to a GitHub repository
2. Go to [Vercel](https://vercel.com/) and sign in
3. Click "Add New..." → "Project"
4. Select your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: CourseCentral-WebApp/
   - Build Command: npm run vercel-build
   - Output Directory: .next
   - Install Command: npm install
6. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI: `npm install -g vercel`
2. Navigate to the project directory
3. Run `vercel` to deploy
4. Follow the prompts to configure your project

## Troubleshooting Deployment Issues

If you encounter issues during deployment:

1. Check that environment variables are correctly set in Vercel
2. Ensure Node.js version is set to 18.x or higher
3. If build fails, check the Vercel build logs for specific errors
4. TypeScript and ESLint errors are already configured to be ignored during builds

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
