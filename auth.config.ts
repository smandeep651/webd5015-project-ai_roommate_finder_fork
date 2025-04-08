import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //       const isLoggedIn = !!auth?.user;
      
  //       if (!isLoggedIn) {
  //         // Redirect all unauthenticated requests to login
  //         return false; 
  //       }
        
  //       // Allow access if authenticated
  //       return true;
  //     },
  // },
  providers: [],
} satisfies NextAuthConfig; 

export const authOptions = authConfig;
