import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import BlogCard from "./BlogCard";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

export default async function BlogPage() {
  // Fetch blogs from Firestore
  const snap = await getDocs(
    query(collection(db, "blog"), orderBy("createdAt", "desc"))
  );

  // Map docs to typed Blog objects
  const blogs: Blog[] = snap.docs.map(
    (doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        imageURL: data.imageURL,
        author: data.author ?? "Unknown author",
        createdAt: data.createdAt ?? null,
      };
    }
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Our Blog
      </h1>

      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
