// src/app/(onboarding)/(auth)/layout.tsx

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <div className="bg-white dark:bg-gray-dark">
          {children}
        </div>
      </>
    );
  }