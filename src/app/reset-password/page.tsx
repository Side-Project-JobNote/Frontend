import { Suspense } from "react";
import ResetPasswordForm from "./_components/resetPasswordForm";
import LoadingSpinner from "../_components/loadingSpinner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen flex items-center justify-center bg-black/70">
        <div className="bg-white w-[26.25rem] rounded-lg p-10 shadow-lg">
          <ResetPasswordForm />
        </div>
      </div>
    </Suspense>
  );
}
