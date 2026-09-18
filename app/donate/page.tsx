"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Mail } from "lucide-react";

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
    <main className="min-h-screen overflow-x-hidden bg-[#F7F2EA] px-5 py-10 text-[#2B170B] sm:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <Image
          src="/images/logo.jpg"
          alt="Gospel Sounders Publications & Missions"
          width={150}
          height={150}
          priority
          className="h-28 w-28 rounded-full object-cover shadow-[0_8px_28px_rgba(47,26,14,0.18)] sm:h-40 sm:w-40"
        />

        <div className="mt-10 flex w-full max-w-3xl items-center justify-center gap-4 sm:gap-8">
          <span className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
          <p className="bg-gradient-to-b from-[#FFE08B] via-[#D9A72F] to-[#A9730A] bg-clip-text text-5xl font-black uppercase leading-none tracking-normal text-transparent sm:text-7xl">
            Support
          </p>
          <span className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
        </div>

        <h1 className="mt-8 max-w-4xl break-words text-4xl font-black leading-tight tracking-normal text-[#2B170B] sm:text-6xl lg:text-7xl">
          Gospel Sounders
          <span className="block">Publications & Missions</span>
        </h1>

        <p className="mt-9 max-w-3xl text-2xl leading-relaxed tracking-normal text-[#625348] sm:text-4xl sm:leading-relaxed">
          Your support helps gospel outreach, media evangelism, Bible studies,
          publications, and mission work continue with care.
        </p>

        <div className="mt-14 text-center">
          <p className="text-3xl font-semibold leading-none text-[#2B170B] sm:text-5xl">
            Donate with
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="relative inline-block h-14 w-16 sm:h-20 sm:w-24"
            >
              <span className="absolute left-0 top-0 text-6xl font-black italic leading-none text-[#003087] sm:text-8xl">
                P
              </span>
              <span className="absolute left-5 top-1 text-6xl font-black italic leading-none text-[#009CDE] sm:left-8 sm:text-8xl">
                P
              </span>
            </span>
            <span className="text-5xl font-black italic leading-none tracking-normal sm:text-7xl">
              <span className="text-[#003087]">Pay</span>
              <span className="text-[#009CDE]">Pal</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={copyEmail}
          className="mt-10 flex w-full max-w-4xl items-center rounded-2xl border border-[#D6D1C9] bg-white px-4 py-4 text-left shadow-[0_12px_28px_rgba(43,23,11,0.14)] transition hover:border-[#BFA46C] focus:outline-none focus:ring-4 focus:ring-[#D9A72F]/25 sm:rounded-3xl sm:px-8 sm:py-6"
          aria-label="Copy PayPal email address"
          title="Copy PayPal email address"
        >
          <Mail className="h-8 w-8 shrink-0 text-[#3F454C] sm:h-11 sm:w-11" />
          <span className="mx-4 min-w-0 flex-1 break-all text-xl font-black leading-snug tracking-normal text-[#2E3136] sm:mx-8 sm:text-4xl">
            {donationEmail}
          </span>
          <span className="mr-3 hidden h-16 w-px shrink-0 bg-[#E1DDD6] sm:block" />
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF0F2] text-[#3F454C] sm:h-16 sm:w-16 sm:rounded-2xl">
            {copied ? (
              <Check className="h-7 w-7 sm:h-9 sm:w-9" />
            ) : (
              <Copy className="h-7 w-7 sm:h-9 sm:w-9" />
            )}
          </span>
        </button>

        <p className="mt-8 max-w-3xl text-2xl leading-tight tracking-normal text-[#4F5358] sm:text-4xl">
          Click to copy this PayPal email address
          <span className="block">and use it to send your donation.</span>
        </p>
      </section>
    </main>
  );
}
