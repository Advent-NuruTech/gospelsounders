// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F6F1EA] text-[#2A1A10]">
      
      {/* Hero Section */}
      <section className="relative bg-[#3B2414] text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#F6F1EA]">
          Gospel Sounders 
        </h1>
         <h4 className="text-1xl md:text-2xl font-bold mb-4 text-[#F6F1EA]">
     Publications & Missions
        </h4>
        <p className="text-lg md:text-2xl mb-8 text-[#E7D9C4]">
              Revealing the Father and the Son
        </p>
        <Link
          href="/sabbath-school"
          className="inline-block bg-[#C9A24D] text-[#3B2414] font-semibold px-8 py-3 rounded-lg hover:bg-[#B8943F] transition"
        >
          View Sabbath School Lessons
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#3B2414]">
          Explore Our Ministry
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition">
            <h3 className="font-semibold text-xl mb-2 text-[#3B2414]">
              Sabbath School Lessons
            </h3>
            <p className="text-gray-700 mb-4">
              Read, download, and share lessons from past, present, and future quarters.
            </p>
            <Link
              href="/sabbath-school"
              className="font-semibold text-[#5A3A23] hover:text-[#C9A24D]"
            >
              Learn More
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition">
            <h3 className="font-semibold text-xl mb-2 text-[#3B2414]">
              Library
            </h3>
            <p className="text-gray-700 mb-4">
              Access categorized studies on prophecy, health, current events, and more.
            </p>
            <Link
              href="/library"
              className="font-semibold text-[#5A3A23] hover:text-[#C9A24D]"
            >
              Explore Library
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition">
            <h3 className="font-semibold text-xl mb-2 text-[#3B2414]">
              Blog & Updates
            </h3>
            <p className="text-gray-700 mb-4">
              Stay updated with news, articles, and ministry stories.
            </p>
            <Link
              href="/blog"
              className="font-semibold text-[#5A3A23] hover:text-[#C9A24D]"
            >
              Read Blog
            </Link>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-[#EFE6DA] text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#3B2414]">
          Who We Are
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
          Gospel Sounders Ministry is committed to sharing the Word of God, inspiring faith,
          and nurturing spiritual growth through publications and missions.
        </p>
        <Link
          href="/members"
          className="inline-block bg-[#5A3A23] text-[#F6F1EA] font-semibold px-8 py-3 rounded-lg hover:bg-[#3B2414] transition"
        >
          Meet Our Team
        </Link>
      </section>

    </main>
  );
}
