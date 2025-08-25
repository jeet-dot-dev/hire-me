export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        We respect your privacy. This is a demo privacy policy page required for
        authentication providers like Google and GitHub.
      </p>
      <p className="mb-4">
        We do not sell or share your personal information with third parties.
        Any data collected will only be used to improve the service.
      </p>
      <p>
        If you have any questions, contact us at{" "}
        <a
          href="mailto:support@example.com"
          className="text-blue-600 underline"
        >
          support@example.com
        </a>
        .
      </p>
    </main>
  );
}
