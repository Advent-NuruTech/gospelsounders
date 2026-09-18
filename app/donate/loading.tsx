export default function DonateLoading() {
  return (
    <main className="min-h-[100svh] bg-[#F7F2EA] px-3 py-3 text-[#2B170B] sm:px-8 sm:py-8 lg:py-10">
      <section className="mx-auto flex min-h-[calc(100svh-1.5rem)] w-full max-w-4xl flex-col items-center sm:min-h-0">
        <div className="h-20 w-20 rounded-full bg-[#D8C9B4] sm:h-32 sm:w-32 lg:h-40 lg:w-40" />

        <div className="mt-5 flex w-full max-w-3xl items-center gap-3 sm:mt-10 sm:gap-8">
          <div className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
          <div className="h-9 w-40 rounded-lg bg-[#D9A72F] sm:h-16 sm:w-80" />
          <div className="h-0.5 min-w-0 flex-1 bg-[#D9A72F]" />
        </div>

        <div className="mt-4 w-full max-w-4xl space-y-2 sm:mt-7 sm:space-y-3">
          <div className="mx-auto h-8 w-full max-w-2xl rounded-lg bg-[#D8C9B4] sm:h-16" />
          <div className="mx-auto h-8 w-11/12 rounded-lg bg-[#D8C9B4] sm:h-16" />
        </div>

        <div className="mt-4 w-full max-w-3xl space-y-2 sm:mt-8 sm:space-y-3">
          <div className="mx-auto h-5 w-full rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-5 w-5/6 rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-5 w-3/5 rounded-full bg-[#E5D9C9] sm:h-10" />
        </div>

        <div className="mt-5 h-16 w-52 rounded-lg bg-[#D8C9B4] sm:mt-12 sm:h-32 sm:w-96" />

        <div className="mt-4 flex w-full max-w-4xl items-center rounded-xl border border-[#D6D1C9] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(43,23,11,0.14)] sm:mt-8 sm:rounded-3xl sm:px-8 sm:py-6 sm:shadow-[0_12px_28px_rgba(43,23,11,0.14)]">
          <div className="h-6 w-6 shrink-0 rounded bg-[#D8C9B4] sm:h-11 sm:w-11" />
          <div className="mx-3 h-6 min-w-0 flex-1 rounded-full bg-[#E5D9C9] sm:mx-8 sm:h-12" />
          <div className="h-10 w-10 shrink-0 rounded-lg bg-[#EEF0F2] sm:h-16 sm:w-16 sm:rounded-2xl" />
        </div>

        <div className="mt-3 w-full max-w-3xl space-y-2 sm:mt-7 sm:space-y-3">
          <div className="mx-auto h-4 w-11/12 rounded-full bg-[#E5D9C9] sm:h-10" />
          <div className="mx-auto h-4 w-4/5 rounded-full bg-[#E5D9C9] sm:h-10" />
        </div>

        <div className="mt-3 h-8 w-44 rounded-full bg-white/75 sm:mt-7" />
      </section>
    </main>
  );
}
