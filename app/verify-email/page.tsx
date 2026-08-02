import { Suspense } from "react";
import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
