const paypalEmail = "pondezedd@gmail.com";
const siteUrl = "https://gspublicationsandmissions.org";

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-[#F6F1EA] px-4 py-12 text-[#3B2414] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#7A4A24]">
              Secure PayPal Giving
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#2F1A0E] sm:text-5xl">
              Support Gospel Sounders Publications & Missions
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5F4632]">
              Your support helps gospel outreach, media evangelism, Bible
              studies, publications, and mission work continue with care.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-[#5F4632] sm:grid-cols-3">
              <div className="border-l-4 border-[#7A4A24] bg-white/70 p-4">
                Checkout is completed on PayPal&apos;s secure website.
              </div>
              <div className="border-l-4 border-[#7A4A24] bg-white/70 p-4">
                Donations are sent to the ministry PayPal account email.
              </div>
              <div className="border-l-4 border-[#7A4A24] bg-white/70 p-4">
                USD is used because it is supported for PayPal payments.
              </div>
            </div>
          </div>

          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            className="rounded-lg border border-[#D8C9B4] bg-white p-6 shadow-lg"
          >
            <input type="hidden" name="cmd" value="_donations" />
            <input type="hidden" name="business" value={paypalEmail} />
            <input
              type="hidden"
              name="item_name"
              value="Gospel Sounders Publications & Missions donation"
            />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="no_shipping" value="1" />
            <input type="hidden" name="no_note" value="0" />
            <input type="hidden" name="return" value={`${siteUrl}/donate?status=thank-you`} />
            <input type="hidden" name="cancel_return" value={`${siteUrl}/donate?status=cancelled`} />
            <input type="hidden" name="bn" value="PP-DonationsBF" />

            <h2 className="text-2xl font-bold text-[#2F1A0E]">
              Donate with PayPal
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B4A2E]">
              Enter any amount in USD, then continue to PayPal to finish
              securely.
            </p>

            <label htmlFor="amount" className="mt-6 block text-sm font-semibold">
              Donation amount
            </label>
            <div className="mt-2 flex items-center overflow-hidden rounded-lg border border-[#D8C9B4] bg-white focus-within:border-[#7A4A24]">
              <span className="border-r border-[#D8C9B4] px-4 py-3 font-bold text-[#6B4A2E]">
                USD
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                inputMode="decimal"
                placeholder="25.00"
                required
                className="min-w-0 flex-1 px-4 py-3 text-base text-[#2F1A0E] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#0070BA] px-6 py-4 text-base font-bold text-white transition hover:bg-[#005EA6] focus:outline-none focus:ring-4 focus:ring-[#0070BA]/25"
            >
              Continue to PayPal
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#6B4A2E]">
              This is a personal PayPal account donation, not a tax receipt.
              PayPal may charge processing or currency conversion fees.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
