"use client";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16] px-6 py-12">
      <section className="max-w-5xl mx-auto space-y-12">

        {/* Title */}
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#F6F1EA]">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 dark:text-[#D8C9B4] max-w-3xl mx-auto md:mx-0">
            Gospel Sounders Publications and Missions is committed to respecting your privacy and handling information responsibly.
          </p>
        </header>

        {/* Information We Do Not Collect */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Information We Do Not Collect</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            Our services are designed to function without collecting personal identification data by default. Unlike many websites, we do not intentionally collect or store IP addresses, behavioral tracking data, or personal profiling information for visitors who simply browse our platform.
          </p>
        </section>

        {/* Voluntary Information */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Voluntarily Provided Information</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            In certain situations, you may choose to provide limited personal information voluntarily. This may include your email address when:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-[#D8C9B4] space-y-1">
            <li>Submitting a prayer request</li>
            <li>Contacting us via email</li>
            <li>Requesting communication or follow-up</li>
          </ul>
          <p className="text-gray-700 dark:text-[#D8C9B4] mt-2">
            Providing such information is optional and entirely at your discretion. We use this information only for the purpose for which it was provided, such as responding to your message or request.
          </p>
        </section>

        {/* Donations */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Donations and Payments</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            We use PayPal to process donations. The Ministry does not receive, store, or process your payment card details. Any payment information, including email address and transaction data, is handled directly by PayPal and is subject to PayPal’s own privacy policies.
          </p>
          <p className="text-gray-700 dark:text-[#D8C9B4] mt-2">
            You can review PayPal’s Privacy Policy at: <br />
            <a 
              href="https://www.paypal.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-yellow-500 dark:text-yellow-400 hover:underline"
            >
              https://www.paypal.com/privacy
            </a>
          </p>
        </section>

        {/* How Information is Used */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">How Information Is Used</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            Any information you voluntarily provide is used solely to fulfill ministry-related communication and is not sold, traded, or shared for commercial purposes.
          </p>
        </section>

        {/* Data Security */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Data Security</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            We take reasonable measures to protect any information you choose to share with us. However, no method of electronic communication is entirely free from risk, and users acknowledge this inherent limitation.
          </p>
        </section>

        {/* Policy Changes */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Changes to This Policy</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            We may make minor, non-material updates to this Privacy Policy from time to time, with or without notice. Users are encouraged to review this page periodically to remain informed.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#F6F1EA]">Contact Us</h2>
          <p className="text-gray-700 dark:text-[#D8C9B4]">
            If you have questions regarding this Privacy Policy, you may contact us at: <br />
            <strong>gspublicationsmissions@gmail.com</strong>
          </p>
        </section>

      </section>
    </main>
  );
}
