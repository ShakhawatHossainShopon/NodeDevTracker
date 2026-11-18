# টপিক ০৫ ল্যাব: টার্মিনাল ক্লাসরুম — HTTP POST ও স্ট্রিমিং JSON

**টপিক ০৫:** Processing HTTP POST/PUT Bodies & Streaming JSON Payloads  
**ফেজ ০১:** Node.js Web Fundamentals  

---

## 🎯 ল্যাব কনসেপ্ট ও নতুন লার্নিং স্টাইল:
এখানে আপনার আলাদা করে `index.js`-এ কোড লেখার প্রয়োজন নেই। `applied.js`-কে একটি **ইন্টারঅ্যাক্টিভ টার্মিনাল ক্লাসরুম** হিসেবে তৈরি করা হয়েছে, যাতে আপনি নিজে বিভিন্ন টেস্ট রিকোয়েস্ট পাঠিয়ে টার্মিনালের লাইভ ট্রেস দেখে পুরো সিস্টেমের ভেতরের কার্যকলাপ বুঝতে পারেন।

---

## 🚀 কীভাবে প্র্যাকটিস করবেন:

### ১. টার্মিনাল ১ (সার্ভার রান করুন):
```bash
node applied.js
```
সার্ভার চালু হওয়া মাত্রই টার্মিনালে ৫টি প্রস্তুত টেস্ট কমান্ড দেখতে পাবেন।

### ২. টার্মিনাল ২ (টেস্ট কমান্ড রান করুন):
সার্ভার চালু রেখে নতুন আরেকটি PowerShell খুলে নিচের কমান্ডগুলো একে একে চালিয়ে দেখুন:

#### টেস্ট ১: সঠিক JSON পাঠিয়ে ইউজার তৈরি করা (201 Created)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -ContentType "application/json" -Body '{"name":"Rahim Ahmed", "email":"rahim@example.com"}'
```
*টার্মিনাল ১-এ লক্ষ্য করুন:* কীভাবে `req.on('data')` চাঙ্ক রিসিভ করল, `req.on('end')` এ বাফার মার্জ হলো, JSON পার্স হলো এবং 201 রেসপন্স গেল।

#### টেস্ট ২: তৈরি হওয়া সব ইউজার দেখা (200 OK)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get
```

#### টেস্ট ৩: ইমেইল ছাড়া রিকোয়েস্ট পাঠানো (ভ্যালিডেশন ফেইল - 400 Bad Request)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -ContentType "application/json" -Body '{"name":"Only Name Without Email"}'
```
*টার্মিনাল ১-এ লক্ষ্য করুন:* ভ্যালিডেশন ফেইল হওয়ার লগ ও 400 রেসপন্স।

#### টেস্ট ৪: ভুল/ভাঙা JSON পাঠানো (সিনট্যাক্স এরর - 400 Bad Request)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -ContentType "application/json" -Body '{"name": "Broken JSON missing bracket'
```
*টার্মিনাল ১-এ লক্ষ্য করুন:* `try...catch` কীভাবে এররটি ধরে সার্ভার ক্র্যাশ হওয়া থেকে বাঁচাল।

#### টেস্ট ৫: ভুল পাথে রিকোয়েস্ট (404 Not Found)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/unknown" -Method Get
```

---

সবগুলো টেস্ট ঘেঁটে বোঝা শেষ হলে চ্যাটে বলুন: **"I am done"**!
