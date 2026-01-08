"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

export default function AboutPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Realtime fetch members
  useEffect(() => {
    const membersRef = collection(db, "members");
    const q = query(membersRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
        metadata: doc.data().metadata,
      })) as Member[];
      setMembers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="bg-[#F6F1EA] dark:bg-[#2A1A10] min-h-screen">
      {/* Hero Banner - Fixed header overlap and full-width desktop */}
      <section className="relative w-full h-[280px] sm:h-[320px] md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] pt-0">
        <Image
          src="/images/banner.jpg"
          alt="Ministry Banner"
          fill
          className="object-cover md:object-contain"
          priority
          sizes="100vw"
        />
      </section>

      {/* Main Content - Enhanced desktop layout */}
      <section className="mx-auto px-4 sm:px-6 max-w-7xl py-4 md:py-12 space-y-8 md:space-y-12">
        
        {/* Mission and Logo side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Mission Card - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6">
              Our Mission
            </h2>
            <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed">
              To reveal God and His Son Jesus Christ with <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">clarity and simplicity</span>, unite faith with <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">practical living</span>, and equip believers for <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">holistic, effective ministry</span>. Our ministry emphasizes <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">Bible-based instruction, health reform, and practical lifestyle principles</span> that prepare the believer spiritually, mentally, and physically for service and mission work.
            </p>
          </div>

          {/* Logo - Enhanced for desktop visibility */}
          <div className="flex justify-center lg:justify-end lg:items-center my-4 md:my-0">
            <div className="relative w-90 h-90 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-xl border-6 border-[#C9A24D]/30 dark:border-[#3B2414]/40 bg-white/10 p-4">
              <Image
                src="/images/logo.jpg"
                alt="GS Publications Logo"
                fill
                className="object-contain p-4 md:p-6"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 240px, 288px"
              />
            </div>
          </div>
        </div>

        {/* What We Do - Full width with improved desktop spacing */}
        <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6">
            What We Do
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed">
                We educate and equip believers worldwide through <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">publications, missionary training, lectures, seminars, and digital media</span>. Programs integrate <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">Bible study, character development, health education, and practical living</span> to empower individuals to serve faithfully in gospel outreach and community service.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed">
                Our focus is on preparing <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">self-supporting missionaries</span> who live a disciplined, simple, Christ-centered life, effectively sharing the <span className="font-semibold text-[#C9A24D] dark:text-[#D4B875]">Three Angels' Messages</span> and Bible truths globally.
              </p>
            </div>
          </div>
        </div>

        {/* Members Section - Enhanced for desktop */}
        <div className="pt-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-6 md:mb-8">
            Our Team
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12 md:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A24D] dark:border-[#D4B875]"></div>
            </div>
          ) : members.length > 0 ? (
            <div className="relative">
              <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/members/${member.id}`}
                    className="group relative w-48 h-64 sm:w-56 sm:h-72 md:w-full md:h-80 flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 md:hover:scale-[1.02]"
                  >
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (min-width: 768px) 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B2414]/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-[#F6F1EA] mb-1">{member.name}</h3>
                        <p className="text-sm text-[#D8C9B4] opacity-90">Click to learn more</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <p className="text-lg md:text-xl text-[#5A3A23] dark:text-[#D8C9B4]">
                No members registered yet.
              </p>
            </div>
          )}
        </div>

        {/* Core Values - Enhanced desktop layout */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6">
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Faithful Bible Instruction",
                desc: "Teaching and upholding the Bible as the sole creed and rule of faith."
              },
              {
                title: "Holistic Living",
                desc: "Combining gospel truth with practical health and lifestyle principles."
              },
              {
                title: "Global Mission",
                desc: "Equipping workers worldwide to proclaim Christ's soon return."
              },
              {
                title: "Discipline & Simplicity",
                desc: "Preparing believers to live Christ-centered, self-supporting lives."
              },
              {
                title: "Service & Outreach",
                desc: "Integrating faith with practical action to restore and uplift communities."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-[#C9A24D]/5 dark:bg-[#3B2414]/10 rounded-xl p-5 md:p-6 border border-[#C9A24D]/10 dark:border-[#3B2414]/20 hover:border-[#C9A24D]/30 dark:hover:border-[#3B2414]/40 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C9A24D] dark:bg-[#D4B875] rounded-full flex items-center justify-center mt-1">
                    <span className="text-[#3B2414] dark:text-[#2A1A10] font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-[#3B2414] dark:text-[#F6F1EA] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-sm sm:text-base">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact - Enhanced desktop CTA */}
        <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4">
                Get In Touch
              </h2>
              <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed mb-6">
                For inquiries, partnership, or support, reach out to us. We're here to connect with you.
              </p>
            </div>
            <div>
              <a 
                href="mailto:gspublicationsmissions@gmail.com"
                className="inline-flex items-center justify-center gap-3 bg-[#C9A24D] dark:bg-[#D4B875] text-[#3B2414] dark:text-[#2A1A10] px-8 py-4 rounded-lg font-semibold hover:bg-[#B8923C] dark:hover:bg-[#E5D5A5] transition-all duration-300 shadow-sm hover:shadow-md text-lg w-full md:w-auto text-center"
              >
                <span className="text-2xl">✉️</span>
              gspublicationsmissions@gmail.com
              </a>
              <p className="mt-4 text-center md:text-left text-[#5A3A23]/80 dark:text-[#D8C9B4]/80 text-sm">
                • We respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}