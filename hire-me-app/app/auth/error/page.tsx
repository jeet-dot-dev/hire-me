import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error ?? "unknown_error";

  let title = "Authentication error";
  let message =
    "Something went wrong while signing you in. Please try again or contact support.";

  if (error === "OAuthAccountNotLinked") {
    title = "Account conflict: social account not linked";
    message =
      "An account with this email already exists but isn't linked to this social provider.\nPlease sign in with your email & password, then connect your Google/GitHub account from Account Settings. If you don't remember your password, use 'Forgot password'.";
  } else if (error === "AccessDenied") {
    title = "Access denied";
    message = "You denied access to the OAuth provider. You can try signing in again.";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="whitespace-pre-wrap text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="inline-block px-4 py-2 bg-sky-600 text-white rounded"
          >
            Sign in with email
          </Link>

          <Link
            href="/"
            className="inline-block px-4 py-2 border border-slate-200 rounded"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            If you believe this is an error, reach out to support at
            <a className="text-sky-600 ml-1" href="mailto:support@hireme.stackzy.tech">
              support@hireme.stackzy.tech
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
