import { Suspense } from "react";
import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";
import { AuthFormSkeleton } from "@/components/auth/AuthFormSkeleton";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<AuthFormSkeleton />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
