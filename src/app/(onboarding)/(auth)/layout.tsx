// src/app/(onboarding)/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="bg-white dark:bg-gray-dark">
          {children}
        </body>
      </html>
    );
  }