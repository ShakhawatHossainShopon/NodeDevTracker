# টপিক ০৪ ল্যাব: URL Path, Query Parameters ও Headers পার্সার

**টপিক ০৪:** Parsing URL Paths, Query Strings & HTTP Request Headers  
**ফেজ ০১:** Node.js ওয়েব ফান্ডামেন্টালস ও নেটিভ HTTP  

---

## 🎯 এই ল্যাবের মূল প্র্যাকটিস:
একটি HTTP সার্ভারে ইনকামিং রিকোয়েস্টের পাথ, কোয়েরি স্ট্রিং এবং রিকোয়েস্ট হেডার পার্স করা:
1. `new URL(req.url, \`http://${req.headers.host}\`)` ব্যবহার করে পূর্ণাঙ্গ URL পার্স করা।
2. `parsedUrl.pathname` দিয়ে রুট পাথ বের করা (যেমন: `/api/search`)।
3. `parsedUrl.searchParams.get('q')` ও `parsedUrl.searchParams.get('limit')` দিয়ে কুয়েরি ডাটা রিড করা।
4. `req.headers` থেকে `user-agent` ও `authorization` হেডার অ্যাক্সেস করা (মনে রাখবেন, নোড.জেএস সব হেডার কী ছোট হাতের অক্ষরে কনভার্ট করে)।
5. টার্মিনালে তথ্য লগ করা (ক্লিন ইংরেজিতে) এবং ক্লায়েন্টে পার্স করা JSON রেসপন্স পাঠানো।

---

## 📁 ফাইল পরিচিতি:

1. **`index.js` (আপনার ব্ল্যাঙ্ক কোডিং ফাইল):**  
   সম্পূর্ণ ফাঁকা ফাইল। আপনি নিজে স্ক্র্যাচ থেকে কোড লিখে সার্ভার রান করুন।
   ```bash
   node index.js
   ```

2. **`applied.js` (সম্পূর্ণ প্রজেক্ট রেফারেন্স):**  
   মাত্র ৪৫ লাইনের পরিচ্ছন্ন ও প্রস্তুত কোড।
   ```bash
   node applied.js
   ```

---

## 🧪 টেস্ট করার উপায়:
ব্রাউজারে বা কার্ল (cURL) দিয়ে টেস্ট করুন:
```bash
http://localhost:3000/api/search?q=laptop&limit=5
```

প্র্যাকটিস শেষ হলে চ্যাটে বলুন: **"I am done"**!
