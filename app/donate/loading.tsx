export default function DonateLoading() {
  return (
    <main className="min-h-screen bg-[#F6F1EA] px-5 py-8 text-[#3B2414] sm:px-6 sm:py-12 lg:px-8">
      <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="space-y-5">
          <div className="h-4 w-44 rounded-full bg-[#D8C9B4]" />
          <div className="space-y-3">
            <div className="h-9 w-full max-w-lg rounded-lg bg-[#D8C9B4]" />
            <div className="h-9 w-4/5 rounded-lg bg-[#D8C9B4]" />
            <div className="h-9 w-2/3 rounded-lg bg-[#D8C9B4]" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-full max-w-xl rounded-full bg-[#E5D9C9]" />
            <div className="h-5 w-5/6 rounded-full bg-[#E5D9C9]" />
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center rounded-lg border border-[#D8C9B4] bg-white p-5 shadow-lg sm:p-6 lg:justify-self-end">
          <div className="h-8 w-56 rounded-lg bg-[#D8C9B4]" />
          <div className="mt-4 h-5 w-full rounded-full bg-[#E5D9C9]" />
          <div className="mt-8 h-5 w-36 rounded-full bg-[#D8C9B4]" />
          <div className="mt-3 h-12 rounded-lg border border-[#D8C9B4] bg-[#FBF8F4]" />
          <div className="mt-6 h-12 rounded-lg bg-[#0070BA]" />
        </div>
      </section>
    </main>
  );
}
