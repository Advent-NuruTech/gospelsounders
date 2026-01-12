"use client";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F6F1EA] dark:bg-[#2A1A10] min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-14 space-y-12">

        {/* Title */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA]">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#5A3A23] dark:text-[#D8C9B4]">
            Gospel Sounders Publications and Missions is committed to respecting
            your privacy and handling information responsibly.
          </p>
        </header>

        {/* Information We Do Not Collect */}
        <section>
          <h2 className="section-title">Information We Do Not Collect</h2>
          <p className="section-text">
            Our services are designed to function without collecting personal
            identification data by default. Unlike many websites, we do not
            intentionally collect or store IP addresses, behavioral tracking data,
            or personal profiling information for visitors who simply browse
            our platform.
          </p>
        </section>

        {/* Voluntary Information */}
        <section>
          <h2 className="section-title">Voluntarily Provided Information</h2>
          <p className="section-text">
            In certain situations, you may choose to provide limited personal
            information voluntarily. This may include your email address when:
          </p>
          <ul className="list-disc pl-6 section-text space-y-2">
            <li>Submitting a prayer request</li>
            <li>Contacting us via email</li>
            <li>Requesting communication or follow-up</li>
          </ul>
          <p className="section-text mt-4">
            Providing such information is optional and entirely at your discretion.
            We use this information only for the purpose for which it was provided,
            such as responding to your message or request.
          </p>
        </section>

        {/* Donations */}
        <section>
          <h2 className="section-title">Donations and Payments</h2>
          <p className="section-text">
            We use PayPal to process donations. The Ministry does not receive,
            store, or process your payment card details. Any payment information,
            including email address and transaction data, is handled directly
            by PayPal and is subject to PayPal’s own privacy policies.
          </p>
       <p className="section-text mt-2">
  You can review PayPal’s Privacy Policy at:
  <br />
  <a 
    href="https://www.paypal.com/privacy" 
    target="_blank" 
    rel="noopener noreferrer"
    className="font-semibold text-[#C9A24D] dark:text-[#D4B875] hover:underline"
  >
    https://www.paypal.com/privacy
  </a>
</p>

        </section>

        {/* Data Use */}
        <section>
          <h2 className="section-title">How Information Is Used</h2>
          <p className="section-text">
            Any information you voluntarily provide is used solely to fulfill
            ministry-related communication and is not sold, traded, or shared
            for commercial purposes.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="section-title">Data Security</h2>
          <p className="section-text">
            We take reasonable measures to protect any information you choose
            to share with us. However, no method of electronic communication
            is entirely free from risk, and users acknowledge this inherent limitation.
          </p>
        </section>

        {/* Policy Changes */}
        <section>
          <h2 className="section-title">Changes to This Policy</h2>
          <p className="section-text">
            We may make minor, non-material updates to this Privacy Policy
            from time to time, with or without notice. Users are encouraged
            to review this page periodically to remain informed.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">
            If you have questions regarding this Privacy Policy, you may contact us at:
            <br />
            <strong>gspublicationsmissions@gmail.com</strong>
          </p>
        </section>

      </section>
    </main>
  );
}
