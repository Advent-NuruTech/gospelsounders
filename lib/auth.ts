// /lib/auth.ts
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User data not found");

  const userData = userDoc.data() as { role: string; email: string };
  return { uid, email: userCredential.user.email, role: userData.role };
};

export const logout = async () => {
  await signOut(auth);
};
