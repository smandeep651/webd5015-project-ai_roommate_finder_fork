'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from "../../auth"
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import { auth as nextAuth } from '../../auth'



export const auth = nextAuth;

export async function login(provider: string) {
    await signIn(provider, { redirectTo: '/' })
    revalidatePath('/')
}

export async function logout() {
  try {
    // Clear NextAuth session
    await signOut({ redirect: false })
    
    // Manually clear all auth cookies
    const cookieStore = cookies()
    const authCookies = cookieStore.getAll()
      .filter(cookie => cookie.name.startsWith('next-auth.'))
    
    authCookies.forEach(cookie => {
      cookieStore.delete(cookie.name)
    })
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}