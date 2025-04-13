import { auth } from "@/lib/actions";
import { redirect } from "next/navigation";
import ClientOnboardingPage from "../_components/ClientOnboardingPage";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?message=signin_required");
  }

  return <ClientOnboardingPage />;
}
