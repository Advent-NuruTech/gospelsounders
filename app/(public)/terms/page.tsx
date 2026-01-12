"use client";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16] px-6 py-12">
      <section className="max-w-6xl mx-auto space-y-12">

        {/* Title */}
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#F6F1EA]">
            Terms of Use
          </h1>
          <p className="text-lg text-gray-700 dark:text-[#D8C9B4] max-w-3xl mx-auto md:mx-0">
            Welcome to Gospel Sounders Publications and Missions. By accessing our website, digital resources, or services, you agree to these Terms of Use. If you do not agree, please discontinue use immediately.
          </p>
        </header>

        {/* Sections */}
        {[
          {
            title: "1. Acceptance of Terms",
            content: "By using our website, publications, or services, you acknowledge that you have read, understood, and agree to abide by our Terms. These Terms apply to all visitors, users, and others who access our Platform. IF YOU DO NOT AGREE, DO NOT USE THE SITE."
          },
          {
            title: "2. Definitions",
            list: [
              "<strong>We/Us/Our</strong> refers to Gospel Sounders Publications and Missions and its affiliated platforms, staff, volunteers, and contributors.",
              "<strong>Platform</strong> refers to our website, mobile apps, digital resources, social channels, and communication tools.",
              "<strong>Content</strong> includes all text, audio, video, images, documents, lessons, studies, teachings, software, and downloadable materials.",
              "<strong>User</strong> means any individual accessing or interacting with our Platform.",
              "<strong>User Content</strong> refers to any information submitted by users, including forms, messages, comments, uploads, or other contributions."
            ]
          },
          {
            title: "3. Purpose of Our Content",
            content: "Our content is provided for spiritual, educational, historical, and informational purposes. It reflects our sincerely held biblical beliefs and theological positions. Content is not intended as legal, medical, psychological, or professional advice."
          },
          {
            title: "4. Spiritual Guidance & Responsibility",
            content: "We present Bible-based teachings according to conscience and conviction. Users are encouraged to study, discern, and apply teachings responsibly. Agreement with our content is not required for access."
          },
          {
            title: "5. Intellectual Property",
            content: "All original content created by us is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or commercially use our content without express written permission. Private, non-commercial, educational use with proper attribution is allowed."
          },
          {
            title: "6. User Conduct",
            list: [
              "Use our Platform lawfully and respectfully.",
              "Do not harass, deceive, impersonate, or abuse others.",
              "Do not introduce malware or attempt unauthorized access.",
              "Do not misuse our communications or services for personal gain."
            ]
          },
          {
            title: "7. User-Submitted Content",
            content: "By submitting content to us, you grant us a non-exclusive, royalty-free right to use, store, and display such content for ministry-related purposes. We reserve the right to remove content that is inappropriate, misleading, or harmful."
          },
          {
            title: "8. Automated & AI-Assisted Services",
            content: "Some services may use automated or AI-assisted tools. These are provided to support users and do not replace personal study, human discernment, or spiritual judgment."
          },
          {
            title: "9. Donations",
            content: "Donations are voluntary and used to support our ministry operations. Donations are generally non-refundable. We do not guarantee specific results from your contributions."
          },
          {
            title: "10. External Links",
            content: "Our Platform may include links to third-party sites. We do not control external content and are not responsible for their accuracy, privacy practices, or services."
          },
          {
            title: "11. Limitation of Liability",
            content: "To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform or reliance on content."
          },
          {
            title: "12. Indemnification",
            content: "You agree to indemnify and hold harmless our Ministry, staff, volunteers, and affiliates from claims, losses, or liabilities resulting from misuse of the Platform or violation of these Terms."
          },
          {
            title: "13. Changes to Terms",
            content: "We may update these Terms at any time. Continued use of our Platform constitutes acceptance of revised Terms."
          },
          {
            title: "14. Governing Law",
            content: "These Terms are governed by applicable laws without regard to conflict of law principles."
          },
          {
            title: "15. Contact",
            content: "For questions regarding these Terms, contact us at: <br /><strong>gspublicationsmissions@gmail.com</strong>"
          }
        ].map((section, idx) => (
          <section key={idx} className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">{section.title}</h2>
            {section.content && (
              <p className="text-gray-700 dark:text-[#D8C9B4]" dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
            {section.list && (
              <ul className="list-disc pl-6 text-gray-700 dark:text-[#D8C9B4] space-y-1" dangerouslySetInnerHTML={{ __html: section.list.map(item => `<li>${item}</li>`).join("") }} />
            )}
          </section>
        ))}

      </section>
    </main>
  );
}
