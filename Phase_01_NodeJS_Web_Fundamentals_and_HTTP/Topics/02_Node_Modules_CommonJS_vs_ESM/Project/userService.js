/**
 * 📦 userService.js
 *
 * ১. একাধিক Named Export (খালি export): এগুলোর নাম ইমপোর্টে হুবহু মিলতে হবে।
 * ২. একটিমাত্র Default Export (export default): এটিকে যেকোনো নামে ইমপোর্ট করা যাবে।
 */

// ১. Named Exports (কার্লি ব্র্যাকেট { } দিয়ে নির্দিষ্ট নামে আনতে হবে)
export function validateEmail(email) {
  return email.includes("@") && email.includes(".");
}

export function formatRole(role) {
  return role.toUpperCase();
}

// ২. Default Export (ফাইলে কেবল ১টিই থাকে, ব্র্যাকেট ছাড়া যেকোনো নামে আনা যায়)
const hello = {
  id: 101,
  name: "Tanvir Ahmed",
  email: "tanvir@example.com",
  role: "admin",
};

export default hello;
