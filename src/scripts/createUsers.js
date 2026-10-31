import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// 🔥 YAHAN APNE COLLEGE KE SAARE EMAILS AUR UNKA ROLE DAALO
const usersToCreate = [
  // Faculty List
  { email: "anjali.sharma@dypiu.ac.in", password: "faculty123", name: "Dr. Anjali Sharma", role: "faculty" },
  { email: "rajesh.verma@dypiu.ac.in", password: "faculty123", name: "Prof. Rajesh Verma", role: "faculty" },
  
  // Student List
  { email: "rahul.kumar@dypiu.ac.in", password: "student123", name: "Rahul Kumar", role: "student" },
  { email: "priya.singh@dypiu.ac.in", password: "student123", name: "Priya Singh", role: "student" },
  // ... aur bhi emails yahan add kar
];

export const bulkCreateUsers = async () => {
  for (const user of usersToCreate) {
    try {
      // 1. Firebase Auth me account banao
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const uid = userCredential.user.uid;

      // 2. Firestore Database me uski details (Role, Name) save karo
      await setDoc(doc(db, "users", uid), {
        name: user.name,
        email: user.email,
        role: user.role,
        uid: uid
      });
      
      console.log(`✅ Created: ${user.email} as ${user.role}`);
    } catch (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message);
    }
  }
  alert("Saare users create ho gaye! Ab is script ko delete kar dena.");
};