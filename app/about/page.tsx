// app/about/page.tsx
import Image from "next/image";

export default function AboutPage() {
  const members = [
    {
      name: "Pastor John Doe",
      role: "Senior Pastor",
      bio: "Leading the ministry with vision and dedication for over 15 years.",
      image: "/images/members/john-doe.jpg",
    },
    {
      name: "Sister Mary Smith",
      role: "Bible Teacher",
      bio: "Passionate about Sabbath School lessons and Bible study programs.",
      image: "/images/members/wyclife.jpg",
    },
    {
      name: "Brother Paul Otieno",
      role: "Health & Wellness Coordinator",
      bio: "Promoting healthful living in alignment with biblical principles.",
      image: "/images/members/zadock.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">About Gospel Sounders Ministry</h1>

      <p className="max-w-3xl mx-auto text-gray-700 text-center mb-12">
        Our ministry is dedicated to spreading the Word of God, providing educational resources, and nurturing spiritual growth in our community. Meet our dedicated team below.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {members.map((member) => (
          <div key={member.name} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
            <div className="relative h-64 w-full">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-blue-900 font-medium">{member.role}</p>
              <p className="text-gray-700 mt-2">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
