/**
 * ফেজ ০১: Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP
 * টপিক ০২: Node.js মডিউল সিস্টেম: CommonJS বনাম ES Modules
 * 
 * =============================================================================
 * 🌟 সম্পূর্ণ অ্যাপ্লাইড প্রজেক্ট (applied.js)
 * =============================================================================
 * প্রমাণ: 
 * - export default এর ক্ষেত্রে ফাইলে নাম ছিল 'User', কিন্তু আমরা এনেছি 'UserModel' নামে!
 * - আর named export এর ক্ষেত্রে নাম হুবহু মিল রেখে { validateEmail, formatRole } আনতে হয়েছে।
 * 
 * রান করার কমান্ড: node applied.js
 */

// -----------------------------------------------------------------------------
// ধাপ ১ ও ২: Default Export ভিন্ন নামে এবং Named Export ব্র্যাকেটে ইমপোর্ট করা
// -----------------------------------------------------------------------------
// লক্ষ্য করুন: userService.js এ নাম ছিল 'User', কিন্তু ব্র্যাকেট ছাড়া আমরা নাম দিয়েছি 'UserModel'!
import UserModel, { validateEmail, formatRole } from './userService.js';


// -----------------------------------------------------------------------------
// ধাপ ৩: ডাটা টেস্ট ও আউটপুট প্রদর্শন
// -----------------------------------------------------------------------------
console.log(`=======================================================`);
console.log(`[USER PROFILE] (Default Export imported as custom name 'UserModel'):`);
console.log(`=======================================================`);
console.log(`Name: ${UserModel.name}`);
console.log(`Email: ${UserModel.email}`);
console.log(`Valid Email?: ${validateEmail(UserModel.email)}`);
console.log(`User Role (Named Export): ${formatRole(UserModel.role)}`);
console.log(`=======================================================\n`);
