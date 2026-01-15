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

  const pillars = [
    {
      title: "The Personality of God and of His Son",
      content: "We uphold the truth that 'this is life eternal, that they might know thee the only true God, and Jesus Christ, whom thou hast sent' (John 17:3). The Father is the one true God, and Jesus Christ is His only-begotten Son (Proverbs 8:22–30). This truth is a foundation of the faith once delivered to the saints, restoring the knowledge of the Father and the Son to their rightful place in the gospel."
    },
    {
      title: "The Sanctuary",
      content: "We believe Christ entered the Most Holy Place of the heavenly sanctuary in 1844 to begin the final work of atonement and cleansing of the people of God (Daniel 8:14; Hebrews 8:1–2). 'The correct understanding of the ministration in the heavenly sanctuary is the foundation of our faith' (Christ in His Sanctuary, p. 67). Our burden is to show that we are living in the closing work of the great Day of Atonement and that soon every case will be decided for eternity."
    },
    {
      title: "The Non-Immortality of the Soul",
      content: "The Scriptures teach that man is mortal and that in death he sleeps unconsciously until the resurrection (Ecclesiastes 9:5, 10; 1 Thessalonians 4:13–16). 'The theory of the immortality of the soul was one of those false doctrines that Rome borrowed from paganism' (The Great Controversy, p. 549). By exposing the fallacy of natural immortality, we lift the veil of spiritualism and point to the true hope in the resurrection at Christ's coming."
    },
    {
      title: "Righteousness by Faith",
      content: "Salvation is wholly of grace through faith in Jesus Christ (Ephesians 2:8–9). 'The thought that the righteousness of Christ is imputed to us, not because of any merit on our part, but as a free gift from God, is a precious thought' (Faith and Works, p. 24). We uphold the historic 1888 message of Christ's righteousness, the nature of sin, the humanity of Christ, and the victory over sin through His indwelling life."
    },
    {
      title: "The Law of God and the Sabbath",
      content: "God's law is unchangeable and eternal (Psalm 111:7–8; Matthew 5:18). The seventh-day Sabbath remains the seal of God's authority and a sign between Him and His people (Exodus 20:8–11; Ezekiel 20:20). 'The Sabbath will be the great test of loyalty' (The Great Controversy, p. 605)."
    },
    {
      title: "The Spirit of Prophecy",
      content: "We believe the gift of prophecy is the identifying mark of the remnant church (Revelation 12:17; 19:10). The spirit of prophecy provides heaven's instruction, warning, and encouragement for God's people. 'Little heed is given to the Bible, and the Lord has given a lesser light to lead men and women to the greater light' (Colporteur Ministry, p. 125)."
    },
    {
      title: "The Three Angels' Messages of Revelation 14:6-12",
      content: "We proclaim the everlasting gospel in the three angels' messages of Revelation 14:6–12, calling all nations to worship the only true God and His Son, Jesus Christ, and to prepare a people for the soon coming of our Lord."
    }
  ];






  
  return (
    <main className="bg-[#F6F1EA] dark:bg-[#2A1A10] min-h-screen">
      {/* Hero Banner */}
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

      {/* Main Content */}
      <section className="mx-auto px-4 sm:px-6 max-w-7xl py-8 md:py-12 space-y-12 md:space-y-16">
        
        {/* Vision & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Vision Card */}
          <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6 flex items-center gap-3">
              <span className="text-[#C9A24D] dark:text-[#D4B875]"></span>
              Our Vision
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-[#C9A24D] dark:text-[#D4B875] italic leading-tight">
              Revealing the Father and the Son
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6 flex items-center gap-3">
              <span className="text-[#C9A24D] dark:text-[#D4B875]"></span>
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl font-bold text-[#3B2414] dark:text-[#F6F1EA] leading-relaxed">
              Sharing the Truth in a world full of error and truth sounds like treason!
            </p>
            <div className="mt-6 p-4 bg-[#C9A24D]/5 dark:bg-[#3B2414]/20 rounded-lg">
              <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base md:text-lg leading-relaxed">
                To proclaim the everlasting gospel in the three angels' messages of Revelation 14:6–12, calling all nations to worship the only true God and His Son, Jesus Christ, and to prepare a people for the soon coming of our Lord.
              </p>
            </div>
          </div>
        </div>





        {/* About Us Section */}
        <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6 flex items-center gap-3">
            <span className="text-[#C9A24D] dark:text-[#D4B875]">⸻</span>
            About Us
          </h2>
          <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed">
            Gospel Sounders Publications and Missions is dedicated to sounding the solemn warning and invitation of mercy found in the three angels' messages. These messages form the everlasting gospel and constitute the last call of God to a perishing world before the close of probation.
          </p>
        </div>

        {/* Our Pillars of Faith - Highlighted Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-2">
              Our Pillars of Faith
            </h2>
            <div className="h-1 w-24 bg-[#C9A24D] dark:bg-[#D4B875] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-[#C9A24D]/5 to-transparent dark:from-[#3B2414]/10 dark:to-transparent rounded-2xl p-6 border-2 border-[#C9A24D]/20 dark:border-[#3B2414]/30 hover:border-[#C9A24D]/40 dark:hover:border-[#3B2414]/50 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#C9A24D] dark:bg-[#D4B875] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#3B2414] dark:text-[#2A1A10] font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-3 group-hover:text-[#C9A24D] dark:group-hover:text-[#D4B875] transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-sm sm:text-base leading-relaxed">
                      {pillar.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Method of Work */}
        <div className="bg-gradient-to-r from-[#C9A24D]/10 to-[#C9A24D]/5 dark:from-[#3B2414]/20 dark:to-[#3B2414]/10 rounded-2xl p-6 md:p-10 shadow-sm border border-[#C9A24D]/20 dark:border-[#3B2414]/30">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4 md:mb-6">
            Our Method of Work
          </h2>
          <div className="space-y-6">
            <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl leading-relaxed">
              We believe in the heaven-ordained channels of blessing: the Word of God, angelic ministry, and the ministry of consecrated human agencies, through which God sends light and salvation to His people (Hebrews 1:14; 2 Corinthians 4:7). Through publications, missions, Bible studies, and personal labor, we aim to spread the everlasting gospel to every nation, kindred, tongue, and people.
            </p>
            <div className="p-6 bg-[#3B2414]/5 dark:bg-white/5 rounded-lg border-l-4 border-[#C9A24D] dark:border-[#D4B875]">
              <p className="text-[#5A3A23] dark:text-[#D8C9B4] text-base sm:text-lg md:text-xl italic leading-relaxed">
                "There is no line of truth that is more important than the sanctuary question. It is the very message that has made us a separate people, and has given character and power to our work" (Counsels to Writers and Editors, pp. 30–31).
              </p>
            </div>
          </div>
        </div>

        {/* Members Section */}
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
              <div className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 -mx-2 px:2 md:mx-0 md:px-0 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
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

        {/* Contact Section */}
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