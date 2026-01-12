"use client";

export default function CookiesPolicyPage() {
  return (
    <main className="bg-[#F6F1EA] dark:bg-[#2A1A10] min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA]">
          Cookies Policy
        </h1>

        <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-lg">
          This Cookies Policy explains how Gospel Sounders Publications and Missions
          uses cookies to enhance your experience.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="section-title">What Are Cookies</h2>
            <p className="section-text">
              Cookies are small text files stored on your device to help websites
              function efficiently and remember preferences.
            </p>
          </section>

          <section>
            <h2 className="section-title">How We Use Cookies</h2>
            <ul className="list-disc pl-6 section-text space-y-2">
              <li>Improve site performance</li>
              <li>Understand visitor interactions</li>
              <li>Maintain secure and reliable services</li>
            </ul>
          </section>

          <section>
            <h2 className="section-title">Managing Cookies</h2>
            <p className="section-text">
              You can control or disable cookies through your browser settings.
              Disabling cookies may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="section-title">Policy Updates</h2>
            <p className="section-text">
              This policy may be updated as technology or regulations change.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
