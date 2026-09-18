export default function DonateLoading() {
  return (
    <main className="min-h-screen bg-[#F7F2EA] px-5 py-10 text-[#2B170B] sm:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="h-28 w-28 rounded-full bg-[#D8C9B4] sm:h-40 sm:w-40" />

        <div className="mt-10 flex w-full max-w-3xl items-center gap-4 sm:gap-8">
          <div className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
          <div className="h-12 w-52 rounded-lg bg-[#D9A72F] sm:h-16 sm:w-80" />
          <div className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
        </div>

        <div className="mt-8 w-full max-w-4xl space-y-3">
          <div className="mx-auto h-10 w-full max-w-2xl rounded-lg bg-[#D8C9B4] sm:h-16" />
          <div className="mx-auto h-10 w-11/12 rounded-lg bg-[#D8C9B4] sm:h-16" />
        </div>

        <div className="mt-9 w-full max-w-3xl space-y-3">
          <div className="mx-auto h-7 w-full rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-7 w-5/6 rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-7 w-3/5 rounded-full bg-[#E5D9C9] sm:h-10" />
        </div>

        <div className="mt-14 h-24 w-72 rounded-lg bg-[#D8C9B4] sm:h-32 sm:w-96" />

        <div className="mt-10 flex w-full max-w-4xl items-center rounded-2xl border border-[#D6D1C9] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(43,23,11,0.14)] sm:rounded-3xl sm:px-8 sm:py-6">
          <div className="h-8 w-8 shrink-0 rounded bg-[#D8C9B4] sm:h-11 sm:w-11" />
          <div className="mx-4 h-8 min-w-0 flex-1 rounded-full bg-[#E5D9C9] sm:mx-8 sm:h-12" />
          <div className="h-12 w-12 shrink-0 rounded-xl bg-[#EEF0F2] sm:h-16 sm:w-16 sm:rounded-2xl" />
        </div>

        <div className="mt-8 w-full max-w-3xl space-y-3">
          <div className="mx-auto h-7 w-11/12 rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-7 w-4/5 rounded-full bg-[#E5D9C9] sm:h-10" />
        </div>
      </section>
    </main>
  );
}
