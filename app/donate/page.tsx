"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/*
const paypalEmail = "pondezedd@gmail.com";
const siteUrl = "https://gspublicationsandmissions.org";

export default function DonatePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F1EA] px-5 py-8 text-[#3B2414] sm:px-6 sm:py-12 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl lg:min-h-[calc(100vh-6rem)] lg:items-center">
        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#7A4A24]">
              Secure PayPal Giving
            </p>
            <h1 className="max-w-3xl break-words text-3xl font-black leading-tight text-[#2F1A0E] sm:text-5xl">
              Support Gospel
              <span className="block sm:inline"> Sounders Publications</span>
              <span className="block sm:inline"> & Missions</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5F4632] sm:text-lg sm:leading-8">
              Your support helps gospel outreach, media evangelism, Bible
              studies, publications, and mission work continue with care.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-[#5F4632] sm:grid-cols-3">
            </div>
          </div>

          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            className="w-full min-w-0 max-w-md justify-self-center rounded-lg border border-[#D8C9B4] bg-white p-5 shadow-lg sm:p-6 lg:justify-self-end"
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
              <span className="shrink-0 border-r border-[#D8C9B4] px-3 py-3 font-bold text-[#6B4A2E] sm:px-4">
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
                className="min-w-0 flex-1 px-3 py-3 text-base text-[#2F1A0E] outline-none sm:px-4"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#0070BA] px-4 py-3 text-center text-base font-bold leading-tight text-white transition hover:bg-[#005EA6] focus:outline-none focus:ring-4 focus:ring-[#0070BA]/25"
            >
              Continue to PayPal
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
*/

const donationEmail = "pondezedd@gmail.com";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(donationEmail);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F1EA] px-4 text-[#3B2414]">
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#7A4A24]">
          Support Gospel Sounders
        </p>
        <h1 className="text-3xl font-black leading-tight text-[#2F1A0E] sm:text-5xl">
          Support Gospel Sounders Publications & Missions
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5F4632] sm:text-lg sm:leading-8">
          Your support helps gospel outreach, media evangelism, Bible studies,
          publications, and mission work continue with care.
        </p>

        <p className="mt-8 text-lg font-semibold">Donate to</p>
        <div className="mt-4 flex items-center justify-center gap-3 rounded-lg border border-[#D8C9B4] bg-white px-4 py-3 shadow-sm">
          <span className="break-all text-lg font-bold sm:text-2xl">
            {donationEmail}
          </span>
          <button
            type="button"
            onClick={copyEmail}
            className="shrink-0 rounded-lg bg-[#3B2414] p-3 text-[#F6E3C4] transition hover:bg-[#6B4A2E] focus:outline-none focus:ring-4 focus:ring-[#6B4A2E]/25"
            aria-label="Copy donation email"
            title="Copy email"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </section>
    </main>
  );
}
