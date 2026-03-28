// supabase/seed-v2.mjs — Massive seed: 100+ pujas, 1000+ products, 25 pandits, 40 testimonials
// Run: node supabase/seed-v2.mjs
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const sb = createClient(url, key);

async function upsertBatch(table, rows, batchSize = 50) {
  let ok = true;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await sb.from(table).upsert(batch, { onConflict: 'id' });
    if (error) { console.error(`✗ ${table} [batch ${i}]:`, error.message); ok = false; }
  }
  if (ok) console.log(`✓ ${table}: ${rows.length} rows`);
  return ok;
}

// ════════════════════════════════════════════
// HELPER GENERATORS
// ════════════════════════════════════════════

function slug(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { const s = [...arr].sort(() => Math.random() - 0.5); return s.slice(0, Math.min(n, s.length)); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function price(base) { return Math.round(base / 100) * 100; }

// ════════════════════════════════════════════
// CATEGORIES (same 10)
// ════════════════════════════════════════════
const categories = [
  { id:"mahayagya", title:"Mahayagya & Katha", slug:"mahayagya-katha", description:"Grand multi-day spiritual events — Bhagwat Katha, Ram Katha, Sundarkand, and massive yagyas for deep karmic purification.", icon:"fire", image:"/assets/categories/mahayagya.jpg", featured:true, sort_order:1 },
  { id:"samskara", title:"Vedic Samskaras", slug:"vedic-samskaras", description:"Sacred life-milestone ceremonies — Vivah, Namkaran, Mundan, Upanayana, Annaprashan — performed with full Vedic precision.", icon:"flower", image:"/assets/categories/samskara.jpg", featured:true, sort_order:2 },
  { id:"regular", title:"Regular Pujas", slug:"regular-pujas", description:"Household pujas for everyday occasions — Satyanarayan, Griha Pravesh, Rudrabhishek, Ganesh Puja, and more.", icon:"pray", image:"/assets/categories/regular.jpg", featured:true, sort_order:3 },
  { id:"astrological", title:"Navagraha & Dosh Nivaran", slug:"navagraha-dosh-nivaran", description:"Planetary appeasement and dosh removal — Mangal Dosh, Kaal Sarp Dosh, Shani Shanti, Rahu-Ketu, and all 9 planets.", icon:"star", image:"/assets/categories/astrological.jpg", featured:true, sort_order:4 },
  { id:"prosperity", title:"Lakshmi & Prosperity", slug:"lakshmi-prosperity", description:"Wealth and abundance rituals — Lakshmi Puja, Kuber Puja, Sri Sukta Havan, and business-growth pujas.", icon:"lotus", image:"/assets/categories/prosperity.jpg", featured:true, sort_order:5 },
  { id:"health", title:"Health & Protection", slug:"health-protection", description:"Pujas for healing, longevity, and divine protection — Maha Mrityunjaya, Dhanvantari, Sudarshan Havan, and Kavach pujas.", icon:"shield", image:"/assets/categories/health.jpg", featured:false, sort_order:6 },
  { id:"shanti", title:"Shanti & Peace", slug:"shanti-peace", description:"Pujas to restore harmony — Nakshatra Shanti, Bhoomi Puja, Graha Shanti, and Sarva Karya Siddhi rituals.", icon:"peace", image:"/assets/categories/shanti.jpg", featured:false, sort_order:7 },
  { id:"festival", title:"Festival Pujas", slug:"festival-pujas", description:"Celebrate festivals with authentic rituals — Navratri, Ganesh Chaturthi, Shivratri, Janmashtami, and more.", icon:"calendar", image:"/assets/categories/festival.jpg", featured:true, sort_order:8 },
  { id:"pitru", title:"Ancestral & Pitru Karma", slug:"ancestral-pitru", description:"Sacred rites for ancestors — Pind Daan, Shraddh, Narayan Bali, Tarpan, and Asthi Visarjan for ancestral peace.", icon:"ancestry", image:"/assets/categories/pitru.jpg", featured:false, sort_order:9 },
  { id:"tantra", title:"Tantra & Shakti Pujas", slug:"tantra-shakti", description:"Powerful Tantrik pujas — Baglamukhi, Kali, Bhairav, and Das Mahavidya pujas for protection and victory.", icon:"trident", image:"/assets/categories/tantra.jpg", featured:false, sort_order:10 },
];

// ════════════════════════════════════════════
// 25 PANDITS
// ════════════════════════════════════════════
const pandits = [
  { id:"p1", name:"Acharya Veda Prakash Shastri", slug:"acharya-veda-prakash", title:"Vedic Scholar & Katha Vyas", experience:25, experience_label:"25+ Years", expertise:["Bhagwat Katha","Ram Katha","Sundarkand","Rudrabhishek","Mahayagya"], specializations:["mahayagya","regular"], languages:["Hindi","Sanskrit","English"], rating:4.9, reviews:320, completed_pujas:2800, location:"Varanasi, UP", available:true, featured:true, image_url:"/assets/pandits/p1.jpg", bio:"A renowned scholar of the Vedas with immense expertise in conducting grand yagyas and reciting Srimad Bhagwat.", certifications:["Shastri (Sampurnanand Sanskrit University)","Acharya in Vedic Studies"] },
  { id:"p2", name:"Shastri Rajendra Tiwari", slug:"shastri-rajendra-tiwari", title:"Karmakand Specialist", experience:15, experience_label:"15+ Years", expertise:["Griha Pravesh","Satyanarayan Katha","Vivah","Namkaran","Lakshmi Puja"], specializations:["regular","samskara","prosperity"], languages:["Hindi","Sanskrit","Bhojpuri"], rating:4.8, reviews:180, completed_pujas:1500, location:"Prayagraj, UP", available:true, featured:true, image_url:"/assets/pandits/p2.jpg", bio:"Specializes in household pujas, samskaras, and prosperity rituals.", certifications:["Shastri (Allahabad University)","Karmakand Visharad"] },
  { id:"p3", name:"Pandit Ramakant Sharma", slug:"pandit-ramakant-sharma", title:"Jyotish & Vastu Expert", experience:20, experience_label:"20+ Years", expertise:["Navagraha Shanti","Kaal Sarp Dosh","Vastu Shanti","Kundali Milan","Graha Shanti"], specializations:["astrological","shanti"], languages:["Hindi","English"], rating:4.7, reviews:150, completed_pujas:1200, location:"Ujjain, MP", available:true, featured:true, image_url:"/assets/pandits/p3.jpg", bio:"Provides astrological guidance and performs precise dosh shanti pujas based on birth charts.", certifications:["Jyotish Acharya (Vikram University)","Vastu Consultant"] },
  { id:"p4", name:"Acharya Suresh Dwivedi", slug:"acharya-suresh-dwivedi", title:"Katha Vachak & Havan Specialist", experience:18, experience_label:"18+ Years", expertise:["Bhagwat Katha","Sundarkand","Rudrabhishek","Ram Katha","Shiv Mahapuran"], specializations:["mahayagya","regular","festival"], languages:["Hindi","Sanskrit","Marathi"], rating:4.8, reviews:210, completed_pujas:1900, location:"Nashik, MH", available:true, featured:false, image_url:"/assets/pandits/p4.jpg", bio:"An engaging Katha Vachak who brings scriptures to life with storytelling.", certifications:["Acharya (Rashtriya Sanskrit Sansthan)","Vedic Ritual Expert"] },
  { id:"p5", name:"Pandit Manoj Mishra", slug:"pandit-manoj-mishra", title:"Vivah & Samskara Specialist", experience:12, experience_label:"12+ Years", expertise:["Vivah","Namkaran","Mundan","Upanayana","Lakshmi Puja","Annaprashan"], specializations:["samskara","prosperity"], languages:["Hindi","Sanskrit","English","Gujarati"], rating:4.8, reviews:160, completed_pujas:1100, location:"Ahmedabad, GJ", available:true, featured:false, image_url:"/assets/pandits/p5.jpg", bio:"Specializes in wedding ceremonies and life-event samskaras.", certifications:["Shastri (Gujarat Vidyapith)","Samskara Karmakand Diploma"] },
  { id:"p6", name:"Acharya Dinesh Joshi", slug:"acharya-dinesh-joshi", title:"Tantrik & Dosh Nivaran Expert", experience:22, experience_label:"22+ Years", expertise:["Kaal Sarp Dosh","Navagraha Shanti","Pitra Dosh","Mangal Dosh","Baglamukhi","Kali Puja"], specializations:["astrological","tantra","pitru"], languages:["Hindi","Sanskrit"], rating:4.7, reviews:130, completed_pujas:950, location:"Haridwar, UK", available:true, featured:false, image_url:"/assets/pandits/p6.jpg", bio:"A deeply knowledgeable Tantrik Acharya specializing in dosh nivaran and Shakti pujas.", certifications:["Tantra Shastra Acharya","Jyotish Ratna"] },
  { id:"p7", name:"Pandit Hari Om Shukla", slug:"pandit-hari-om-shukla", title:"Pitru Karma & Shraddh Specialist", experience:28, experience_label:"28+ Years", expertise:["Pind Daan","Shraddh","Narayan Bali","Pitru Tarpan","Asthi Visarjan","Garud Puran"], specializations:["pitru","mahayagya"], languages:["Hindi","Sanskrit"], rating:4.9, reviews:175, completed_pujas:2200, location:"Gaya, Bihar", available:true, featured:true, image_url:"/assets/pandits/p7.jpg", bio:"One of the most experienced Pind Daan and Shraddh karma specialists in Gaya.", certifications:["Shastri (Magadh University)","Pitru Karma Visharad"] },
  { id:"p8", name:"Acharya Krishnanand Tripathi", slug:"acharya-krishnanand-tripathi", title:"Navratri & Shakti Upasak", experience:20, experience_label:"20+ Years", expertise:["Navratri Puja","Durga Saptashati","Durga Puja","Kali Puja","Chamunda Puja","Devi Bhagwat"], specializations:["festival","tantra","mahayagya"], languages:["Hindi","Sanskrit","Bengali"], rating:4.8, reviews:195, completed_pujas:1600, location:"Kolkata, WB", available:true, featured:false, image_url:"/assets/pandits/p8.jpg", bio:"A devoted Shakti Upasak and Navratri specialist.", certifications:["Tantra Vidya (Kamakhya)","Acharya in Shakti Upasana"] },
  { id:"p9", name:"Pandit Govind Prasad Upadhyay", slug:"pandit-govind-prasad", title:"Ganesh & Festival Puja Expert", experience:14, experience_label:"14+ Years", expertise:["Ganesh Puja","Ganesh Chaturthi","Saraswati Puja","Basant Panchami","Tulsi Vivah","Surya Puja"], specializations:["regular","festival"], languages:["Hindi","Sanskrit","Marathi","English"], rating:4.7, reviews:140, completed_pujas:980, location:"Pune, MH", available:true, featured:false, image_url:"/assets/pandits/p9.jpg", bio:"A Ganesh bhakt and festival puja specialist.", certifications:["Shastri (Tilak Maharashtra Vidyapeeth)","Karmakand Certificate"] },
  { id:"p10", name:"Acharya Raghunath Dixit", slug:"acharya-raghunath-dixit", title:"Shanti Karma & Nakshatra Expert", experience:24, experience_label:"24+ Years", expertise:["Nakshatra Shanti","Bhoomi Puja","Shanti Path","Graha Shanti","Sarva Karya Siddhi"], specializations:["shanti","astrological"], languages:["Hindi","Sanskrit","English"], rating:4.8, reviews:165, completed_pujas:1400, location:"Indore, MP", available:true, featured:false, image_url:"/assets/pandits/p10.jpg", bio:"A specialist in Shanti Karma and nakshatra-based rituals.", certifications:["Jyotish Visharad","Shanti Karma Diploma (Ujjain)"] },
  { id:"p11", name:"Pandit Arvind Chaturvedi", slug:"pandit-arvind-chaturvedi", title:"Health & Mrityunjaya Specialist", experience:16, experience_label:"16+ Years", expertise:["Maha Mrityunjaya Havan","Ayush Homam","Dhanvantari Puja","Sudarshan Havan","Santan Gopal"], specializations:["health","regular"], languages:["Hindi","Sanskrit"], rating:4.8, reviews:135, completed_pujas:1050, location:"Rishikesh, UK", available:true, featured:false, image_url:"/assets/pandits/p11.jpg", bio:"Dedicated to healing pujas and health rituals.", certifications:["Acharya (Dev Sanskriti University)","Ayurveda Basics Diploma"] },
  { id:"p12", name:"Pandit Deepak Pathak", slug:"pandit-deepak-pathak", title:"Prosperity & Business Puja Expert", experience:13, experience_label:"13+ Years", expertise:["Lakshmi Puja","Kuber Puja","Vyapar Vriddhi","Dhanteras","Diwali Puja","Sri Sukta Havan"], specializations:["prosperity","festival"], languages:["Hindi","English","Gujarati"], rating:4.7, reviews:120, completed_pujas:870, location:"Surat, GJ", available:true, featured:false, image_url:"/assets/pandits/p12.jpg", bio:"Popular among business families for his prosperity rituals.", certifications:["Shastri (Somnath Sanskrit University)","Vaishya Karmakand Specialist"] },
  // 13 NEW pandits
  { id:"p13", name:"Acharya Yogendra Mishra", slug:"acharya-yogendra-mishra", title:"Maha Yagya & Agnihotra Expert", experience:30, experience_label:"30+ Years", expertise:["Agnihotra","Atirudra","Sahasrachandi","Lakh Aahuti Havan","Vishnu Yagya"], specializations:["mahayagya","health"], languages:["Hindi","Sanskrit"], rating:4.9, reviews:280, completed_pujas:3500, location:"Kashi, UP", available:true, featured:true, image_url:"/assets/pandits/p13.jpg", bio:"One of the most senior Yagya practitioners in Kashi, known for conducting grand community yagyas.", certifications:["Acharya (BHU)","Yagya Visharad","Vedacharya"] },
  { id:"p14", name:"Pandit Shivkumar Trivedi", slug:"pandit-shivkumar-trivedi", title:"Shiv Upasana & Abhishek Expert", experience:19, experience_label:"19+ Years", expertise:["Rudrabhishek","Laghu Rudra","Maha Rudrabhishek","Shiv Puja","Bilva Archana"], specializations:["regular","health","festival"], languages:["Hindi","Sanskrit","English"], rating:4.8, reviews:190, completed_pujas:1350, location:"Ujjain, MP", available:true, featured:false, image_url:"/assets/pandits/p14.jpg", bio:"A devoted Shiv bhakt who performs powerful abhishek rituals at Mahakaleshwar.", certifications:["Shaiv Darshan Acharya","Karmakand Visharad"] },
  { id:"p15", name:"Pandit Ramesh Bhatt", slug:"pandit-ramesh-bhatt", title:"South Indian Vedic Rituals Expert", experience:17, experience_label:"17+ Years", expertise:["Ganapathi Homam","Navagraha Homam","Sudarshana Homam","Ayush Homam","Mrityunjaya Homam"], specializations:["health","astrological","regular"], languages:["Hindi","Sanskrit","Tamil","English"], rating:4.8, reviews:145, completed_pujas:1100, location:"Varanasi, UP", available:true, featured:false, image_url:"/assets/pandits/p15.jpg", bio:"Trained in both North and South Indian ritual traditions.", certifications:["Agama Shastra (Kanchi)","Shastri (BHU)"] },
  { id:"p16", name:"Acharya Brij Mohan Shukla", slug:"acharya-brij-mohan-shukla", title:"Vivah Karmakand & Muhurat Expert", experience:21, experience_label:"21+ Years", expertise:["Vivah","Engagement","Tilak","Muhurat","Kundali Milan","Haldi Ceremony"], specializations:["samskara","regular"], languages:["Hindi","Sanskrit","Awadhi"], rating:4.8, reviews:220, completed_pujas:1800, location:"Lucknow, UP", available:true, featured:true, image_url:"/assets/pandits/p16.jpg", bio:"Renowned for conducting beautiful and scripturally accurate wedding ceremonies.", certifications:["Karmakand Ratna","Jyotish Visharad"] },
  { id:"p17", name:"Pandit Vinay Ojha", slug:"pandit-vinay-ojha", title:"Vastu & Bhoomi Puja Specialist", experience:15, experience_label:"15+ Years", expertise:["Vastu Shanti","Bhoomi Puja","Griha Pravesh","Navagraha Shanti","Factory Puja"], specializations:["shanti","regular","prosperity"], languages:["Hindi","Sanskrit","English"], rating:4.7, reviews:130, completed_pujas:950, location:"Jaipur, RJ", available:true, featured:false, image_url:"/assets/pandits/p17.jpg", bio:"Expert in Vastu-based pujas for homes, offices, and commercial properties.", certifications:["Vastu Shastra Diploma","Karmakand Certificate"] },
  { id:"p18", name:"Acharya Purushottam Das", slug:"acharya-purushottam-das", title:"Ram Katha & Bhajan Specialist", experience:23, experience_label:"23+ Years", expertise:["Ram Katha","Hanuman Chalisa","Ram Navami","Sundarkand","Tulsi Ramayan"], specializations:["mahayagya","festival"], languages:["Hindi","Sanskrit","Maithili"], rating:4.9, reviews:250, completed_pujas:2100, location:"Ayodhya, UP", available:true, featured:true, image_url:"/assets/pandits/p18.jpg", bio:"A celebrated Ram Katha Vachak from Ayodhya.", certifications:["Acharya (Ayodhya Shodh Sansthan)","Katha Visharad"] },
  { id:"p19", name:"Pandit Kamlesh Dubey", slug:"pandit-kamlesh-dubey", title:"Samskara & Child Ceremony Expert", experience:11, experience_label:"11+ Years", expertise:["Namkaran","Mundan","Annaprashan","Vidyarambh","Karnavedh","Upanayana"], specializations:["samskara"], languages:["Hindi","Sanskrit","English"], rating:4.7, reviews:110, completed_pujas:780, location:"Delhi, DL", available:true, featured:false, image_url:"/assets/pandits/p19.jpg", bio:"Makes samskaras joyful and memorable for families.", certifications:["Shastri (Delhi Sanskrit Academy)","Child Ceremony Specialist"] },
  { id:"p20", name:"Acharya Narayan Jha", slug:"acharya-narayan-jha", title:"Pitru Karma & Tarpan Expert", experience:26, experience_label:"26+ Years", expertise:["Pind Daan","Tarpan","Shraddh","Narayan Bali","Tripindi Shraddh","Garud Puran Path"], specializations:["pitru","mahayagya"], languages:["Hindi","Sanskrit","Maithili"], rating:4.9, reviews:200, completed_pujas:2500, location:"Gaya, Bihar", available:true, featured:false, image_url:"/assets/pandits/p20.jpg", bio:"Born and raised in Gaya, performing Pitru Karma at Vishnupad since childhood.", certifications:["Pitru Karma Acharya","Shastri (Gaya University)"] },
  { id:"p21", name:"Pandit Ankit Sharma", slug:"pandit-ankit-sharma", title:"Modern Puja & Corporate Event Specialist", experience:8, experience_label:"8+ Years", expertise:["Office Puja","Satyanarayan","Griha Pravesh","Ganesh Puja","Saraswati Puja"], specializations:["regular","prosperity","festival"], languages:["Hindi","Sanskrit","English"], rating:4.7, reviews:95, completed_pujas:620, location:"Gurugram, HR", available:true, featured:false, image_url:"/assets/pandits/p21.jpg", bio:"Young, tech-savvy pandit popular among urban families and corporates.", certifications:["Shastri (JNU)","Vedic Management Diploma"] },
  { id:"p22", name:"Acharya Mukund Bhardwaj", slug:"acharya-mukund-bhardwaj", title:"Tantra Vidya & Mahavidya Expert", experience:27, experience_label:"27+ Years", expertise:["Das Mahavidya","Baglamukhi","Tara Puja","Shodashi","Bhairav Puja","Chamunda"], specializations:["tantra","astrological"], languages:["Hindi","Sanskrit","Bengali"], rating:4.8, reviews:160, completed_pujas:1300, location:"Kamakhya, Assam", available:true, featured:false, image_url:"/assets/pandits/p22.jpg", bio:"Initiated in Tantra Vidya at Kamakhya Peeth, a rare practitioner of all 10 Mahavidyas.", certifications:["Tantra Ratna (Kamakhya)","Mahavidya Siddhi Certificate"] },
  { id:"p23", name:"Pandit Raghvendra Prasad", slug:"pandit-raghvendra-prasad", title:"Havan & Agnihotra Specialist", experience:14, experience_label:"14+ Years", expertise:["Agnihotra","Gayatri Havan","Maha Mrityunjaya Havan","Vastu Havan","Sudarshan Havan"], specializations:["health","shanti","regular"], languages:["Hindi","Sanskrit","English"], rating:4.7, reviews:125, completed_pujas:900, location:"Haridwar, UK", available:true, featured:false, image_url:"/assets/pandits/p23.jpg", bio:"Specializes in various types of Havans for purification and healing.", certifications:["Agnihotra Diploma (Dev Sanskriti)","Havan Karmakand Certificate"] },
  { id:"p24", name:"Acharya Devendra Shastri", slug:"acharya-devendra-shastri", title:"Kundali & Marriage Matching Expert", experience:22, experience_label:"22+ Years", expertise:["Kundali Analysis","Mangal Dosh","Vivah Muhurat","Rashi Analysis","Prashna Kundali"], specializations:["astrological","samskara"], languages:["Hindi","Sanskrit","English","Punjabi"], rating:4.8, reviews:185, completed_pujas:1450, location:"Chandigarh, PB", available:true, featured:false, image_url:"/assets/pandits/p24.jpg", bio:"Combines deep jyotish knowledge with practical remedial guidance.", certifications:["Jyotish Acharya (Panjab University)","Hora Shastra Expert"] },
  { id:"p25", name:"Pandit Sanjay Upadhyay", slug:"pandit-sanjay-upadhyay", title:"Festival & Community Puja Expert", experience:16, experience_label:"16+ Years", expertise:["Ganesh Chaturthi","Janmashtami","Shivratri","Chhath Puja","Makar Sankranti","Holi Holika"], specializations:["festival","regular"], languages:["Hindi","Sanskrit","Bhojpuri","English"], rating:4.7, reviews:140, completed_pujas:1050, location:"Patna, Bihar", available:true, featured:false, image_url:"/assets/pandits/p25.jpg", bio:"Organizes large-scale community pujas and festival celebrations.", certifications:["Shastri (Patna University)","Festival Karmakand Certificate"] },
];

// ════════════════════════════════════════════
// PUJA TEMPLATES PER CATEGORY (10-12 each → 110 total)
// ════════════════════════════════════════════

const pujaTemplates = {
  mahayagya: [
    { id:"bhagwat-katha", title:"Srimad Bhagwat Katha", dur:"7 Days", bp:51000, sp:151000, pp:501000, tags:["popular","grand","family"], pandits:["p1","p4","p18"], desc:"A deeply spiritual 7-day recitation of the divine leelas of Lord Krishna. Purifies the listener, removes karmic debts, and grants liberation.", benefits:["Ancestral peace (Pitru Tarpan)","Karmic debt removal","Family harmony","Spiritual elevation","Moksha path"] },
    { id:"ram-katha", title:"Ram Katha (Ramayan Path)", dur:"9 Days", bp:61000, sp:175000, pp:551000, tags:["popular","grand"], pandits:["p1","p18"], desc:"9-day narration of Tulsidas's Ramcharitmanas covering Lord Ram's complete life journey from Balkand to Uttarkand.", benefits:["Dharma strengthening","Family unity","Karmic purification","Mental peace","Moral guidance"] },
    { id:"sundarkand-path", title:"Sundarkand Path", dur:"3-5 Hours", bp:2100, sp:5100, pp:11000, tags:["popular","hanuman","protection"], pandits:["p1","p4"], desc:"The most powerful chapter of Ramcharitmanas, describing Hanuman Ji's journey to Lanka. Removes obstacles and grants courage.", benefits:["Obstacle removal","Fear elimination","Health recovery support","Legal relief","Protection from negativity"] },
    { id:"shiv-mahapuran", title:"Shiv Mahapuran Katha", dur:"7 Days", bp:51000, sp:151000, pp:451000, tags:["grand","shiva"], pandits:["p1","p14","p4"], desc:"7-day narration of the divine stories of Lord Shiva from the Shiv Puran — creation, destruction, marriage with Parvati, and cosmic dance.", benefits:["Shiva's divine blessings","Sin removal","Health & longevity","Spiritual awakening","Family protection"] },
    { id:"devi-bhagwat-katha", title:"Devi Bhagwat Katha", dur:"7 Days", bp:51000, sp:151000, pp:451000, tags:["grand","shakti","navratri"], pandits:["p8","p1"], desc:"7-day recitation of the Devi Bhagwat Puran — the supreme story of Goddess Durga, her avatars, and cosmic battles.", benefits:["Shakti awakening","Protection from enemies","Health & prosperity","Negative energy removal","Confidence boost"] },
    { id:"vishnu-sahasranama-yagya", title:"Vishnu Sahasranama Maha Yagya", dur:"1 Day", bp:11000, sp:31000, pp:101000, tags:["vishnu","grand"], pandits:["p1","p13"], desc:"Grand Havan reciting the 1000 names of Lord Vishnu with 1008 Aahutis for protection, prosperity, and spiritual merit.", benefits:["Divine protection","Wish fulfillment","Karmic cleansing","Prosperity","Family blessings"] },
    { id:"atirudra-mahayagya", title:"Atirudra Maha Yagya", dur:"11 Days", bp:251000, sp:501000, pp:1101000, tags:["grand","shiva","rare"], pandits:["p13","p14","p1"], desc:"The grandest Shiva Yagya — 11 days of continuous Rudram chanting by 121 Pandits with 14,641 recitations total.", benefits:["Supreme karmic purification","Community blessings","Disease eradication","Prosperity for all","Cosmic balance"] },
    { id:"sahasrachandi-yagya", title:"Sahasrachandi Maha Yagya", dur:"9 Days", bp:151000, sp:351000, pp:751000, tags:["grand","shakti","rare"], pandits:["p8","p13","p22"], desc:"9-day grand Shakti Yagya with 1000 recitations of Durga Saptashati by multiple Pandits simultaneously.", benefits:["Supreme Shakti blessings","Enemy destruction","All-round prosperity","Health restoration","Negative energy annihilation"] },
    { id:"garud-puran-path", title:"Garud Puran Path", dur:"3 Days", bp:11000, sp:31000, pp:71000, tags:["pitru","afterlife"], pandits:["p7","p20"], desc:"3-day recitation of Garud Puran covering the journey of the soul after death, ideal during mourning period (Antim Sanskar).", benefits:["Departed soul's peace","Family solace","Understanding of afterlife","Karmic guidance","Spiritual closure"] },
    { id:"akhand-ramayan-path", title:"Akhand Ramayan Path", dur:"24 Hours", bp:11000, sp:25000, pp:51000, tags:["popular","continuous","ram"], pandits:["p18","p4"], desc:"Non-stop 24-hour continuous recitation of the complete Ramcharitmanas by rotating groups of Pandits.", benefits:["Maximum spiritual merit","Home purification","All wishes fulfilled","Ancestral blessings","Divine protection"] },
    { id:"shrimad-bhagavad-gita-yagya", title:"Shrimad Bhagavad Gita Yagya", dur:"1 Day", bp:7100, sp:21000, pp:51000, tags:["krishna","gita"], pandits:["p1","p13"], desc:"Complete recitation of all 18 chapters of Bhagavad Gita with Havan, discourse, and kirtan.", benefits:["Mental clarity","Decision-making power","Karmic understanding","Detachment & peace","Spiritual wisdom"] },
  ],
  samskara: [
    { id:"vivah-puja", title:"Vedic Vivah (Wedding) Puja", dur:"4-6 Hours", bp:11000, sp:31000, pp:101000, tags:["popular","samskara","family"], pandits:["p2","p5","p16"], desc:"Traditional Vedic wedding with every mantra and ritual — from Kanyadaan to Saptapadi — performed with absolute purity.", benefits:["Shastriya Vedic wedding","Proper Kanyadaan & Saptapadi","Blessings for a lifelong bond","Family harmony"] },
    { id:"namkaran-sanskar", title:"Namkaran Sanskar (Naming Ceremony)", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["samskara","baby","family"], pandits:["p2","p19"], desc:"Sacred Vedic naming ceremony for your newborn with name selection based on birth nakshatra and planetary positions.", benefits:["Astrologically aligned name","Blessings for health","Family bonding","Vedic Samskara fulfillment"] },
    { id:"mundan-sanskar", title:"Mundan Sanskar (First Haircut)", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["samskara","baby","family"], pandits:["p2","p19"], desc:"First tonsure ceremony performed according to Vedic traditions. Believed to stimulate brain development and remove birth-time negativity.", benefits:["Purification of past-life karma","Brain development boost","Strong hair growth","Vedic blessing for intelligence"] },
    { id:"annaprashan-sanskar", title:"Annaprashan Sanskar (First Solid Food)", dur:"1-1.5 Hours", bp:2100, sp:5100, pp:9100, tags:["samskara","baby"], pandits:["p19","p5"], desc:"The ceremony of feeding the baby solid food for the first time, performed on an auspicious muhurat.", benefits:["Healthy digestion blessings","Longevity prayers","Family celebration","Vedic Samskara completion"] },
    { id:"upanayana-sanskar", title:"Upanayana Sanskar (Janeu/Thread Ceremony)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["samskara","education"], pandits:["p2","p16"], desc:"Sacred thread ceremony marking the beginning of Vedic education and spiritual discipline for boys.", benefits:["Spiritual initiation","Gayatri Mantra Diksha","Vedic education blessings","Discipline & focus"] },
    { id:"vidyarambh-sanskar", title:"Vidyarambh Sanskar (Education Start)", dur:"1 Hour", bp:1100, sp:3100, pp:7100, tags:["samskara","education","child"], pandits:["p19","p21"], desc:"Ceremony to mark the beginning of formal education for the child, performed before they start school.", benefits:["Saraswati's blessings","Sharp intellect","Love for learning","Academic success"] },
    { id:"karnavedh-sanskar", title:"Karnavedh Sanskar (Ear Piercing)", dur:"1 Hour", bp:1600, sp:3600, pp:7100, tags:["samskara","baby"], pandits:["p19","p5"], desc:"Ear-piercing ceremony performed with Vedic mantras, believed to improve hearing and immune function.", benefits:["Health benefits from acupressure points","Vedic tradition fulfillment","Protection blessings","Aesthetic grace"] },
    { id:"engagement-ceremony", title:"Vedic Engagement (Sagai/Tilak)", dur:"2-3 Hours", bp:5100, sp:11000, pp:25000, tags:["samskara","wedding"], pandits:["p16","p2"], desc:"Formal engagement ceremony with Ganesh Puja, ring exchange, tilak, and blessings from both families.", benefits:["Auspicious bond formation","Family unity","Divine blessings on couple","Muhurat selection guidance"] },
    { id:"grihasthi-pravesh", title:"Grihasthi Pravesh (Bride's Welcome)", dur:"1.5-2 Hours", bp:3100, sp:7100, pp:15100, tags:["samskara","wedding","family"], pandits:["p16","p5"], desc:"The ceremony of welcoming the new bride into the husband's family home with Vedic rituals and blessings.", benefits:["Harmonious family entry","Lakshmi invocation","Family bonding","Protection blessings"] },
    { id:"garbh-sanskar", title:"Garbh Sanskar (Pregnancy Blessing)", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["samskara","baby","health"], pandits:["p19","p11"], desc:"Vedic blessing ceremony during pregnancy for the health of the mother and child. Includes mantra chanting and Havan.", benefits:["Healthy pregnancy blessings","Child's mental development","Mother's protection","Positive energy for family"] },
    { id:"antim-sanskar-vidhi", title:"Antim Sanskar (Last Rites) Guidance", dur:"As Needed", bp:5100, sp:11000, pp:21000, tags:["samskara","pitru"], pandits:["p7","p20"], desc:"Complete guidance and ritual performance for last rites including Dashakriya, Tehrvi, and Shraddh setup.", benefits:["Proper Vedic last rites","Soul's peaceful transition","Family guidance in grief","Shraddh calendar setup"] },
  ],
  regular: [
    { id:"satyanarayan-katha", title:"Satyanarayan Vrat Katha", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["popular","bestseller","household"], pandits:["p2","p21"], desc:"Lord Satyanarayan is the embodiment of truth. This puja is performed before auspicious events, on Purnima, or to mark milestones.", benefits:["Financial prosperity","Family harmony","Obstacle removal","Auspicious beginning for new ventures"] },
    { id:"griha-pravesh", title:"Griha Pravesh (Housewarming) Puja", dur:"3-4 Hours", bp:3100, sp:7100, pp:15100, tags:["popular","household","vastu"], pandits:["p2","p17"], desc:"Sacred housewarming ritual to purify your new home and invite prosperity with Vastu Shanti, Ganesh Puja, and Havan.", benefits:["Vastu dosh removal","Negative energy cleansing","Prosperity invitation","Family protection"] },
    { id:"rudrabhishek", title:"Rudrabhishek Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shiva","popular","health"], pandits:["p14","p4"], desc:"The most powerful Shiva worship — Shivling bathed with milk, honey, curd while chanting Rudram and Chamakam.", benefits:["Disease & health relief","Sin removal","Wish fulfillment","Inner peace & spiritual growth"] },
    { id:"ganesh-puja", title:"Ganesh Puja & Atharvashirsha", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["popular","ganesh","beginning"], pandits:["p9","p21"], desc:"Invoke Lord Ganesha — the remover of obstacles — before any new beginning, venture, or important life event.", benefits:["Obstacle removal","Success in new ventures","Wisdom & intelligence","Protection from setbacks"] },
    { id:"saraswati-puja", title:"Saraswati Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["education","knowledge"], pandits:["p9","p21"], desc:"Worship Goddess Saraswati for knowledge, wisdom, arts, and academic success. Ideal before exams or new courses.", benefits:["Academic excellence","Creative abilities","Speech improvement","Wisdom & clarity"] },
    { id:"hanuman-puja", title:"Hanuman Puja & Chalisa Path", dur:"1.5-2 Hours", bp:1600, sp:3600, pp:7100, tags:["hanuman","protection","popular"], pandits:["p4","p18"], desc:"Invoke Hanuman Ji's blessings for strength, courage, and protection. Includes Hanuman Chalisa recitation and Havan.", benefits:["Courage & strength","Protection from evil","Health recovery","Victory over enemies"] },
    { id:"durga-puja-regular", title:"Durga Puja (Home)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shakti","protection"], pandits:["p8","p4"], desc:"Home-based Durga Puja with Saptashati Path, Havan, and Aarti for Goddess Durga's protection and blessings.", benefits:["Protection from enemies","Shakti & courage","Family safety","Negative energy removal"] },
    { id:"vishnu-puja", title:"Vishnu Puja & Sahasranama", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["vishnu","protection"], pandits:["p1","p13"], desc:"Worship Lord Vishnu with Sahasranama Path for divine protection, preservation, and sustenance of family happiness.", benefits:["Divine protection","Family sustenance","Health & longevity","Obstacle removal"] },
    { id:"shiv-puja", title:"Shiv Puja & Abhishek", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["shiva","regular"], pandits:["p14","p4"], desc:"Regular Shiv Puja with Abhishek, Bilva Archana, and Om Namah Shivaya chanting for peace and health.", benefits:["Peace of mind","Health improvement","Wish fulfillment","Family harmony"] },
    { id:"tulsi-vivah-puja", title:"Tulsi Vivah Puja", dur:"1-1.5 Hours", bp:1600, sp:3600, pp:7100, tags:["regular","vishnu","tulsi"], pandits:["p9","p2"], desc:"Ceremonial marriage of Tulsi plant with Lord Vishnu, performed after Devuthani Ekadashi to start the wedding season.", benefits:["Marriage-season auspiciousness","Vishnu's blessings","Household purity","Spiritual merit"] },
    { id:"surya-puja", title:"Surya Puja & Arghya", dur:"1-1.5 Hours", bp:1600, sp:3600, pp:7100, tags:["regular","health","surya"], pandits:["p9","p15"], desc:"Sun God worship with Surya Namaskar mantras, Arghya, and Havan for health, confidence, and career success.", benefits:["Leadership qualities","Health vitality","Eye health","Career advancement"] },
    { id:"gayatri-havan", title:"Gayatri Maha Havan", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["popular","havan","purification"], pandits:["p23","p13"], desc:"Grand Havan with Gayatri Mantra — the most powerful Vedic mantra — for intellectual growth, purity, and spiritual upliftment.", benefits:["Intellectual sharpening","Environmental purification","Spiritual growth","Positive energy generation"] },
  ],
  astrological: [
    { id:"navagraha-shanti", title:"Navagraha Shanti Puja", dur:"3-4 Hours", bp:3100, sp:7100, pp:15100, tags:["astrological","dosh-nivaran"], pandits:["p3","p6"], desc:"Appease all 9 planets to remove obstacles, bad luck, and dasha-related issues. Restores planetary balance.", benefits:["Planetary balance","Bad dasha relief","Health improvement","Career obstacle removal"] },
    { id:"kaal-sarp-dosh", title:"Kaal Sarp Dosh Nivaran Puja", dur:"3-4 Hours", bp:5100, sp:11000, pp:21000, tags:["astrological","dosh-nivaran","rahu-ketu"], pandits:["p3","p6"], desc:"When all planets are hemmed between Rahu and Ketu, it forms Kaal Sarp Dosh — causing delays, failures, and anxiety.", benefits:["Dosh neutralization","Mental peace","Career & marriage relief","Protection from sudden losses"] },
    { id:"mangal-dosh-nivaran", title:"Mangal Dosh Nivaran Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["astrological","dosh-nivaran","marriage"], pandits:["p3","p24"], desc:"Remove Mangal Dosh (Manglik) that causes delays in marriage and marital discord. Essential before wedding for Manglik individuals.", benefits:["Marriage obstacle removal","Marital harmony","Mars planet appeasement","Relationship improvement"] },
    { id:"shani-shanti", title:"Shani Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["astrological","shani","dosh-nivaran"], pandits:["p6","p10"], desc:"Appease Lord Shani to reduce the effects of Sade Sati, Shani Dasha, or Shani Dhaiyya periods.", benefits:["Sade Sati relief","Career stability","Health improvement","Anxiety & fear reduction"] },
    { id:"rahu-ketu-shanti", title:"Rahu-Ketu Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["astrological","rahu-ketu"], pandits:["p6","p3"], desc:"Appease shadow planets Rahu and Ketu that cause confusion, deception, sudden losses, and spiritual turbulence.", benefits:["Mental clarity","Protection from fraud","Spiritual stability","Sudden-loss prevention"] },
    { id:"budh-shanti", title:"Budh (Mercury) Shanti Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["astrological","budh"], pandits:["p3","p10"], desc:"Appease planet Mercury for improved communication, business acumen, and intellectual sharpness.", benefits:["Communication improvement","Business growth","Academic success","Nervous system health"] },
    { id:"guru-brihaspati-puja", title:"Guru (Jupiter) Shanti Puja", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["astrological","guru"], pandits:["p3","p24"], desc:"Worship planet Jupiter — the Guru of Devas — for wisdom, prosperity, children, and spiritual growth.", benefits:["Wisdom & knowledge","Wealth growth","Children blessings","Spiritual progress"] },
    { id:"shukra-shanti", title:"Shukra (Venus) Shanti Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["astrological","shukra","marriage"], pandits:["p24","p10"], desc:"Appease planet Venus for love, beauty, marital bliss, luxury, and artistic talents.", benefits:["Marital happiness","Beauty & charm","Material comforts","Artistic abilities"] },
    { id:"surya-graha-shanti", title:"Surya (Sun) Graha Shanti", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["astrological","surya"], pandits:["p3","p15"], desc:"Appease Sun for leadership, confidence, government favors, and health vitality.", benefits:["Leadership boost","Government favor","Health vitality","Confidence & authority"] },
    { id:"chandra-shanti", title:"Chandra (Moon) Shanti Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["astrological","chandra","mental-health"], pandits:["p10","p3"], desc:"Appease Moon for mental peace, emotional stability, mother's health, and water-related prosperity.", benefits:["Mental peace","Emotional balance","Mother's health","Prosperity from water sources"] },
    { id:"pitra-dosh-nivaran", title:"Pitra Dosh Nivaran Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["astrological","pitru","dosh-nivaran"], pandits:["p7","p20"], desc:"Remove Pitra Dosh that causes repeated failures, childlessness, and unexplained health issues in the family.", benefits:["Ancestral curse removal","Childlessness remedy","Family peace restoration","Career unblocking"] },
  ],
  prosperity: [
    { id:"lakshmi-puja", title:"Lakshmi Puja (Wealth & Prosperity)", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["prosperity","diwali","business"], pandits:["p2","p12"], desc:"Invoke Goddess Lakshmi's blessings for wealth, business growth, and financial stability.", benefits:["Wealth increase","Business growth","Debt relief","Financial stability"] },
    { id:"kuber-puja", title:"Kuber Puja (Wealth Lock)", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["prosperity","wealth"], pandits:["p12","p2"], desc:"Worship Lord Kuber — the divine treasurer — to lock in wealth and prevent financial leakage.", benefits:["Wealth preservation","Income increase","Investment success","Luxury & comforts"] },
    { id:"sri-sukta-havan", title:"Sri Sukta Maha Havan", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["prosperity","havan","popular"], pandits:["p12","p13"], desc:"Grand Havan with Sri Sukta — the supreme Vedic hymn of wealth — for attracting abundance and prosperity.", benefits:["Maximum wealth attraction","Business breakthrough","Property gains","Financial abundance"] },
    { id:"vyapar-vriddhi-puja", title:"Vyapar Vriddhi (Business Growth) Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["prosperity","business"], pandits:["p12","p21"], desc:"Specialized puja for business owners to accelerate growth, attract customers, and remove commercial obstacles.", benefits:["Sales increase","Customer attraction","Competition victory","Business obstacle removal"] },
    { id:"dhanteras-puja", title:"Dhanteras Special Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["prosperity","diwali","festival"], pandits:["p12","p9"], desc:"Special Dhanteras puja invoking Lord Dhanvantari and Kuber for health-wealth combination blessings.", benefits:["Health & wealth combination","Precious metal blessings","Financial protection","Auspicious purchases"] },
    { id:"ashta-lakshmi-puja", title:"Ashta Lakshmi Puja (8 Forms)", dur:"3-4 Hours", bp:5100, sp:11000, pp:21000, tags:["prosperity","lakshmi","grand"], pandits:["p12","p2","p5"], desc:"Worship all 8 forms of Goddess Lakshmi — Dhana, Dhanya, Gaja, Santana, Veera, Vijaya, Vidya, and Aishwarya Lakshmi.", benefits:["Complete prosperity in all 8 areas","Children blessings","Victory in endeavors","Knowledge & wealth both"] },
    { id:"kanakdhara-puja", title:"Kanakdhara Stotram Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["prosperity","poverty-removal"], pandits:["p2","p12"], desc:"Recitation of Adi Shankaracharya's Kanakdhara Stotram — the hymn that showered gold coins on a poor woman.", benefits:["Poverty removal","Gold/wealth attraction","Lakshmi's special grace","Financial breakthrough"] },
    { id:"mahalakshmi-vrat", title:"Mahalakshmi Vrat Puja", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["prosperity","vrat","women"], pandits:["p5","p2"], desc:"16-day Mahalakshmi Vrat puja for married women seeking family prosperity, husband's success, and household abundance.", benefits:["Family prosperity","Husband's success","Household abundance","Marital harmony"] },
    { id:"shri-yantra-puja", title:"Shri Yantra Sthapana & Puja", dur:"2-3 Hours", bp:5100, sp:11000, pp:21000, tags:["prosperity","yantra","powerful"], pandits:["p22","p12"], desc:"Installation and energization of the Shri Yantra — the most powerful geometric yantra for wealth manifestation.", benefits:["Wealth magnetization","Financial abundance","Business empire growth","Divine prosperity channel"] },
    { id:"annapurna-puja", title:"Annapurna Puja", dur:"1.5-2 Hours", bp:1600, sp:3600, pp:7100, tags:["prosperity","food","family"], pandits:["p2","p9"], desc:"Worship Goddess Annapurna for food security, kitchen abundance, and freedom from hunger and poverty.", benefits:["Food abundance","Kitchen blessings","Poverty removal","Nourishment for family"] },
  ],
  health: [
    { id:"maha-mrityunjaya", title:"Maha Mrityunjaya Havan", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["health","popular","protection"], pandits:["p11","p23"], desc:"The supreme healing Havan with 1008/11000 chants of Maha Mrityunjaya Mantra for life-threatening illness and longevity.", benefits:["Disease recovery","Longevity","Accident prevention","Death fear removal"] },
    { id:"dhanvantari-puja", title:"Dhanvantari Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["health","healing"], pandits:["p11","p15"], desc:"Worship Lord Dhanvantari — the divine physician and founder of Ayurveda — for chronic disease healing.", benefits:["Chronic disease healing","Doctor's treatment support","Ayurvedic blessings","Health restoration"] },
    { id:"sudarshan-havan", title:"Sudarshan Havan", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["health","protection","vishnu"], pandits:["p11","p23"], desc:"Vishnu's Sudarshan Chakra Havan for protection from black magic, evil eye, and negative energies affecting health.", benefits:["Evil eye removal","Black magic protection","Energy field cleansing","Health shield activation"] },
    { id:"ayush-homam", title:"Ayush Homam (Longevity)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["health","longevity","baby"], pandits:["p15","p11"], desc:"Fire ritual for longevity performed especially for children and elderly. Invokes the Ayush Devata for a long, healthy life.", benefits:["Longevity blessings","Children's health","Elderly protection","Immune system boost"] },
    { id:"santan-gopal-puja", title:"Santan Gopal Puja", dur:"2-3 Hours", bp:5100, sp:11000, pp:21000, tags:["health","fertility","family"], pandits:["p11","p2"], desc:"Powerful puja for couples seeking children. Invokes Lord Krishna in his child form (Bal Gopal) for fertility blessings.", benefits:["Fertility blessings","Healthy pregnancy","Male child blessings","Childbirth ease"] },
    { id:"maha-sudarshan-puja", title:"Maha Sudarshan Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["health","protection","powerful"], pandits:["p11","p23"], desc:"Extended Sudarshan puja with yantra sthapana for complete protection from all forms of negative energies.", benefits:["360° negative energy removal","Home protection shield","Health restoration","Mental peace"] },
    { id:"narsimha-kavach-puja", title:"Narsimha Kavach Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["protection","vishnu","health"], pandits:["p11","p1"], desc:"Invoke Lord Narsimha's protective kavach (shield) for safety from enemies, diseases, and accidents.", benefits:["Divine armor of protection","Enemy fear removal","Accident prevention","Courage & fearlessness"] },
    { id:"chandi-path-health", title:"Chandi Path (Health)", dur:"3-4 Hours", bp:5100, sp:11000, pp:21000, tags:["health","shakti"], pandits:["p8","p11"], desc:"Durga Saptashati (Chandi Path) performed specifically for health recovery with special health-specific Sankalp.", benefits:["Disease recovery","Shakti for fighting illness","Mental health","Physical strength restoration"] },
    { id:"tulsi-puja-health", title:"Tulsi Puja (Health & Immunity)", dur:"1 Hour", bp:1100, sp:2600, pp:5100, tags:["health","regular","tulsi"], pandits:["p11","p9"], desc:"Worship Tulsi Mata for immunity boost, respiratory health, and overall family wellbeing. Includes Tulsi Aarti and Parikrama.", benefits:["Immunity boost","Respiratory health","Family wellbeing","Air purification blessings"] },
    { id:"ashwini-kumar-puja", title:"Ashwini Kumar Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["health","healing","rare"], pandits:["p15","p11"], desc:"Worship the divine twin physicians — Ashwini Kumars — for rare diseases, surgical recovery, and medical miracles.", benefits:["Rare disease healing","Surgical recovery","Medical miracle blessings","Twin deity healing power"] },
  ],
  shanti: [
    { id:"nakshatra-shanti", title:"Nakshatra Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","nakshatra","birth"], pandits:["p10","p3"], desc:"Performed when the birth nakshatra is unfavorable (Mool, Ashlesha, Jyeshtha, etc.) to neutralize its negative effects.", benefits:["Birth nakshatra pacification","Life obstacle removal","Prosperity unblocking","Family peace"] },
    { id:"bhoomi-puja", title:"Bhoomi Puja (Foundation)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","construction","vastu"], pandits:["p17","p10"], desc:"Foundation ceremony before construction to seek Mother Earth's permission and blessings for a trouble-free building.", benefits:["Construction safety","No delays in building","Vastu compliance","Land energy purification"] },
    { id:"vastu-shanti", title:"Vastu Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","vastu","home"], pandits:["p17","p3"], desc:"Remove Vastu dosh from existing homes/offices without structural changes through powerful Vedic rituals.", benefits:["Vastu dosh removal","Positive energy flow","Family harmony","Financial improvement"] },
    { id:"graha-shanti", title:"Graha Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","graha","planetary"], pandits:["p10","p3"], desc:"General planetary peace puja for overall harmony when multiple planets are causing combined negative effects.", benefits:["Multi-planet pacification","Overall life harmony","Health-wealth balance","Relationship peace"] },
    { id:"sarva-karya-siddhi", title:"Sarva Karya Siddhi Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","success","all-purpose"], pandits:["p10","p17"], desc:"The 'all-purpose success' puja — when you need divine help but aren't sure which specific puja to perform.", benefits:["General wish fulfillment","All obstacles cleared","Multi-purpose blessings","Divine guidance for path ahead"] },
    { id:"shanti-path", title:"Shanti Path (Peace Recitation)", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["shanti","peace","regular"], pandits:["p10","p4"], desc:"Recitation of Vedic Shanti Mantras for overall peace in family, workplace, and personal life.", benefits:["Family peace","Mental calm","Workplace harmony","Relationship healing"] },
    { id:"gand-mool-shanti", title:"Gand Mool Nakshatra Shanti", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","nakshatra","baby"], pandits:["p10","p3"], desc:"For children born in Gand Mool Nakshatras (Ashwini, Ashlesha, Magha, Jyeshtha, Mool, Revati) — essential within 27 days.", benefits:["Mool dosh removal","Child's protection","Parents' safety","Future obstacle prevention"] },
    { id:"office-shanti-puja", title:"Office/Factory Shanti Puja", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["shanti","business","vastu"], pandits:["p17","p21"], desc:"Shanti puja for commercial spaces to remove negative energy, resolve employee conflicts, and boost productivity.", benefits:["Workplace harmony","Employee satisfaction","Business growth","Negative energy removal from office"] },
    { id:"vehicle-puja", title:"Vehicle Puja (Vahan Puja)", dur:"30-45 Min", bp:1100, sp:2100, pp:5100, tags:["shanti","protection","regular"], pandits:["p21","p9"], desc:"New vehicle blessing ceremony for accident prevention and safe travel. Includes coconut breaking and Hanuman prayer.", benefits:["Accident prevention","Safe travel blessings","Vehicle longevity","Journey protection"] },
    { id:"drishti-dosh-nivaran", title:"Drishti (Nazar) Dosh Nivaran", dur:"1-1.5 Hours", bp:1600, sp:3600, pp:7100, tags:["shanti","protection","evil-eye"], pandits:["p10","p6"], desc:"Remove evil eye (nazar) effects that cause sudden health issues, bad luck, and unexplained problems.", benefits:["Evil eye removal","Energy cleansing","Luck restoration","Protection mantra activation"] },
  ],
  festival: [
    { id:"navratri-puja", title:"Navratri Special Puja (9 Days)", dur:"9 Days", bp:11000, sp:31000, pp:71000, tags:["festival","navratri","shakti"], pandits:["p8","p22"], desc:"Complete 9-day Navratri puja with Durga Saptashati, Havan on Ashtami, Kanya Pujan on Navami, and daily Aarti.", benefits:["Navdurga blessings","9-day spiritual transformation","Shakti awakening","Wish fulfillment"] },
    { id:"ganesh-chaturthi", title:"Ganesh Chaturthi Puja", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["festival","ganesh","popular"], pandits:["p9","p21"], desc:"Complete Ganesh Chaturthi celebration with Ganesh Sthapana, daily aarti, modak offering, and Visarjan guidance.", benefits:["Vignaharta blessings","New beginning success","Family celebrations","Community bonding"] },
    { id:"shivratri-puja", title:"Maha Shivratri Special Puja", dur:"Night Long", bp:3100, sp:7100, pp:15100, tags:["festival","shiva","popular"], pandits:["p14","p4"], desc:"Night-long Shivratri observance with 4 Prahar Puja, Abhishek, and continuous Om Namah Shivaya chanting.", benefits:["Shiva's supreme blessings","Karmic purification","Marriage blessings","Moksha path opening"] },
    { id:"janmashtami-puja", title:"Janmashtami Special Puja", dur:"Evening to Midnight", bp:2100, sp:5100, pp:11000, tags:["festival","krishna","popular"], pandits:["p1","p18"], desc:"Krishna Janmashtami celebration with midnight birth ceremony, Dahi Handi, bhajans, and Bal Gopal Abhishek.", benefits:["Krishna's blessings","Child protection","Joy & celebration","Bhakti deepening"] },
    { id:"diwali-lakshmi-puja", title:"Diwali Lakshmi-Ganesh Puja", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["festival","diwali","popular","prosperity"], pandits:["p12","p2"], desc:"The most important puja of the year — Diwali Lakshmi-Ganesh Puja for maximum prosperity and wealth blessings.", benefits:["Year-round prosperity","Wealth activation","Business success","Family joy"] },
    { id:"ram-navami-puja", title:"Ram Navami Special Puja", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["festival","ram","popular"], pandits:["p18","p4"], desc:"Lord Ram's birthday celebration with Ram Katha excerpts, Havan, and Sundarkand recitation.", benefits:["Ram's blessings","Dharma strengthening","Family values","Protection & truth"] },
    { id:"chhath-puja", title:"Chhath Puja Vidhi", dur:"2 Days", bp:3100, sp:7100, pp:15100, tags:["festival","surya","bihar"], pandits:["p25","p7"], desc:"Complete Chhath Puja arrangement with Arghya vidhi, Surya worship, and traditional folk ritual guidance.", benefits:["Surya Dev's blessings","Family health","Wish fulfillment","Ancient tradition preservation"] },
    { id:"makar-sankranti", title:"Makar Sankranti Puja", dur:"1.5-2 Hours", bp:1600, sp:3600, pp:7100, tags:["festival","surya","harvest"], pandits:["p25","p9"], desc:"Celebrate the sun's northward journey with til-gul distribution, Surya Puja, and Havan for harvest blessings.", benefits:["Seasonal transition blessings","Harvest prosperity","Health vitality","Community celebration"] },
    { id:"holika-dahan", title:"Holika Dahan & Holi Puja", dur:"1-2 Hours", bp:1600, sp:3600, pp:7100, tags:["festival","holi","family"], pandits:["p25","p21"], desc:"Holika Dahan ceremony with proper Vedic mantras and Holi celebration blessings for family joy.", benefits:["Evil destruction","New season blessings","Family joy","Community harmony"] },
    { id:"karva-chauth-puja", title:"Karva Chauth Puja", dur:"1-1.5 Hours", bp:1600, sp:3600, pp:7100, tags:["festival","women","marriage"], pandits:["p16","p5"], desc:"Traditional Karva Chauth moon-watching ceremony with proper Katha recitation and Aarti for husband's longevity.", benefits:["Husband's longevity","Marital bliss","Saubhagya preservation","Moon's blessings"] },
    { id:"basant-panchami", title:"Basant Panchami Saraswati Puja", dur:"1.5-2 Hours", bp:2100, sp:5100, pp:11000, tags:["festival","saraswati","education"], pandits:["p9","p21"], desc:"Spring festival celebrating Goddess Saraswati with special prayers for students, artists, and knowledge seekers.", benefits:["Academic success","Artistic growth","Spring energy","Knowledge blessings"] },
  ],
  pitru: [
    { id:"pind-daan", title:"Pind Daan (Gaya)", dur:"1 Day", bp:5100, sp:11000, pp:21000, tags:["pitru","gaya","popular"], pandits:["p7","p20"], desc:"Sacred Pind Daan at Gaya for the liberation of departed ancestors. The most powerful Pitru Karma.", benefits:["Ancestor's moksha","Pitru dosh removal","Family curse liberation","Spiritual merit for 7 generations"] },
    { id:"shraddh-karma", title:"Annual Shraddh Karma", dur:"2-3 Hours", bp:2100, sp:5100, pp:11000, tags:["pitru","annual"], pandits:["p7","p20"], desc:"Annual Shraddh ceremony on the tithi of the departed family member's death for their continued peace.", benefits:["Annual ancestral homage","Pitru blessing for family","Karmic debt reduction","Family prosperity continuation"] },
    { id:"narayan-bali", title:"Narayan Bali Puja", dur:"Full Day", bp:11000, sp:21000, pp:51000, tags:["pitru","powerful","rare"], pandits:["p7","p20"], desc:"Powerful ritual to free stuck souls — performed when there are unexplained family problems, premature deaths, or ghostly disturbances.", benefits:["Stuck soul liberation","Family curse breaking","Unexplained problem resolution","Paranormal disturbance removal"] },
    { id:"tripindi-shraddh", title:"Tripindi Shraddh", dur:"3-4 Hours", bp:5100, sp:11000, pp:21000, tags:["pitru","shraddh","missed"], pandits:["p7","p20"], desc:"When annual Shraddh is missed for 3+ years, Tripindi Shraddh compensates for all missed years in one ceremony.", benefits:["Multi-year Shraddh compensation","Ancestor's anger pacification","Karmic debt clearance","Family obstacle removal"] },
    { id:"tarpan-vidhi", title:"Pitru Tarpan Vidhi", dur:"1-1.5 Hours", bp:1600, sp:3600, pp:7100, tags:["pitru","regular","tarpan"], pandits:["p20","p7"], desc:"Water offering (Tarpan) to ancestors on Amavasya or Pitru Paksha for their satisfaction and blessings.", benefits:["Monthly ancestral homage","Pitru satisfaction","Blessing flow continuation","Karmic balance maintenance"] },
    { id:"asthi-visarjan", title:"Asthi Visarjan (Ashes Immersion)", dur:"1-2 Hours", bp:3100, sp:7100, pp:15100, tags:["pitru","immersion"], pandits:["p7","p20"], desc:"Immersion of ashes in sacred rivers (Ganga, Yamuna, Godavari) with proper Vedic mantras and rituals.", benefits:["Soul's final release","Sacred river blessings","Ritual completion","Family closure"] },
    { id:"pitru-paksha-shraddh", title:"Pitru Paksha Special Shraddh", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["pitru","paksha","annual"], pandits:["p7","p20"], desc:"Special Shraddh performed during the 16-day Pitru Paksha period for maximum ancestral blessings.", benefits:["Maximum Pitru merit","16-day sacred window","Multi-ancestor homage","Family lineage blessings"] },
    { id:"nagbali-puja", title:"Nagbali Puja", dur:"Full Day", bp:11000, sp:21000, pp:51000, tags:["pitru","snake","rare"], pandits:["p7","p6"], desc:"Performed when a snake was killed by family members — believed to cause Nag Dosh affecting marriages and health.", benefits:["Nag Dosh removal","Marriage obstacle clearing","Health restoration","Ancestral karma clearance"] },
    { id:"mahalaya-tarpan", title:"Mahalaya Amavasya Tarpan", dur:"1-2 Hours", bp:2100, sp:5100, pp:11000, tags:["pitru","mahalaya","important"], pandits:["p20","p7"], desc:"The most important Tarpan of the year — on Mahalaya Amavasya — when the veil between worlds is thinnest.", benefits:["Maximum ancestral connection","Year's most powerful Tarpan","Multi-generation blessings","Karma resolution"] },
    { id:"dashakriya-vidhi", title:"Dashakriya (10-Day Rites)", dur:"10 Days", bp:11000, sp:21000, pp:51000, tags:["pitru","death","essential"], pandits:["p7","p20"], desc:"Complete 10-day post-death ritual sequence including daily Pind Daan, Sapindikarana, and soul's journey ceremonies.", benefits:["Proper soul transition","Family guidance in grief","Complete ritual fulfillment","Ancestor's peaceful journey"] },
  ],
  tantra: [
    { id:"baglamukhi-puja", title:"Baglamukhi Puja", dur:"3-4 Hours", bp:5100, sp:11000, pp:25000, tags:["tantra","protection","court-case"], pandits:["p6","p22"], desc:"Invoke Goddess Baglamukhi — the 'tongue-pinner' — to paralyze enemies, win court cases, and overcome opposition.", benefits:["Enemy paralysis","Court case victory","Competition domination","Speech & argument power"] },
    { id:"kali-puja", title:"Kali Puja (Maha Kali)", dur:"Night Ritual", bp:5100, sp:11000, pp:25000, tags:["tantra","shakti","protection"], pandits:["p8","p22"], desc:"Worship Goddess Kali — the destroyer of evil — for extreme protection, fear elimination, and karmic liberation.", benefits:["Evil destruction","Fear elimination","Karmic liberation","Supreme protection"] },
    { id:"bhairav-puja", title:"Bhairav Puja (Kaal Bhairav)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["tantra","shiva","protection"], pandits:["p6","p22"], desc:"Worship Lord Kaal Bhairav — Shiva's fierce form — for time management, protection, and overcoming laziness.", benefits:["Time-related issues resolve","Laziness elimination","Protection at night","Fear removal"] },
    { id:"chamunda-puja", title:"Chamunda Devi Puja", dur:"3-4 Hours", bp:5100, sp:11000, pp:21000, tags:["tantra","shakti","disease"], pandits:["p8","p22"], desc:"Worship Goddess Chamunda for protection against epidemics, chronic diseases, and powerful enemy groups.", benefits:["Epidemic protection","Chronic disease aid","Enemy group defeat","Dark force protection"] },
    { id:"tara-puja", title:"Tara Devi Puja (Mahavidya)", dur:"3-4 Hours", bp:5100, sp:11000, pp:25000, tags:["tantra","mahavidya","knowledge"], pandits:["p22","p6"], desc:"Worship Goddess Tara — the second Mahavidya — for divine knowledge, speech power, and crossing life's ocean.", benefits:["Divine knowledge","Speech mastery","Life obstacle crossing","Spiritual enlightenment"] },
    { id:"shodashi-puja", title:"Shodashi (Tripurasundari) Puja", dur:"3-4 Hours", bp:5100, sp:11000, pp:25000, tags:["tantra","mahavidya","beauty"], pandits:["p22","p8"], desc:"Worship the eternally-16 Goddess Tripurasundari for beauty, attraction, love, and complete material fulfillment.", benefits:["Beauty & attraction","Love & relationships","Material fulfillment","Youthful energy"] },
    { id:"dhumavati-puja", title:"Dhumavati Puja (Widow Goddess)", dur:"2-3 Hours", bp:3100, sp:7100, pp:15100, tags:["tantra","mahavidya","protection"], pandits:["p22","p6"], desc:"Worship Goddess Dhumavati — the smoky one — for protection during poverty, isolation, and desperate situations.", benefits:["Poverty protection","Desperation relief","Enemy confusion","Solitude power"] },
    { id:"chinnamasta-puja", title:"Chinnamasta Puja (Mahavidya)", dur:"3-4 Hours", bp:7100, sp:15100, pp:31000, tags:["tantra","mahavidya","rare","powerful"], pandits:["p22","p6"], desc:"Worship Goddess Chinnamasta — the self-decapitated — for extreme courage, self-sacrifice power, and kundalini awakening.", benefits:["Extreme courage","Kundalini awakening","Self-mastery","Karmic breakthrough"] },
    { id:"matangi-puja", title:"Matangi Puja (Mahavidya)", dur:"2-3 Hours", bp:5100, sp:11000, pp:21000, tags:["tantra","mahavidya","arts"], pandits:["p22","p8"], desc:"Worship Goddess Matangi — the tantric Saraswati — for mastery over arts, music, writing, and creative expression.", benefits:["Creative mastery","Artistic excellence","Writing power","Musical talent boost"] },
    { id:"pratyangira-puja", title:"Pratyangira Devi Puja", dur:"3-4 Hours", bp:7100, sp:15100, pp:31000, tags:["tantra","protection","powerful"], pandits:["p22","p6"], desc:"Invoke the fierce Goddess Pratyangira for counter-attack against black magic, tantric attacks, and powerful enemies.", benefits:["Black magic reversal","Tantric attack counter","Powerful enemy defeat","Ultimate protection shield"] },
  ],
};

// ════════════════════════════════════════════
// GENERATE FULL PUJAS FROM TEMPLATES
// ════════════════════════════════════════════

function generateVidhi(title) {
  const vidhiSteps = [
    { step:1, title:"Sankalp (Sacred Vow)", description:`The devotee takes a sacred vow (Sankalp) declaring their name, gotra, date, and purpose of the ${title}. This sets the intention and invites divine witness.`, duration:"10 min", mantra:"Om Vishnu Om Tat Sat" },
    { step:2, title:"Ganesh Puja & Invocation", description:"Lord Ganesha is worshipped first to remove obstacles from the ceremony. Modak or laddu is offered with durva grass and red flowers.", duration:"15 min", mantra:"Om Gan Ganapataye Namah" },
    { step:3, title:"Kalash Sthapana", description:"A copper or silver Kalash is filled with Gangajal, mango leaves, coconut, and sacred threads. It represents the cosmic waters and divine presence.", duration:"10 min", mantra:"Om Kalash Devaya Vidmahe" },
    { step:4, title:"Navagraha Puja", description:"The nine planets are worshipped to neutralize any negative planetary influences during the puja. Each planet receives its specific grain and mantra.", duration:"15 min", mantra:"Om Suryaya Namah... Om Shanaischaraya Namah" },
    { step:5, title:"Main Deity Invocation (Avahan)", description:`The presiding deity of ${title} is formally invited through Vedic mantras. Flowers, akshat, and incense are offered with devotion.`, duration:"15 min", mantra:"Om Avahayami..." },
    { step:6, title:"Shodashopchar Puja (16-step worship)", description:"The deity is worshipped through 16 traditional offerings: Asana, Padya, Arghya, Achaman, Snana, Vastra, Yagnopavit, Gandha, Pushpa, Dhoop, Deep, Naivedya, Tambul, Dakshin, Aarti, and Pradakshina.", duration:"20 min", mantra:"Om Namah (Deity-specific)" },
    { step:7, title:"Havan / Homam (Fire Ritual)", description:`Sacred fire is lit in the Havan Kund. Ghee, samagri, and specific offerings are made into the fire with each mantra chant.`, duration:"30 min", mantra:"Om Swaha" },
    { step:8, title:"Mantra Jaap", description:`The principal mantra of ${title} is chanted 108, 1008, or 11000 times depending on the package. Each chant deepens the spiritual vibration.`, duration:"20-40 min", mantra:"As per specific puja tradition" },
    { step:9, title:"Aarti & Pushpanjali", description:"The grand Aarti is performed with ghee lamp, camphor, incense, and conch shell. Flowers are offered (Pushpanjali) as final salutation.", duration:"10 min", mantra:"Om Jai Jagdish Hare..." },
    { step:10, title:"Prasad Distribution & Ashirvad", description:"Blessed Prasad is distributed to all attendees. The Pandit provides final blessings and guidance on post-puja observances.", duration:"10 min", mantra:"Sarve Bhavantu Sukhinah" },
  ];
  return vidhiSteps;
}

function generateMantras(catId) {
  const mantraBank = {
    mahayagya: ["Om Namo Bhagavate Vasudevaya","Om Shri Krishnaya Govindaya Gopijana Vallabhaya Namah","Om Sri Ram Jai Ram Jai Jai Ram","Hare Krishna Hare Krishna Krishna Krishna Hare Hare","Om Hanumate Namah","Om Namo Narayanaya"],
    samskara: ["Om Gan Ganapataye Namah","Om Aim Saraswatyai Namah","Gayatri Mantra — Om Bhur Bhuva Swaha","Om Suryaya Namah","Om Shri Lakshmi Narayanaya Namah","Om Prajapate Na Tvad Etanyanyo"],
    regular: ["Om Namah Shivaya","Om Namo Bhagavate Vasudevaya","Om Gan Ganapataye Namah","Om Shri Mahalakshmyai Namah","Om Aim Hreem Kleem Chamundaye Vichaye","Gayatri Mantra"],
    astrological: ["Om Suryaya Namah","Om Chandraya Namah","Om Mangalaya Namah","Om Budhaya Namah","Om Gurave Namah","Om Shukraya Namah","Om Shanaischaraya Namah","Om Rahave Namah","Om Ketave Namah"],
    prosperity: ["Om Shri Mahalakshmyai Namah","Om Shreem Hreem Kleem Mahalakshmyai Namah","Om Kuberaya Namah","Om Shri Dhanvantre Namah","Sri Sukta Mantras","Kanakdhara Stotram"],
    health: ["Om Tryambakam Yajamahe Sugandhim Pushtivardhanam","Om Dhanvantaraye Namah","Om Hreem Sudarshanaaya Namah","Om Ayyur Dehi Dhanur Dehi","Maha Mrityunjaya Mantra (108 chants)","Om Namo Narayanaya"],
    shanti: ["Om Shanti Shanti Shanti","Om Dyauh Shantirantariksham Shantihi","Om Sarve Bhavantu Sukhinah","Om Sham No Mitrah Sham Varunah","Om Asato Ma Sadgamaya","Om Purnamadah Purnamidam"],
    festival: ["Om Gan Ganapataye Namah","Om Namah Shivaya","Om Namo Bhagavate Vasudevaya","Om Aim Hreem Kleem Chamundaye Vichaye","Om Shri Mahalakshmyai Namah","Gayatri Mantra"],
    pitru: ["Om Pitru Devaya Namah","Om Narayanaya Vidmahe Vasudevaya Dhimahi","Ya Devata Pitru Gatim Prayanti","Om Pitrubyah Swadhyayam Namah","Om Shraddha Devyai Namah","Om Yama Dharmarajaya Namah"],
    tantra: ["Om Hreem Baglamukhyai Namah","Om Kreem Kalikayai Namah","Om Bhairavaya Namah","Om Aim Hreem Shreem Kleem","Om Hreem Streem Hum Phat","Om Kleem Kamakhya Devyai Namah"],
  };
  return mantraBank[catId] || mantraBank.regular;
}

function generatePreparationGuide(title) {
  return `Preparation Guide for ${title}:
1. Take a bath early morning and wear clean, preferably traditional clothes (white, yellow, or red).
2. Maintain a Satvik (vegetarian) diet from the previous day — avoid onion, garlic, non-veg, and alcohol.
3. Clean the puja area thoroughly and lay a clean cloth. Face East or North if possible.
4. Keep the samagri items ready and accessible before the Pandit arrives.
5. Ensure all family members who wish to participate are present 15 minutes before start time.
6. Keep mobile phones on silent mode during the puja to maintain the sacred atmosphere.
7. If performing at home, ensure adequate space for Havan Kund (open area preferred for smoke ventilation).
8. Keep a notebook ready to note down any specific instructions the Pandit provides.
9. Prepare Prasad ingredients in advance if you wish to offer homemade Prasad.
10. Maintain a positive and reverent mindset — your devotion amplifies the puja's power.`;
}

function generateDosAndDonts() {
  return {
    dos: [
      "Wake up early and take a bath before the puja",
      "Wear clean, traditional clothes (preferably white, yellow, or saffron)",
      "Maintain Satvik diet on puja day — milk, fruits, light food",
      "Keep the puja area clean and well-decorated",
      "Sit throughout the puja with full attention and devotion",
      "Repeat mantras after the Pandit when asked",
      "Offer dakshina to the Pandit with both hands and respect",
      "Distribute Prasad to neighbors and needy after the puja",
    ],
    donts: [
      "Do not consume non-vegetarian food, onion, garlic, or alcohol on puja day",
      "Do not use mobile phones during the ceremony",
      "Do not leave the puja midway unless absolutely necessary",
      "Do not wear leather items (belt, shoes) in the puja area",
      "Do not step over the puja materials or Havan Kund",
      "Do not argue, use harsh words, or display anger during the ceremony",
      "Do not point feet towards the puja setup or deity",
      "Avoid wearing black clothes during the puja",
    ],
  };
}

function generateWhatToExpect(title, dur) {
  return `What to Expect During ${title}:
The puja will begin with a brief consultation with the Pandit about your specific needs and Sankalp details. The entire ceremony takes approximately ${dur}. Our Pandit will guide you through each step, explaining the significance in Hindi/English. You will be asked to participate in key rituals like offering flowers, pouring ghee into the Havan Kund, and performing Aarti. The atmosphere will be serene with the sound of Vedic mantras, the fragrance of incense and ghee, and the warmth of the sacred fire. Family members are welcome to sit nearby and participate. At the end, you will receive blessed Prasad and any specific post-puja instructions.`;
}

function generatePostPujaGuide(title) {
  return `Post-Puja Guidelines for ${title}:
1. Continue Satvik diet for the rest of the day after the puja.
2. If a lamp (Jyoti) was lit during the puja, keep it burning until it naturally extinguishes — do not blow it out.
3. Store the Prasad respectfully and consume/distribute it within 24 hours.
4. If you received a Yantra or sacred thread, place it in your puja room or wear it as instructed.
5. Try to recite the main mantra of the puja at least 11 times daily for 11 days for maximum benefit.
6. Donate food or clothes to the needy within 3 days of the puja.
7. Maintain a positive and grateful mindset — the puja's energy continues to work for 40 days.
8. If the Pandit gave specific instructions (like visiting a temple, fasting on a particular day), follow them diligently.`;
}

function generatePujaFaq(title) {
  return [
    { question: `How long does ${title} take?`, answer: `The duration depends on the package chosen. Basic packages take the minimum time, while Premium packages include extended rituals, additional mantras, and grand Havan that take longer.` },
    { question: `Can I perform ${title} at home?`, answer: `Yes, absolutely! Our Pandits come to your home with all necessary samagri. You just need to provide a clean puja space. For Havan, a slightly open area is preferred.` },
    { question: `What should I wear during the puja?`, answer: `Wear clean, traditional clothes. White, yellow, or saffron colored clothes are ideal. Avoid black and leather items in the puja area.` },
    { question: `Is the samagri included in the price?`, answer: `Yes. All packages include a complete samagri kit appropriate for that tier. Premium packages include superior quality and additional items.` },
    { question: `Can family members participate?`, answer: `Yes! Family participation is encouraged. The main yajman (host) performs the key rituals, and other family members can sit nearby, offer flowers, and chant along.` },
    { question: `What happens if I need to reschedule?`, answer: `You can reschedule up to 24 hours before the puja at no extra cost. We will help find the next auspicious muhurat for your convenience.` },
  ];
}

function makeTiers(bp, sp, pp) {
  return {
    basic: {
      name: "Basic", price: bp, originalPrice: price(bp * 1.25), pandits: 1,
      features: ["1 Expert Pandit", "Standard Samagri Kit", "Core ritual sequence", "Basic Havan", "Aarti & Prasad"],
    },
    standard: {
      name: "Standard", price: sp, originalPrice: price(sp * 1.2), pandits: 2,
      features: ["2 Pandits with lead Acharya", "Premium Samagri Kit", "Extended ritual with explanation", "Grand Havan with 108 Aahutis", "Bhajan & Kirtan session", "Prasad for 25 people", "Photo documentation"],
    },
    premium: {
      name: "Premium (Grand)", price: pp, originalPrice: price(pp * 1.15), pandits: bp >= 11000 ? 11 : 3,
      features: ["3-11 Pandits with senior Acharya", "Elite Samagri Collection", "Full extended ceremony", "Maha Havan with 1008 Aahutis", "Live Bhajan Mandali", "Yantra Sthapana (if applicable)", "Prasad for 50 people", "Full Photo + Video documentation", "Dedicated event coordinator"],
    },
  };
}

function makeSamagriList(catId) {
  const commonItems = [
    { name:"Pure Cow Ghee", qty:"500 gm - 2 Kg", essential:true },
    { name:"Havan Samagri", qty:"1-2 Kg", essential:true },
    { name:"Dhoop, Agarbatti & Camphor", qty:"1 Pack Each", essential:true },
    { name:"Chandan Paste & Kumkum", qty:"100 gm Each", essential:true },
    { name:"Akshat (Sacred Rice)", qty:"500 gm", essential:true },
    { name:"Coconut", qty:"2 Pieces", essential:true },
    { name:"Red/Yellow Cloth", qty:"2 Meters", essential:true },
    { name:"Seasonal Flowers & Garlands", qty:"As Required", essential:true },
    { name:"Kalash (Copper) with Mango Leaves", qty:"1 Set", essential:true },
    { name:"Gangajal", qty:"200 ml", essential:true },
  ];
  return commonItems;
}

const pujas = [];
for (const [catId, templates] of Object.entries(pujaTemplates)) {
  for (const t of templates) {
    pujas.push({
      id: t.id,
      title: t.title,
      slug: t.id,
      category_id: catId,
      short_description: t.desc.slice(0, 120) + '...',
      description: t.desc,
      image_url: `/assets/pujas/${t.id}.jpg`,
      gallery_images: [`/assets/pujas/${t.id}-1.jpg`, `/assets/pujas/${t.id}-2.jpg`, `/assets/pujas/${t.id}-3.jpg`],
      rating: (4.6 + Math.random() * 0.4).toFixed(1),
      reviews: rand(80, 500),
      bookings: rand(200, 1500),
      duration: t.dur,
      pandit_ids: t.pandits,
      tags: t.tags,
      benefits: t.benefits,
      tiers: makeTiers(t.bp, t.sp, t.pp),
      samagri_list: makeSamagriList(catId),
      vidhi: generateVidhi(t.title),
      mantras: generateMantras(catId),
      preparation_guide: generatePreparationGuide(t.title),
      dos_and_donts: generateDosAndDonts(),
      what_to_expect: generateWhatToExpect(t.title, t.dur),
      post_puja_guide: generatePostPujaGuide(t.title),
      min_pandits: 1,
      max_pandits: t.bp >= 51000 ? 21 : t.bp >= 11000 ? 11 : 7,
      price_per_extra_pandit: t.bp >= 51000 ? 5100 : t.bp >= 11000 ? 3100 : 2100,
      faq: generatePujaFaq(t.title),
    });
  }
}

console.log(`Generated ${pujas.length} pujas`);

// ════════════════════════════════════════════
// SAMAGRI CATEGORIES (15)
// ════════════════════════════════════════════
const samagriCategories = [
  { id:"puja-kits", name:"Complete Puja Kits", icon:"package", slug:"puja-kits" },
  { id:"essentials", name:"Puja Essentials", icon:"flame", slug:"puja-essentials" },
  { id:"ghee-oils", name:"Ghee & Sacred Oils", icon:"droplet", slug:"ghee-oils" },
  { id:"flowers-garlands", name:"Flowers & Garlands", icon:"flower", slug:"flowers-garlands" },
  { id:"havan-items", name:"Havan Samagri & Woods", icon:"tree", slug:"havan-items" },
  { id:"diyas-lamps", name:"Diyas, Lamps & Candles", icon:"lamp", slug:"diyas-lamps" },
  { id:"idols-murtis", name:"Idols & Murtis", icon:"crown", slug:"idols-murtis" },
  { id:"yantras", name:"Yantras & Sacred Geometry", icon:"hexagon", slug:"yantras" },
  { id:"rudraksha-gems", name:"Rudraksha & Gemstones", icon:"gem", slug:"rudraksha-gems" },
  { id:"incense-dhoop", name:"Incense, Dhoop & Camphor", icon:"wind", slug:"incense-dhoop" },
  { id:"puja-cloth", name:"Puja Cloth & Asanas", icon:"scissors", slug:"puja-cloth" },
  { id:"puja-utensils", name:"Puja Utensils & Accessories", icon:"cup", slug:"puja-utensils" },
  { id:"sacred-threads", name:"Sacred Threads & Malas", icon:"link", slug:"sacred-threads" },
  { id:"herbs-powders", name:"Herbs, Powders & Pastes", icon:"leaf", slug:"herbs-powders" },
  { id:"books-granths", name:"Books & Sacred Granths", icon:"book", slug:"books-granths" },
];

// ════════════════════════════════════════════
// SAMAGRI PRODUCT GENERATOR — 1000+ products
// ════════════════════════════════════════════

const productTemplates = {
  "puja-kits": [
    { base:"Satyanarayan Puja Kit", w:"2.5 Kg", bp:499, spec:{ items:"25+ items", type:"Complete Kit" } },
    { base:"Griha Pravesh Puja Kit", w:"3 Kg", bp:699, spec:{ items:"30+ items", type:"Complete Kit" } },
    { base:"Rudrabhishek Puja Kit", w:"2 Kg", bp:599, spec:{ items:"20+ items", type:"Complete Kit" } },
    { base:"Navratri Puja Kit", w:"2 Kg", bp:449, spec:{ items:"22+ items", type:"Complete Kit" } },
    { base:"Diwali Lakshmi-Ganesh Puja Kit", w:"2 Kg", bp:549, spec:{ items:"25+ items", type:"Complete Kit" } },
    { base:"Navagraha Shanti Kit", w:"3 Kg", bp:799, spec:{ items:"35+ items", type:"Complete Kit" } },
    { base:"Vivah (Wedding) Puja Kit", w:"5 Kg", bp:1499, spec:{ items:"50+ items", type:"Complete Kit" } },
    { base:"Havan Kit (Basic)", w:"1.5 Kg", bp:349, spec:{ items:"15+ items", type:"Havan Kit" } },
    { base:"Maha Mrityunjaya Puja Kit", w:"2 Kg", bp:599, spec:{ items:"20+ items", type:"Complete Kit" } },
    { base:"Ganesh Puja Kit", w:"1.5 Kg", bp:399, spec:{ items:"18+ items", type:"Complete Kit" } },
    { base:"Shiv Puja & Abhishek Kit", w:"2 Kg", bp:499, spec:{ items:"20+ items", type:"Complete Kit" } },
    { base:"Lakshmi Puja Kit", w:"1.5 Kg", bp:449, spec:{ items:"18+ items", type:"Complete Kit" } },
    { base:"Hanuman Puja Kit", w:"1.5 Kg", bp:349, spec:{ items:"15+ items", type:"Complete Kit" } },
    { base:"Surya Puja Kit", w:"1 Kg", bp:299, spec:{ items:"12+ items", type:"Complete Kit" } },
    { base:"Durga Puja Kit", w:"2 Kg", bp:549, spec:{ items:"22+ items", type:"Complete Kit" } },
    { base:"Kaal Sarp Dosh Kit", w:"2.5 Kg", bp:899, spec:{ items:"28+ items", type:"Specialized Kit" } },
    { base:"Pind Daan Kit (Gaya)", w:"3 Kg", bp:999, spec:{ items:"30+ items", type:"Specialized Kit" } },
    { base:"Namkaran Sanskar Kit", w:"1 Kg", bp:399, spec:{ items:"15+ items", type:"Complete Kit" } },
    { base:"Mundan Sanskar Kit", w:"1 Kg", bp:349, spec:{ items:"12+ items", type:"Complete Kit" } },
    { base:"Tulsi Vivah Puja Kit", w:"1 Kg", bp:299, spec:{ items:"12+ items", type:"Complete Kit" } },
  ],
  "essentials": [
    { base:"Pure Akshat (Sacred Rice)", w:"500 gm", bp:99, spec:{ type:"Rice", purity:"100% Natural" } },
    { base:"Kumkum Powder (Roli)", w:"100 gm", bp:49, spec:{ type:"Powder", color:"Red" } },
    { base:"Chandan Tika (Sandalwood)", w:"50 gm", bp:149, spec:{ type:"Paste", origin:"Mysore" } },
    { base:"Sindoor", w:"50 gm", bp:69, spec:{ type:"Powder", color:"Orange-Red" } },
    { base:"Mouli (Sacred Thread)", w:"50 gm", bp:29, spec:{ type:"Thread", material:"Cotton" } },
    { base:"Supari (Betel Nut)", w:"250 gm", bp:89, spec:{ type:"Nut", quality:"Premium" } },
    { base:"Laung (Cloves)", w:"100 gm", bp:129, spec:{ type:"Spice", grade:"A" } },
    { base:"Elaichi (Cardamom)", w:"50 gm", bp:149, spec:{ type:"Spice", grade:"Premium" } },
    { base:"Mishri (Rock Sugar)", w:"250 gm", bp:79, spec:{ type:"Sugar", purity:"Natural" } },
    { base:"Paan Patta (Betel Leaves)", w:"25 Leaves", bp:49, spec:{ type:"Leaves", freshness:"Fresh" } },
    { base:"Coconut (Nariyal)", w:"1 Piece", bp:39, spec:{ type:"Whole", quality:"Premium" } },
    { base:"Panchamrit Set", w:"250 ml", bp:199, spec:{ items:"Milk, Curd, Honey, Sugar, Ghee" } },
    { base:"Vibhuti (Sacred Ash)", w:"100 gm", bp:99, spec:{ type:"Ash", source:"Yagya Ash" } },
    { base:"Janeu (Sacred Thread)", w:"1 Set (5)", bp:49, spec:{ type:"Thread", material:"Cotton" } },
    { base:"Rakshasutra (Protection Thread)", w:"1 Pack", bp:29, spec:{ type:"Thread", blessed:true } },
    { base:"Rangoli Powder Set", w:"6 Colors", bp:149, spec:{ colors:6, type:"Powder" } },
  ],
  "ghee-oils": [
    { base:"Pure Desi Cow Ghee (A2)", w:"500 gm", bp:449, spec:{ type:"A2 Cow Ghee", method:"Bilona" } },
    { base:"Pure Desi Cow Ghee (A2)", w:"1 Kg", bp:849, spec:{ type:"A2 Cow Ghee", method:"Bilona" } },
    { base:"Havan Grade Ghee", w:"1 Kg", bp:599, spec:{ type:"Cow Ghee", grade:"Havan" } },
    { base:"Til (Sesame) Oil", w:"500 ml", bp:199, spec:{ type:"Cold-pressed", seed:"Black Sesame" } },
    { base:"Mustard Oil (Puja Grade)", w:"500 ml", bp:149, spec:{ type:"Cold-pressed", grade:"Puja" } },
    { base:"Coconut Oil (Virgin)", w:"500 ml", bp:249, spec:{ type:"Virgin Cold-pressed" } },
    { base:"Panchamrit Ghee", w:"250 gm", bp:299, spec:{ type:"Infused Ghee", use:"Panchamrit" } },
    { base:"Diya Oil (Jasmine)", w:"500 ml", bp:179, spec:{ type:"Fragrant Oil", fragrance:"Jasmine" } },
    { base:"Diya Oil (Rose)", w:"500 ml", bp:179, spec:{ type:"Fragrant Oil", fragrance:"Rose" } },
    { base:"Camphor Oil", w:"100 ml", bp:199, spec:{ type:"Essential Oil", purity:"100%" } },
  ],
  "flowers-garlands": [
    { base:"Marigold Garland (Orange)", w:"1 Piece", bp:49, spec:{ flower:"Marigold", length:"3 ft" } },
    { base:"Rose Garland (Red)", w:"1 Piece", bp:99, spec:{ flower:"Rose", length:"3 ft" } },
    { base:"Mogra (Jasmine) Garland", w:"1 Piece", bp:79, spec:{ flower:"Mogra", length:"2 ft" } },
    { base:"Lotus Flowers (Kamal)", w:"5 Pieces", bp:149, spec:{ flower:"Lotus", freshness:"Fresh" } },
    { base:"Bilva Patra (Bael Leaves)", w:"108 Pieces", bp:99, spec:{ leaf:"Bilva", count:108 } },
    { base:"Durva Grass Bundle", w:"1 Bundle", bp:29, spec:{ type:"Grass", use:"Ganesh Puja" } },
    { base:"Dried Rose Petals", w:"200 gm", bp:149, spec:{ type:"Dried", flower:"Rose" } },
    { base:"Chameli (Jasmine) Flowers", w:"100 gm", bp:79, spec:{ flower:"Chameli", state:"Fresh" } },
    { base:"Tulsi Mala (Basil Garland)", w:"1 Piece", bp:49, spec:{ material:"Tulsi", beads:108 } },
    { base:"Mixed Flower Basket (Puja)", w:"500 gm", bp:199, spec:{ type:"Mixed", items:"5+ types" } },
    { base:"Saffron Flowers (Kesar)", w:"1 gm", bp:299, spec:{ flower:"Crocus", grade:"Premium" } },
    { base:"Ashoka Leaves", w:"25 Leaves", bp:49, spec:{ leaf:"Ashoka", use:"Decoration" } },
  ],
  "havan-items": [
    { base:"Premium Havan Samagri Mix", w:"500 gm", bp:199, spec:{ herbs:"36+", type:"Premium Mix" } },
    { base:"Premium Havan Samagri Mix", w:"1 Kg", bp:349, spec:{ herbs:"36+", type:"Premium Mix" } },
    { base:"Premium Havan Samagri Mix", w:"2 Kg", bp:649, spec:{ herbs:"36+", type:"Premium Mix" } },
    { base:"Aam (Mango) Wood Sticks", w:"1 Kg", bp:149, spec:{ wood:"Mango", cut:"Sticks" } },
    { base:"Peepal Wood Samidha", w:"500 gm", bp:129, spec:{ wood:"Peepal", type:"Samidha" } },
    { base:"Guggul Dhoop", w:"100 gm", bp:149, spec:{ type:"Resin", purity:"Pure" } },
    { base:"Loban (Frankincense)", w:"100 gm", bp:129, spec:{ type:"Resin", origin:"Arabic" } },
    { base:"Kapoor (Camphor) Tablets", w:"50 gm", bp:79, spec:{ type:"Tablets", purity:"100%" } },
    { base:"Black Sesame (Kala Til)", w:"500 gm", bp:99, spec:{ type:"Seeds", color:"Black" } },
    { base:"Jau (Barley) for Havan", w:"500 gm", bp:69, spec:{ type:"Grain", use:"Havan" } },
    { base:"Navagraha Samidha Set", w:"1 Kg", bp:299, spec:{ types:9, use:"Navagraha Havan" } },
    { base:"Havan Kund (Copper Small)", w:"1 Piece", bp:999, spec:{ material:"Copper", size:"Small (6x6)" } },
    { base:"Havan Kund (Copper Medium)", w:"1 Piece", bp:1999, spec:{ material:"Copper", size:"Medium (9x9)" } },
    { base:"Havan Kund (Copper Large)", w:"1 Piece", bp:3999, spec:{ material:"Copper", size:"Large (12x12)" } },
  ],
  "diyas-lamps": [
    { base:"Brass Diya (Small)", w:"100 gm", bp:149, spec:{ material:"Brass", size:"Small" } },
    { base:"Brass Diya (Medium)", w:"200 gm", bp:249, spec:{ material:"Brass", size:"Medium" } },
    { base:"Brass Akhand Diya", w:"500 gm", bp:499, spec:{ material:"Brass", type:"Akhand" } },
    { base:"Silver Diya (Pure 925)", w:"30 gm", bp:1999, spec:{ material:"Silver 925", purity:"92.5%" } },
    { base:"Terracotta Diya Set (21)", w:"500 gm", bp:99, spec:{ material:"Clay", count:21 } },
    { base:"Terracotta Diya Set (51)", w:"1 Kg", bp:199, spec:{ material:"Clay", count:51 } },
    { base:"Brass Puja Lamp (5 Wicks)", w:"300 gm", bp:399, spec:{ material:"Brass", wicks:5 } },
    { base:"Hanging Brass Lamp", w:"1 Kg", bp:899, spec:{ material:"Brass", type:"Hanging" } },
    { base:"Electric Diya LED", w:"200 gm", bp:249, spec:{ type:"LED", battery:"Included" } },
    { base:"Ghee Diya Cotton Wicks", w:"100 Pieces", bp:49, spec:{ material:"Cotton", count:100 } },
    { base:"Brass Panch Mukhi Diya", w:"400 gm", bp:599, spec:{ material:"Brass", faces:5 } },
    { base:"Designer Terracotta Diya Set", w:"600 gm", bp:249, spec:{ material:"Terracotta", count:11 } },
  ],
  "idols-murtis": [
    { base:"Ganesh Murti (Brass, 6 inch)", w:"800 gm", bp:1499, spec:{ material:"Brass", height:"6 inch" } },
    { base:"Ganesh Murti (Brass, 8 inch)", w:"1.2 Kg", bp:2499, spec:{ material:"Brass", height:"8 inch" } },
    { base:"Lakshmi Murti (Brass, 6 inch)", w:"700 gm", bp:1399, spec:{ material:"Brass", height:"6 inch" } },
    { base:"Lakshmi-Ganesh Set (Brass)", w:"1.5 Kg", bp:2999, spec:{ material:"Brass", type:"Pair" } },
    { base:"Shivling (Narmadeshwar)", w:"500 gm", bp:499, spec:{ material:"Natural Stone", origin:"Narmada" } },
    { base:"Shivling (Narmadeshwar Large)", w:"2 Kg", bp:1499, spec:{ material:"Natural Stone", origin:"Narmada" } },
    { base:"Hanuman Murti (Brass, 6 inch)", w:"600 gm", bp:1299, spec:{ material:"Brass", height:"6 inch" } },
    { base:"Krishna Murti (Brass, 6 inch)", w:"500 gm", bp:1299, spec:{ material:"Brass", height:"6 inch" } },
    { base:"Ram Darbar Set (Brass)", w:"3 Kg", bp:4999, spec:{ material:"Brass", figures:4 } },
    { base:"Durga Murti (Brass, 8 inch)", w:"1.5 Kg", bp:2999, spec:{ material:"Brass", height:"8 inch" } },
    { base:"Saraswati Murti (Marble, 8 inch)", w:"2 Kg", bp:2499, spec:{ material:"Marble", height:"8 inch" } },
    { base:"Nandi Murti (Brass)", w:"300 gm", bp:799, spec:{ material:"Brass", height:"3 inch" } },
    { base:"Vishnu Murti (Brass, 6 inch)", w:"700 gm", bp:1499, spec:{ material:"Brass", height:"6 inch" } },
    { base:"Radha-Krishna Pair (Brass)", w:"1.2 Kg", bp:2499, spec:{ material:"Brass", figures:2 } },
    { base:"Nataraja Shiva (Brass, 8 inch)", w:"1.5 Kg", bp:2999, spec:{ material:"Brass", height:"8 inch" } },
    { base:"Bal Gopal Murti (Silver)", w:"20 gm", bp:2999, spec:{ material:"Silver", height:"2 inch" } },
  ],
  "yantras": [
    { base:"Shri Yantra (Brass)", w:"200 gm", bp:499, spec:{ material:"Brass", type:"Engraved" } },
    { base:"Shri Yantra (Copper)", w:"150 gm", bp:699, spec:{ material:"Copper", type:"Engraved" } },
    { base:"Shri Yantra (Silver)", w:"50 gm", bp:3999, spec:{ material:"Silver", type:"Embossed" } },
    { base:"Kuber Yantra (Brass)", w:"200 gm", bp:399, spec:{ material:"Brass", purpose:"Wealth" } },
    { base:"Navagraha Yantra", w:"250 gm", bp:599, spec:{ material:"Brass", planets:9 } },
    { base:"Baglamukhi Yantra", w:"200 gm", bp:499, spec:{ material:"Copper", purpose:"Victory" } },
    { base:"Maha Mrityunjaya Yantra", w:"200 gm", bp:499, spec:{ material:"Copper", purpose:"Health" } },
    { base:"Vastu Yantra", w:"250 gm", bp:499, spec:{ material:"Brass", purpose:"Vastu correction" } },
    { base:"Kaal Sarp Yantra", w:"200 gm", bp:599, spec:{ material:"Copper", purpose:"Dosh Nivaran" } },
    { base:"Saraswati Yantra", w:"150 gm", bp:399, spec:{ material:"Brass", purpose:"Education" } },
    { base:"Santan Gopal Yantra", w:"150 gm", bp:499, spec:{ material:"Copper", purpose:"Fertility" } },
    { base:"Vyapar Vriddhi Yantra", w:"200 gm", bp:499, spec:{ material:"Brass", purpose:"Business" } },
  ],
  "rudraksha-gems": [
    { base:"1 Mukhi Rudraksha (Nepal)", w:"5 gm", bp:21000, spec:{ faces:1, origin:"Nepal", certification:"Lab Certified" } },
    { base:"5 Mukhi Rudraksha", w:"5 gm", bp:199, spec:{ faces:5, origin:"Nepal", certification:"Authentic" } },
    { base:"5 Mukhi Rudraksha Mala (108+1)", w:"80 gm", bp:1499, spec:{ faces:5, beads:109, origin:"Nepal" } },
    { base:"Gauri Shankar Rudraksha", w:"10 gm", bp:2999, spec:{ type:"Gauri Shankar", origin:"Nepal" } },
    { base:"Rudraksha Bracelet (5 Mukhi)", w:"20 gm", bp:499, spec:{ faces:5, type:"Bracelet", beads:12 } },
    { base:"Natural Yellow Sapphire (Pukhraj)", w:"3 Ct", bp:5999, spec:{ gem:"Yellow Sapphire", planet:"Jupiter" } },
    { base:"Natural Blue Sapphire (Neelam)", w:"3 Ct", bp:7999, spec:{ gem:"Blue Sapphire", planet:"Saturn" } },
    { base:"Natural Ruby (Manik)", w:"3 Ct", bp:4999, spec:{ gem:"Ruby", planet:"Sun" } },
    { base:"Natural Pearl (Moti)", w:"5 Ct", bp:2999, spec:{ gem:"Pearl", planet:"Moon" } },
    { base:"Natural Emerald (Panna)", w:"3 Ct", bp:4999, spec:{ gem:"Emerald", planet:"Mercury" } },
    { base:"Red Coral (Moonga)", w:"5 Ct", bp:1999, spec:{ gem:"Coral", planet:"Mars" } },
    { base:"Cat's Eye (Lehsunia)", w:"5 Ct", bp:2999, spec:{ gem:"Cat's Eye", planet:"Ketu" } },
    { base:"Hessonite (Gomed)", w:"5 Ct", bp:1999, spec:{ gem:"Hessonite", planet:"Rahu" } },
    { base:"Navaratna Ring (9 Gems)", w:"10 gm", bp:9999, spec:{ gems:9, material:"Silver", type:"Ring" } },
  ],
  "incense-dhoop": [
    { base:"Premium Agarbatti (Chandan)", w:"100 Sticks", bp:99, spec:{ fragrance:"Sandalwood", sticks:100 } },
    { base:"Premium Agarbatti (Mogra)", w:"100 Sticks", bp:89, spec:{ fragrance:"Jasmine", sticks:100 } },
    { base:"Premium Agarbatti (Rose)", w:"100 Sticks", bp:89, spec:{ fragrance:"Rose", sticks:100 } },
    { base:"Premium Agarbatti (Guggul)", w:"100 Sticks", bp:99, spec:{ fragrance:"Guggul", sticks:100 } },
    { base:"Premium Agarbatti (Loban)", w:"100 Sticks", bp:99, spec:{ fragrance:"Loban", sticks:100 } },
    { base:"Dhoop Sticks (Chandan)", w:"20 Sticks", bp:79, spec:{ fragrance:"Sandalwood", type:"Dhoop" } },
    { base:"Dhoop Sticks (Guggul)", w:"20 Sticks", bp:79, spec:{ fragrance:"Guggul", type:"Dhoop" } },
    { base:"Dhoop Cones (Mixed)", w:"50 Cones", bp:129, spec:{ type:"Cones", count:50 } },
    { base:"Pure Camphor (Kapoor)", w:"100 gm", bp:149, spec:{ type:"Camphor", purity:"100%" } },
    { base:"Loban Crystals", w:"100 gm", bp:129, spec:{ type:"Resin", origin:"Arabic" } },
    { base:"Guggul Dhoop (Pure)", w:"100 gm", bp:149, spec:{ type:"Resin", purity:"Pure" } },
    { base:"Sambrani Cups", w:"12 Cups", bp:99, spec:{ type:"Cups", fragrance:"Traditional" } },
    { base:"Hawan Dhoop (Cone)", w:"20 Cones", bp:99, spec:{ type:"Cone", use:"Havan" } },
    { base:"Agarbatti Variety Pack (6 Fragrances)", w:"600 Sticks", bp:399, spec:{ fragrances:6, sticks:600 } },
  ],
  "puja-cloth": [
    { base:"Red Chunri (Puja Cloth)", w:"1 Piece", bp:99, spec:{ color:"Red", size:"1.5m x 1m" } },
    { base:"Yellow Puja Cloth", w:"1 Piece", bp:79, spec:{ color:"Yellow", size:"1.5m x 1m" } },
    { base:"White Puja Cloth", w:"1 Piece", bp:69, spec:{ color:"White", size:"1.5m x 1m" } },
    { base:"Velvet Puja Asana (Red)", w:"300 gm", bp:299, spec:{ material:"Velvet", color:"Red" } },
    { base:"Velvet Puja Asana (Maroon)", w:"300 gm", bp:299, spec:{ material:"Velvet", color:"Maroon" } },
    { base:"Silk Puja Cloth (Red)", w:"200 gm", bp:499, spec:{ material:"Silk", color:"Red" } },
    { base:"Deity Vastra Set (Small)", w:"100 gm", bp:149, spec:{ type:"Deity Dress", size:"Small" } },
    { base:"Deity Vastra Set (Medium)", w:"150 gm", bp:249, spec:{ type:"Deity Dress", size:"Medium" } },
    { base:"Havan Kund Cloth Cover", w:"200 gm", bp:149, spec:{ type:"Cover", material:"Cotton" } },
    { base:"Singhasan Cloth (Gold Border)", w:"200 gm", bp:399, spec:{ type:"Throne Cloth", border:"Gold" } },
  ],
  "puja-utensils": [
    { base:"Copper Kalash (Small)", w:"300 gm", bp:499, spec:{ material:"Copper", size:"Small" } },
    { base:"Copper Kalash (Medium)", w:"500 gm", bp:799, spec:{ material:"Copper", size:"Medium" } },
    { base:"Brass Puja Thali Set", w:"500 gm", bp:699, spec:{ material:"Brass", items:"Thali + accessories" } },
    { base:"Copper Lota (Water Vessel)", w:"200 gm", bp:349, spec:{ material:"Copper", type:"Lota" } },
    { base:"Brass Achmani (Spoon)", w:"50 gm", bp:149, spec:{ material:"Brass", type:"Spoon" } },
    { base:"Brass Puja Bell", w:"200 gm", bp:299, spec:{ material:"Brass", type:"Bell" } },
    { base:"Conch Shell (Shankh)", w:"300 gm", bp:399, spec:{ material:"Natural Shell", type:"Right-hand" } },
    { base:"Brass Aarti Stand", w:"300 gm", bp:399, spec:{ material:"Brass", wicks:5 } },
    { base:"Copper Panchpatra", w:"250 gm", bp:449, spec:{ material:"Copper", type:"Panchpatra" } },
    { base:"Brass Pooja Chowki (Wooden Top)", w:"1 Kg", bp:599, spec:{ material:"Brass+Wood", type:"Chowki" } },
    { base:"Silver Achmani (Pure 925)", w:"20 gm", bp:1499, spec:{ material:"Silver 925", type:"Spoon" } },
    { base:"Brass Incense Holder", w:"150 gm", bp:199, spec:{ material:"Brass", type:"Stand" } },
  ],
  "sacred-threads": [
    { base:"Janeu (Yagnopavit) 5-Pack", w:"20 gm", bp:49, spec:{ material:"Cotton", count:5 } },
    { base:"Mauli (Kalava) Roll", w:"50 gm", bp:29, spec:{ material:"Cotton", type:"Roll" } },
    { base:"Tulsi Mala (108+1 beads)", w:"30 gm", bp:249, spec:{ material:"Tulsi Wood", beads:109 } },
    { base:"Rudraksha Mala (5 Mukhi)", w:"80 gm", bp:1499, spec:{ material:"Rudraksha", beads:109 } },
    { base:"Sandalwood Mala (Chandan)", w:"40 gm", bp:999, spec:{ material:"Sandalwood", beads:108 } },
    { base:"Crystal (Sphatik) Mala", w:"60 gm", bp:799, spec:{ material:"Crystal", beads:108 } },
    { base:"Vaijayanti Mala", w:"30 gm", bp:299, spec:{ material:"Vaijayanti Seeds", beads:108 } },
    { base:"Lotus Seed (Kamal Gatta) Mala", w:"50 gm", bp:249, spec:{ material:"Lotus Seeds", beads:108 } },
    { base:"Neem Wood Mala", w:"40 gm", bp:199, spec:{ material:"Neem Wood", beads:108 } },
    { base:"Black Hakik Mala", w:"80 gm", bp:399, spec:{ material:"Agate", color:"Black", beads:108 } },
    { base:"White Hakik Mala", w:"80 gm", bp:349, spec:{ material:"Agate", color:"White", beads:108 } },
    { base:"Navaratan Bracelet", w:"25 gm", bp:1999, spec:{ gems:9, type:"Bracelet" } },
  ],
  "herbs-powders": [
    { base:"Pure Chandan Powder (Sandalwood)", w:"50 gm", bp:249, spec:{ origin:"Mysore", grade:"A" } },
    { base:"Haldi (Turmeric) Powder (Puja)", w:"100 gm", bp:49, spec:{ type:"Puja Grade", organic:true } },
    { base:"Kumkum Powder (Premium)", w:"50 gm", bp:49, spec:{ type:"Premium", color:"Dark Red" } },
    { base:"Sindoor (Orange)", w:"50 gm", bp:59, spec:{ type:"Traditional", color:"Orange" } },
    { base:"Vibhuti (Bhasma)", w:"100 gm", bp:99, spec:{ source:"Sacred Ash", type:"Fine" } },
    { base:"Abir Gulal (Colors)", w:"200 gm", bp:99, spec:{ colors:"Assorted", use:"Puja/Holi" } },
    { base:"Gopichand (Yellow Clay)", w:"100 gm", bp:49, spec:{ type:"Clay", use:"Tilak" } },
    { base:"Ashtagandha Powder", w:"50 gm", bp:149, spec:{ ingredients:8, use:"Tilak/Puja" } },
    { base:"Javadhu Powder (South Indian)", w:"50 gm", bp:199, spec:{ type:"Fragrant Powder", origin:"South" } },
    { base:"Neem Leaves (Dried)", w:"100 gm", bp:49, spec:{ type:"Dried Herb", use:"Purification" } },
    { base:"Tulsi Leaves (Dried)", w:"100 gm", bp:79, spec:{ type:"Dried Herb", use:"Puja/Medicine" } },
    { base:"Bhimseni Kapoor (Camphor)", w:"50 gm", bp:199, spec:{ type:"Natural Camphor", purity:"100%" } },
  ],
  "books-granths": [
    { base:"Shrimad Bhagavad Gita (Hindi)", w:"300 gm", bp:199, spec:{ language:"Hindi", publisher:"Gita Press" } },
    { base:"Shrimad Bhagavad Gita (Sanskrit-Hindi)", w:"500 gm", bp:299, spec:{ language:"Sanskrit-Hindi", publisher:"Gita Press" } },
    { base:"Ramcharitmanas (Complete)", w:"800 gm", bp:399, spec:{ language:"Awadhi-Hindi", publisher:"Gita Press" } },
    { base:"Sundarkand (Pocket)", w:"100 gm", bp:49, spec:{ language:"Hindi", type:"Pocket" } },
    { base:"Hanuman Chalisa (Deluxe)", w:"100 gm", bp:99, spec:{ language:"Hindi", type:"Deluxe" } },
    { base:"Durga Saptashati", w:"300 gm", bp:199, spec:{ language:"Sanskrit-Hindi" } },
    { base:"Satyanarayan Vrat Katha", w:"50 gm", bp:29, spec:{ language:"Hindi", type:"Booklet" } },
    { base:"Shiv Puran", w:"600 gm", bp:349, spec:{ language:"Hindi", publisher:"Gita Press" } },
    { base:"Garud Puran", w:"500 gm", bp:299, spec:{ language:"Hindi" } },
    { base:"Vishnu Sahasranama", w:"150 gm", bp:99, spec:{ language:"Sanskrit-Hindi" } },
    { base:"Lalita Sahasranama", w:"150 gm", bp:99, spec:{ language:"Sanskrit-Hindi" } },
    { base:"Puja Vidhi Book (Complete)", w:"200 gm", bp:149, spec:{ language:"Hindi", rituals:"50+" } },
    { base:"Bhagwat Puran (Complete)", w:"1 Kg", bp:599, spec:{ language:"Hindi", volumes:2 } },
    { base:"Devi Bhagwat Puran", w:"600 gm", bp:399, spec:{ language:"Hindi" } },
  ],
};

// Generate quality variations for each product
const qualityTiers = ["Standard", "Premium", "Deluxe"];

function generateProducts() {
  const products = [];
  let counter = 1;
  const usedSlugs = new Set();

  function uniqueSlug(base) {
    let s = slug(base);
    if (usedSlugs.has(s)) { s = s + '-' + counter; }
    usedSlugs.add(s);
    return s;
  }

  for (const [catId, templates] of Object.entries(productTemplates)) {
    for (const t of templates) {
      // Base product
      const id = `sp-${counter}`;
      const s = uniqueSlug(t.base);
      const originalPrice = price(t.bp * 1.4);
      products.push({
        id,
        name: t.base,
        slug: s,
        category_id: catId,
        price: t.bp,
        original_price: originalPrice,
        description: `High-quality ${t.base} for authentic Vedic pujas and rituals. Sourced from trusted suppliers and quality-checked by our experts.`,
        long_description: `${t.base} is an essential item for Hindu puja rituals. Our product is carefully sourced from trusted suppliers across India, ensuring authenticity and purity. Each item goes through a quality check before dispatch.\n\nWhether you're performing a simple daily puja or a grand ceremony, this ${t.base.toLowerCase()} meets the highest standards of Vedic requirements. Made with traditional methods and blessed for sacred use.\n\nShubhKarma guarantees 100% authentic puja materials — if you find any quality issue, we offer a full replacement.`,
        puja_tags: getPujaTags(catId, t.base),
        weight: t.w,
        image_url: `/assets/samagri/${s}.jpg`,
        images: [`/assets/samagri/${s}-1.jpg`, `/assets/samagri/${s}-2.jpg`],
        in_stock: true,
        rating: (4.3 + Math.random() * 0.6).toFixed(1),
        reviews: rand(15, 300),
        featured: counter % 7 === 0,
        specifications: t.spec || {},
        purity_info: `100% authentic and pure. Verified by ShubhKarma quality team. Sourced from traditional suppliers.`,
        sourcing_details: `Sourced from verified suppliers across India — Varanasi, Haridwar, Rishikesh, and regional specialists.`,
        usage_instructions: `Use as directed by your Pandit during the puja ceremony. Store in a clean, dry place. Handle with respect and devotion.`,
        storage_info: `Store in a cool, dry place away from direct sunlight. Keep in original packaging until use.`,
        certifications: ["ShubhKarma Verified", "Purity Guaranteed"],
        ingredients: [],
        shelf_life: catId === "flowers-garlands" ? "2-3 Days" : catId === "ghee-oils" ? "6 Months" : "12+ Months",
        sku: `SK-${catId.toUpperCase().slice(0,3)}-${String(counter).padStart(4, '0')}`,
        brand: "ShubhKarma",
        benefits: [`Premium quality ${t.base.toLowerCase()}`, "100% authentic and pure", "Quality checked before dispatch", "Suitable for all Vedic ceremonies"],
      });
      counter++;
    }
  }

  // Generate additional variants to reach 1000+
  const extraVariants = [
    { cat:"puja-kits", names:["Vastu Shanti Kit","Mangal Dosh Kit","Shani Shanti Kit","Rahu-Ketu Kit","Budh Graha Kit","Guru Graha Kit","Shukra Graha Kit","Chandra Graha Kit","Surya Graha Kit","Baglamukhi Kit","Kali Puja Kit","Bhairav Puja Kit","Gayatri Havan Kit","Saraswati Puja Kit","Vishnu Puja Kit","Shiv Abhishek Kit (Premium)","Dhanvantari Puja Kit","Santan Gopal Kit","Mahalakshmi Vrat Kit","Chhath Puja Kit","Karva Chauth Kit","Makar Sankranti Kit","Annaprashan Kit","Upanayana Kit","Vidyarambh Kit","Engagement Kit","Ram Navami Kit","Janmashtami Kit","Shivratri Kit","Holika Dahan Kit","Shraddh Karma Kit","Tarpan Kit","Narayan Bali Kit","Maha Rudrabhishek Kit","Akhand Ramayan Kit","Devi Bhagwat Kit","Sri Sukta Havan Kit","Ashta Lakshmi Kit","Kanakdhara Kit","Vyapar Vriddhi Kit"], bp:[799,699,549,549,449,449,449,449,449,899,899,599,449,399,449,799,549,699,399,349,299,249,349,499,249,599,349,349,449,249,499,349,799,999,599,599,549,799,449,549], w:["2 Kg","2.5 Kg","2 Kg","2 Kg","1.5 Kg","1.5 Kg","1.5 Kg","1.5 Kg","1.5 Kg","2.5 Kg","2.5 Kg","2 Kg","1.5 Kg","1.5 Kg","1.5 Kg","3 Kg","2 Kg","2 Kg","1.5 Kg","1.5 Kg","1 Kg","1 Kg","1 Kg","2 Kg","1 Kg","3 Kg","1.5 Kg","1.5 Kg","2 Kg","1 Kg","2 Kg","1.5 Kg","3 Kg","3 Kg","2 Kg","2 Kg","2 Kg","2.5 Kg","1.5 Kg","2 Kg"] },
    { cat:"essentials", names:["Dry Fruits Prasad Mix","Ilaichi Dana","Kesar (Saffron) 1gm","Kesar (Saffron) 2gm","Makhana (Fox Nuts)","Dry Dates (Chuara)","Honey (Pure Raw)","Sugar Candy (Batasha)","Jaggery (Gur)","Sesame Laddu","Panjiri Mix","Ganga Jal (200ml)","Ganga Jal (500ml)","Yamuna Jal","Holy Water Set (5 Rivers)","Tulsi Ark","Rose Water (Gulab Jal)","Kewra Water","Ittar (Attar) Rose","Ittar (Attar) Chandan"], bp:[299,99,349,649,149,99,199,49,39,129,149,49,99,79,249,99,69,69,199,249], w:["500 gm","100 gm","1 gm","2 gm","250 gm","250 gm","250 gm","250 gm","250 gm","250 gm","250 gm","200 ml","500 ml","200 ml","500 ml","100 ml","200 ml","200 ml","10 ml","10 ml"] },
    { cat:"idols-murtis", names:["Ganesh Murti (Marble 10 inch)","Lakshmi Murti (Marble 10 inch)","Bal Gopal (Brass)","Laddu Gopal Set","Shiv Parivar Set (Brass)","Hanuman Flying Pose (Brass 8 inch)","Ganesh Murti (Silver 3 inch)","Lakshmi Murti (Silver 3 inch)","Tirupati Balaji (Brass)","Jagannath Set (Wood)","Sai Baba Murti (Marble)","Ganesha (Eco-Friendly Clay)","Durga Murti (Marble 12 inch)","Mahavir Swami Murti","Buddha Murti (Brass)","Ganesh Murti (Crystal)","Shivling (Parad Mercury)","Navagraha Set (Brass)","Kartikeya Murti (Brass)","Ashta Lakshmi Panel (Brass)"], bp:[3999,3999,899,1299,5999,2999,4999,4999,2499,1999,2499,299,5999,1999,1999,1499,3999,2999,1999,4999], w:["3 Kg","3 Kg","400 gm","800 gm","4 Kg","1.5 Kg","100 gm","100 gm","1 Kg","500 gm","2 Kg","500 gm","5 Kg","1 Kg","1 Kg","300 gm","200 gm","2 Kg","800 gm","3 Kg"] },
    { cat:"rudraksha-gems", names:["2 Mukhi Rudraksha","3 Mukhi Rudraksha","4 Mukhi Rudraksha","6 Mukhi Rudraksha","7 Mukhi Rudraksha","8 Mukhi Rudraksha","9 Mukhi Rudraksha","10 Mukhi Rudraksha","11 Mukhi Rudraksha","14 Mukhi Rudraksha","Ganesh Rudraksha","Rudraksha Bracelet (Mix)","Diamond (Heera) 0.5 Ct","Natural Turquoise (Firoza)","Tiger Eye Stone","Amethyst Stone","Moonstone","Lapis Lazuli","Rose Quartz","Navratna Pendant"], bp:[999,499,399,299,499,799,1499,1999,2999,9999,3999,699,14999,999,499,699,799,599,499,7999], w:["5 gm","5 gm","5 gm","5 gm","5 gm","5 gm","5 gm","5 gm","5 gm","5 gm","8 gm","25 gm","0.5 Ct","5 Ct","10 Ct","5 Ct","5 Ct","10 Ct","10 Ct","15 gm"] },
    { cat:"havan-items", names:["Havan Samagri (Economy 500gm)","Havan Samagri (Premium 5 Kg)","Chandan Wood Sticks","Palash Wood Samidha","Devdaru Wood","Havan Kund Brick (Fire-safe)","Ghee Pouch for Havan (100 gm x 10)","Navagraha Dravya Set","Agnihotra Kit (Daily)","Dried Cow Dung Cakes (10)","Dried Cow Dung Cakes (21)","Havan Spoon (Sruk Sruva Brass)","Ajwain Seeds for Havan","Dry Coconut Halves","Mulethi (Liquorice) Sticks","Bel Wood (Bilva)","Bamboo Samica","Ghee Wicks (50 pieces)","Samagri Combo (3 Kg Mix)","Guggul + Loban + Camphor Combo"], bp:[99,1199,199,149,149,499,499,399,299,99,179,599,99,99,129,149,79,99,499,299], w:["500 gm","5 Kg","500 gm","500 gm","500 gm","5 Kg","1 Kg","1 Kg","500 gm","500 gm","1 Kg","200 gm","250 gm","500 gm","200 gm","500 gm","500 gm","50 Pieces","3 Kg","300 gm"] },
    { cat:"yantras", names:["Surya Yantra (Copper)","Chandra Yantra (Silver)","Mangal Yantra (Copper)","Budh Yantra (Brass)","Guru Yantra (Gold-plated)","Shukra Yantra (Silver)","Shani Yantra (Iron)","Rahu Yantra (Copper)","Ketu Yantra (Copper)","Gayatri Yantra (Copper)","Durga Yantra (Copper)","Hanuman Yantra (Copper)","Mahalakshmi Yantra (Brass)","Kali Yantra (Copper)","Tara Yantra (Silver)","Yantra Frame Set (9 Planets)","Shri Yantra 3D (Brass)","Meru Shri Yantra (Crystal)","Saraswati Yantra (Copper)","Sudarshan Yantra (Brass)"], bp:[399,1999,399,349,2999,1999,299,499,499,499,499,399,599,599,2499,3999,1499,2999,449,499], w:["150 gm","50 gm","150 gm","150 gm","100 gm","50 gm","200 gm","150 gm","150 gm","150 gm","150 gm","150 gm","200 gm","150 gm","50 gm","1 Kg","500 gm","300 gm","150 gm","200 gm"] },
    { cat:"diyas-lamps", names:["Brass Deep Jyoti (7 Wicks)","Silver Aarti Diya","Brass Kamal Diya","Brass Naga Diya","Copper Diya (Small)","Copper Diya (Medium)","Floating Diyas (Set of 12)","Brass Oil Lamp (South Indian)","Brass Samai (Tall Lamp)","Crystal Diya","Decorative Lantern (Brass)","T-Light Holders (Set of 6)","Brass Deepak Stand (5 Tier)","LED Jyoti (Long Life)","Ghee Lamp (Automated)"], bp:[699,2999,499,599,249,399,199,799,1499,999,1299,399,1999,349,699], w:["300 gm","50 gm","250 gm","300 gm","150 gm","250 gm","200 gm","600 gm","1 Kg","200 gm","800 gm","300 gm","1.5 Kg","200 gm","500 gm"] },
    { cat:"incense-dhoop", names:["Natural Cow Dung Dhoop","Havan Cup Sambrani (30 cups)","Nag Champa Agarbatti","Patchouli Agarbatti","Tulsi Agarbatti","Lavender Agarbatti","Cedar Wood Agarbatti","Mysore Sandal Premium","Organic Herbal Dhoop","Camphor Tablets (100 gm)","Premium Resin Set (4 types)","Temple Grade Dhoop Sticks","Meditation Incense Pack","Ayurvedic Dhoop (12 Herbs)","Mosquito Repellent Agarbatti"], bp:[79,149,79,79,69,79,89,199,129,99,399,149,249,179,99], w:["20 Sticks","30 Cups","100 Sticks","100 Sticks","100 Sticks","100 Sticks","100 Sticks","50 Sticks","20 Sticks","100 gm","400 gm","20 Sticks","50 Sticks","20 Sticks","100 Sticks"] },
    { cat:"puja-cloth", names:["Embroidered Chunri (Bridal)","Golden Zari Border Cloth","Satin Puja Mat","Dupatta for Navratri","Puja Room Curtain Set","Deity Shawl (Pashmina)","Kalash Cover Cloth","Chowki Cover (Velvet Embroidered)","Temple Runner (Silk)","Toran (Door Hanging)","Bandhanwar (Door Decoration)","Pooja Room Mat (Cotton)"], bp:[299,399,249,199,599,999,99,349,499,199,249,149], w:["200 gm","300 gm","400 gm","200 gm","500 gm","200 gm","50 gm","300 gm","400 gm","100 gm","100 gm","300 gm"] },
    { cat:"puja-utensils", names:["Brass Sindoor Box","Silver Kumkum Box","Copper Water Glass (Puja)","Brass Puja Spoon Set (3)","Panchmukhi Shankh","Dakshinavarti Shankh","Brass Sindoor Dani","Copper Plate (Thali)","Brass Aarti Thali (Meenakari)","Silver Kalash (Pure 925)","Brass Puja Ghanti (Large)","Copper Arghya Patra","Brass Tulsi Kyaro","Wooden Chowki (Carved)","Marble Chowki (Premium)","Silver Puja Thali Set","Brass Abhishek Patra","Copper Sombu (South Indian)"], bp:[99,1499,249,349,699,2999,149,399,899,5999,499,399,999,499,999,7999,699,349], w:["50 gm","30 gm","200 gm","150 gm","300 gm","400 gm","50 gm","400 gm","600 gm","200 gm","400 gm","300 gm","2 Kg","1 Kg","3 Kg","300 gm","400 gm","300 gm"] },
    { cat:"herbs-powders", names:["White Chandan Stick","Red Chandan Powder","Multani Mitti (Puja Grade)","Gorochana (Cow Bezoar)","Kasturi (Musk) Powder","Naag Kesar","Kapur Kachri","Reetha (Soapnut)","Amla Powder (Puja)","Shikakai Powder","Bel Patra Powder","Camphor Powder","Chandan Tika (Liquid)","Ashtagandha Tika","Brahmi Powder","Shankhpushpi Powder","Bhasma Set (5 types)","Rang Gulal Set (Navratri)","Herbal Kumkum","Organic Sindoor"], bp:[399,199,49,499,599,149,99,49,49,49,99,179,149,169,99,99,349,149,79,89], w:["50 gm","50 gm","100 gm","10 gm","5 gm","25 gm","50 gm","100 gm","100 gm","100 gm","50 gm","50 gm","50 ml","30 gm","50 gm","50 gm","100 gm","200 gm","50 gm","25 gm"] },
    { cat:"books-granths", names:["Rig Veda (Hindi Translation)","Yajur Veda (Hindi)","Sam Veda (Hindi)","Atharva Veda (Hindi)","Upanishad Collection (11)","Yoga Sutra of Patanjali","Chanakya Niti","Arthashastra","Kautilya's Arthashastra","Vivekachudamani","Brahma Sutra","Ashtavakra Gita","Narada Bhakti Sutra","Srimad Bhagwatam (6 Vol Set)","Valmiki Ramayan (Hindi)","Mahabharat (Hindi Complete)","Skanda Puran (Hindi)","Markandeya Puran","Matsya Puran","Complete Stotra Sangrah"], bp:[499,499,499,499,899,199,99,249,299,199,299,149,149,2999,799,999,499,399,399,249], w:["800 gm","800 gm","600 gm","800 gm","1.5 Kg","200 gm","150 gm","300 gm","400 gm","200 gm","400 gm","200 gm","150 gm","5 Kg","1.2 Kg","2 Kg","700 gm","500 gm","500 gm","400 gm"] },
    { cat:"flowers-garlands", names:["Rajnigandha (Tuberose) Garland","Chrysanthemum Garland","Mixed Phool Mala (Temple Style)","Dried Flower Potpourri","Artificial Marigold Garland (Reusable)","Artificial Rose Strings","Dried Jasmine Flowers","Flower Crown (Mukut)","Bael Fruit (Fresh)","Pomegranate for Puja","Supari with Paan Set","Mango Leaves Bundle","Banana Leaves (5)","Coconut Flower Arrangement","Dried Lotus Petals","Rose Petal Packet (Fresh)","Hibiscus Flowers (Fresh)","Marigold Loose Flowers (1 Kg)","Nagkesar Flowers (Dried)","Champa Flowers (Fresh)"], bp:[69,59,99,199,149,129,99,249,29,39,49,39,29,349,149,79,49,149,129,79], w:["1 Piece","1 Piece","1 Piece","200 gm","1 Piece","5 Strings","50 gm","1 Piece","5 Pieces","5 Pieces","1 Set","1 Bundle","5 Leaves","1 Set","100 gm","200 gm","100 gm","1 Kg","50 gm","200 gm"] },
    { cat:"sacred-threads", names:["Pavitra Ring (Kusha Grass)","Kusha Grass Mat","Moli Thread (Red + Yellow)","Brahma Granthi Thread","Suraksha Kavach Thread","Nav-Dhaaga (9 Thread)","Silk Thread (Puja)","Golden Thread for Deity","Silver Thread for Deity","Coral Mala","Pearl Mala (108)","Parad Mala","Sandalwood Bracelet","Tulsi Bracelet","Rudraksha + Tulsi Combo Mala","Gomti Chakra Set (11)","Haldi (Turmeric) Mala","Kamalgatta Bracelet","Sphatik Shivling","Parad Shivling"], bp:[19,99,39,49,29,49,79,149,299,1999,3999,4999,399,149,999,299,149,129,499,2999], w:["5 gm","200 gm","50 gm","10 gm","10 gm","10 gm","20 gm","5 gm","10 gm","60 gm","80 gm","100 gm","20 gm","15 gm","90 gm","50 gm","30 gm","20 gm","100 gm","150 gm"] },
  ];

  for (const variant of extraVariants) {
    for (let i = 0; i < variant.names.length; i++) {
      const id = `sp-${counter}`;
      const name = variant.names[i];
      const s = uniqueSlug(name);
      const bp = variant.bp[i];
      products.push({
        id,
        name,
        slug: s,
        category_id: variant.cat,
        price: bp,
        original_price: price(bp * 1.35),
        description: `Premium quality ${name} for authentic Hindu puja rituals. Sourced and verified by ShubhKarma.`,
        long_description: `${name} — a trusted ShubhKarma product for your sacred rituals. We source directly from traditional manufacturers across India.\n\nEvery product is quality-verified before dispatch. Whether for home puja or grand ceremonies, trust ShubhKarma for 100% authentic puja materials.\n\nFull replacement guarantee on any quality concerns.`,
        puja_tags: getPujaTags(variant.cat, name),
        weight: variant.w[i],
        image_url: `/assets/samagri/${s}.jpg`,
        images: [`/assets/samagri/${s}-1.jpg`, `/assets/samagri/${s}-2.jpg`],
        in_stock: Math.random() > 0.05,
        rating: (4.2 + Math.random() * 0.7).toFixed(1),
        reviews: rand(10, 200),
        featured: counter % 11 === 0,
        specifications: {},
        purity_info: "100% authentic. ShubhKarma verified.",
        sourcing_details: "Sourced from verified traditional suppliers across India.",
        usage_instructions: "Use as directed during puja ceremony. Handle with devotion.",
        storage_info: "Store in cool, dry place. Keep in original packaging.",
        certifications: ["ShubhKarma Verified"],
        ingredients: [],
        shelf_life: "12+ Months",
        sku: `SK-${variant.cat.toUpperCase().slice(0,3)}-${String(counter).padStart(4,'0')}`,
        brand: "ShubhKarma",
        benefits: [`Quality ${name.toLowerCase()}`, "Authentic & pure", "Verified by experts"],
      });
      counter++;
    }
  }

  // ── BULK VARIANT GENERATOR — size/quality/combo variants to reach 1000+ ──
  const bulkVariants = [
    // Puja Kits — combo & festival kits
    ...['Ekadashi Puja Kit','Pradosh Vrat Kit','Somvar Vrat Kit','Mangalvar Hanuman Kit','Guruvar Brihaspati Kit',
      'Shukravar Santoshi Kit','Shanivaar Shani Kit','Purnima Puja Kit','Amavasya Puja Kit','Akshaya Tritiya Kit',
      'Guru Purnima Kit','Raksha Bandhan Kit','Bhai Dooj Kit','Govardhan Puja Kit','Annakut Puja Kit',
      'Sharad Purnima Kit','Dev Uthani Ekadashi Kit','Vat Savitri Vrat Kit','Ahoi Ashtami Kit','Hartalika Teej Kit',
      'Kajari Teej Kit','Gangaur Puja Kit','Onam Puja Kit','Pongal Puja Kit','Ugadi Puja Kit',
      'Gudi Padwa Kit','Baisakhi Puja Kit','Lohri Kit','Bihu Puja Kit','Vishu Puja Kit',
      'Akhand Jyoti Kit','Daily Puja Kit (30 Days)','Weekly Puja Kit','Monthly Puja Kit','Annual Puja Kit',
      'Office Inauguration Kit','Shop Opening Kit','Factory Bhoomi Puja Kit','Hospital Ward Puja Kit','School Opening Kit'
    ].map((n,i) => ({ cat:'puja-kits', name:n, bp:299+rand(0,8)*100, w:`${1+rand(0,3)} Kg` })),

    // Essentials — more varieties
    ...['Camphor Tablets (Large)','Pure Honey (Puja Grade)','Rose Water Spray','Chandan Stick (Mysore)','Ashtagandha Paste',
      'Vibhuti (Thiruneeru)','Manjal (Turmeric Root)','Kumkum Box Set (6 Colors)','Sindoor Dibbi (Brass)','Roli Chawal Set',
      'Akshat (Colored Rice)','Paan & Supari Set (Premium)','Dry Fruit Mix (Prasad)','Mishri Crystals (Rock Sugar)','Batasha (Sugar Drops)',
      'Panchamrit Ready Mix','Charnamrit Powder','Gangajal (1 Liter)','Gangajal Spray Bottle','Tulsi Ark (Holy Basil Extract)',
      'Neem Ark','Bilva Ark','Bael Juice (Puja)','Coconut Water (Tender)','Jaggery Powder (Organic)',
      'Black Salt (Puja Grade)','Sendha Namak (Rock Salt)','Kala Til (Black Sesame 1Kg)','Safed Til (White Sesame)','Urad Dal (Puja)',
      'Chana Dal (Havan)','Rice (Basmati Puja Grade)','Wheat (Gehun) for Havan','Moong Dal (Green Gram)','Mustard Seeds (Sarson)',
      'Fenugreek Seeds (Methi)','Cumin Seeds (Jeera Puja)','Coriander Seeds (Dhaniya)','Fennel Seeds (Saunf)','Nigella Seeds (Kalonji)'
    ].map((n,i) => ({ cat:'essentials', name:n, bp:29+rand(0,6)*30, w:`${50+rand(0,9)*50} gm` })),

    // Ghee & Oils — more sizes and types
    ...['A2 Cow Ghee (2 Kg)','A2 Cow Ghee (5 Kg)','Buffalo Ghee (Puja)','Bilona Ghee (Hand-churned 500gm)','Bilona Ghee (Hand-churned 1Kg)',
      'Desi Ghee Pouch (50ml x 20)','Sesame Oil (1 Liter)','Coconut Oil (1 Liter)','Mustard Oil (1 Liter)','Castor Oil (Puja)',
      'Almond Oil (Puja Grade)','Neem Oil','Jasmine Oil (Fragrant Lamp)','Sandalwood Oil (5ml)','Rose Oil (5ml)',
      'Camphor Oil (50ml)','Eucalyptus Oil (Puja)','Tulsi Oil','Brahmi Oil','Ghee Diya Refill Pack (12)',
      'Flavored Ghee (Cardamom)','Flavored Ghee (Saffron)','Panchamrit Ghee (500gm)','Havan Ghee (5Kg Bulk)','Lamp Oil (Mixed Herbs)'
    ].map((n,i) => ({ cat:'ghee-oils', name:n, bp:99+rand(0,15)*100, w:`${100+rand(0,9)*100} ml` })),

    // Flowers — more types
    ...['White Rose Garland','Pink Rose Garland','Yellow Marigold Garland','Mixed Color Garland','Carnation Garland',
      'Artificial Marigold (10 Strings)','Artificial Rose Petals (500gm)','Dried Champa Flowers','Dried Parijat Flowers','Fresh Bael Fruit (10)',
      'Banana for Puja (12)','Coconut Flower Set','Mango Leaves (Fresh 50)','Ashoka Leaves (Fresh 25)','Peepal Leaves (Fresh 25)',
      'Banana Leaves (10)','Palash Flowers (Fresh)','Kaner Flowers (Oleander)','Aak Flowers (Calotropis)','Dhatura Flowers & Fruit',
      'Kevda (Pandanus) Flower','Chameli Oil Flowers Set','Mogra Gajra (Fresh)','Rose Petals (1 Kg Fresh)','Mixed Puja Flowers Box (Premium)',
      'Veni (Hair Garland)','Door Toran (Flower)','Mandap Flower Set','Wedding Garland Set (Bride+Groom)','Stage Decoration Flowers'
    ].map((n,i) => ({ cat:'flowers-garlands', name:n, bp:29+rand(0,10)*30, w:'As Packed' })),

    // Havan — more items
    ...['Havan Samagri (10 Kg Bulk)','Havan Samagri (25 Kg Bulk)','Chandan Samidha','Shami Wood Sticks','Ashwattha (Peepal) Samidha',
      'Palash Samidha','Khadir Wood','Apamarga Sticks','Arka (Aak) Samidha','Bilva Samidha',
      'Navagraha Havan Set (Complete)','108 Aahuti Ghee Pack','1008 Aahuti Ghee Pack','Havan Brick Kund (Portable)','Steel Havan Kund (Travel)',
      'Copper Havan Kund (Extra Large)','Havan Spoon Set (Brass 3pc)','Havan Fan (Bamboo)','Havan Tongs (Iron)','Agnihotra Timer (Digital)',
      'Cow Dung Cake (50 pack)','Cow Dung Cake (100 pack)','Dried Neem Leaves for Havan','Tulsi Sticks for Havan','Camphor Blocks (Havan)',
      'Javakusum (Havan Herb)','Tagar (Valerian Havan)','Nagarmotha (Havan)','Jatamansi (Havan)','Brahmi (Havan Herb)'
    ].map((n,i) => ({ cat:'havan-items', name:n, bp:49+rand(0,20)*100, w:`${250+rand(0,9)*250} gm` })),

    // Diyas & Lamps — more types
    ...['Brass Diya Set (5 pcs)','Brass Diya Set (11 pcs)','Brass Diya Set (21 pcs)','Silver Diya Set (3 pcs)','Terracotta Diya Set (101)',
      'Terracotta Diya Set (501)','Floating LED Diya (6 pcs)','Floating LED Diya (12 pcs)','Brass Aarti Plate with Diya','Brass Temple Lamp (Tall)',
      'South Indian Brass Lamp (Nilavilakku)','Brass Pillar Lamp (2 ft)','Brass Peacock Diya','Brass Elephant Diya','Brass Tortoise Diya',
      'Crystal Akhand Jyoti','Brass Urli (Floating Bowl)','Copper Urli (Large)','Brass Deepak Tree (7 Branch)','Brass Deepak Tree (11 Branch)',
      'Oil Lamp Wick Roll (500m)','Cotton Wicks (1000 pcs)','Ghee Wicks (Pre-soaked 100)','Brass Camphor Burner','Brass Dhoop Stand (Elephant)'
    ].map((n,i) => ({ cat:'diyas-lamps', name:n, bp:49+rand(0,30)*100, w:`${100+rand(0,9)*200} gm` })),

    // Idols — more deities and materials
    ...['Ganesh Murti (Eco Clay 12 inch)','Ganesh Murti (Fiber 18 inch)','Lakshmi Murti (White Marble 12 inch)','Shivling (Crystal Sphatik)',
      'Shivling (Black Stone Banalingi)','Shivling (Parad 100gm)','Hanuman Murti (Marble 12 inch)','Krishna Flute Player (Brass 10 inch)',
      'Radha Krishna (Marble 12 inch)','Durga Murti (Clay Painted)','Kali Murti (Brass 6 inch)','Saraswati Murti (Brass 8 inch)',
      'Vishnu Murti (Brass 8 inch)','Ram Darbar (Marble Set)','Sai Baba Murti (Brass 6 inch)','Tirupati Balaji (Stone)',
      'Jagannath Set (Painted Wood)','Ganesh Murti (Panchadhatu)','Lakshmi Murti (Panchadhatu)','Shiva Parivar (Marble)',
      'Nandi (Marble 6 inch)','Kartikeya (Brass 6 inch)','Ayyappa Murti (Brass)','Ganesha Wall Hanging (Brass)','Lakshmi Wall Panel (Brass)',
      'Hanuman Wall Hanging (Brass)','Dancing Ganesha (Brass)','Baby Krishna Crawling (Brass)','Vishnu Dashavatar Set','Ashta Ganesh Set (8 forms)'
    ].map((n,i) => ({ cat:'idols-murtis', name:n, bp:299+rand(0,50)*100, w:`${200+rand(0,30)*100} gm` })),

    // Yantras — more types
    ...['Shri Yantra (Gold Plated)','Shri Yantra (Crystal)','Meru Shri Yantra (Brass Large)','Laxmi Narayan Yantra','Ganesh Yantra (Copper)',
      'Hanuman Yantra (Brass)','Ram Yantra','Sai Baba Yantra','Navagraha Yantra Set (9 pcs)','Sarva Karya Siddhi Yantra',
      'Santan Gopal Yantra (Silver)','Education Yantra','Career Yantra','Marriage Yantra','Health Yantra',
      'Vashikaran Yantra','Mahamrityunjaya Yantra (Gold)','Durga Yantra (Silver)','Kali Yantra (Silver)','Tara Yantra (Copper)',
      'Baglamukhi Yantra (Gold Plated)','Shani Yantra (Lead)','Mangal Yantra (Silver)','Complete Yantra Set (12 pcs)','Vastu Dosh Nivaran Yantra Set'
    ].map((n,i) => ({ cat:'yantras', name:n, bp:299+rand(0,50)*100, w:`${50+rand(0,5)*50} gm` })),

    // Rudraksha & Gems — more options
    ...['12 Mukhi Rudraksha','13 Mukhi Rudraksha','21 Mukhi Rudraksha (Nepal)','Rudraksha Mala (1-14 Mukhi Set)','Rudraksha Pendant (Silver)',
      'Rudraksha Bracelet (7 Mukhi)','Rudraksha Bracelet (Gauri Shankar)','Lab Certified Pukhraj Ring','Lab Certified Neelam Ring','Lab Certified Manik Ring',
      'Lab Certified Panna Ring','Lab Certified Moti Ring','Lab Certified Moonga Ring','Lab Certified Gomed Ring','Lab Certified Lehsunia Ring',
      'Navaratna Bracelet (Gold)','Navaratna Pendant (Silver)','Sphatik (Crystal) Shivling','Sphatik Mala (Diamond Cut)','Parad Gutika (Mercury Ball)',
      'Shaligram Stone (Vishnu)','Shaligram Set (5 pcs)','Sudarshan Shaligram','Laxmi Narayan Shaligram','Dwarkadhish Shaligram',
      'Gomti Chakra (21 pcs)','Gomti Chakra (51 pcs)','Gomti Chakra Mala','Haldi Ganesh (Turmeric)','Vaijayanti Bracelet'
    ].map((n,i) => ({ cat:'rudraksha-gems', name:n, bp:199+rand(0,100)*100, w:`${5+rand(0,20)} gm` })),

    // Incense — more fragrances
    ...['Masala Agarbatti (Hand-rolled)','Bamboo-less Dhoop Sticks','Organic Incense Sticks (Vetiver)','Organic Incense (Mogra)','Organic Incense (Nag Champa)',
      'Premium Dhoop Cone (Sandalwood)','Premium Dhoop Cone (Guggul)','Premium Dhoop Cone (Rose)','Hawan Dhoop Cone (Herbal)','Temple Blend Agarbatti',
      'Meditation Dhoop (Frankincense)','Yoga Incense Set (7 Chakras)','Premium Loban (Arabic 250gm)','Pure Guggul (250gm)','Sambrani Powder (200gm)',
      'Dhoop Batti (Rope Style)','Backflow Dhoop Cones (40)','Waterfall Dhoop Cone Set','Incense Gift Box (12 Fragrances)','Seasonal Incense Collection',
      'Camphor Blocks (250gm)','Bhimseni Camphor (100gm)','Japanese Incense (Sandalwood)','Tibetan Incense Sticks','South Indian Temple Sambrani',
      'Cow Dung Dhoop Batti','Ayurvedic Dhoop (21 Herbs)','Mosquito Repellent Dhoop','Air Purifier Havan Cup','Aromatherapy Incense Set'
    ].map((n,i) => ({ cat:'incense-dhoop', name:n, bp:49+rand(0,8)*50, w:`${20+rand(0,5)*50} gm` })),

    // Cloth — more options
    ...['Silk Dupatta (Red Bandhani)','Cotton Chunri (Block Print)','Velvet Singhasan Cover (Large)','Brocade Puja Cloth (Gold)','Silk Deity Dress (Krishna)',
      'Silk Deity Dress (Ganesh)','Silk Deity Dress (Lakshmi)','Crochet Deity Cap Set','Deity Jewelry Set (Gold Plated)','Deity Crown (Mukut Gold)',
      'Deity Crown (Mukut Silver)','Pooja Room Curtain (Silk)','Temple Door Curtain (Velvet)','Mandap Cloth (Wedding)','Haldi Ceremony Cloth Set',
      'Mehndi Ceremony Cloth Set','Engagement Cloth Set','Prayer Mat (Organic Cotton)','Meditation Cushion (Velvet)','Puja Seat (Wooden with Cloth)',
      'Kalash Cover Set (5 Colors)','Coconut Cover Cloth','Granth Sahib Rumal Set','Quran Stand Cloth','Puja Thali Cover (Embroidered)'
    ].map((n,i) => ({ cat:'puja-cloth', name:n, bp:79+rand(0,10)*100, w:`${50+rand(0,5)*100} gm` })),

    // Utensils — more items
    ...['Silver Kalash (Small 100gm)','Silver Puja Spoon Set','Copper Abhishek Vessel (Large)','Brass Nandi (Temple Size)','Brass Bell (Large Temple)',
      'Conch Shell (Left-hand Rare)','Brass Aarti Set (Complete 5pc)','Copper Sombu Set (3 pcs)','Brass Puja Box (Portable)','Brass Puja Mandir (Small)',
      'Wooden Puja Mandir (Wall Mount)','Wooden Puja Mandir (Floor Standing)','Marble Puja Mandir','MDF Puja Mandir (Modern)','Brass Tulsi Kyaro (Large)',
      'Copper Gangajali','Brass Panchpatra Set','Silver Panchpatra (Pure)','Brass Abhishek Stand','Brass Shivling Stand (Nandi Base)',
      'Copper Lota Set (3 sizes)','Brass Thali (Meenakari Large)','Stainless Steel Puja Thali','German Silver Puja Set','Brass Puja Tokri (Basket)',
      'Brass Incense Box','Copper Matchbox Holder','Brass Kumkum Stand','Brass Deepak Stand (Wall)','Brass Garland Hook Set (6)'
    ].map((n,i) => ({ cat:'puja-utensils', name:n, bp:149+rand(0,40)*100, w:`${100+rand(0,20)*100} gm` })),

    // Sacred Threads & Malas — more
    ...['Tulsi Mala (Premium Vrindavan)','Rudraksha Mala (3 Mukhi)','Rudraksha Mala (7 Mukhi)','Sandalwood Bracelet (Men)','Sandalwood Bracelet (Women)',
      'Sphatik Bracelet','Tiger Eye Bracelet','Amethyst Bracelet','Lapis Lazuli Bracelet','Rose Quartz Bracelet',
      'Moonstone Bracelet','Black Tourmaline Bracelet','Green Jade Bracelet','Carnelian Bracelet','7 Chakra Bracelet',
      'Parad Mala (108 beads)','Coral Mala (Red)','Pearl Mala (White)','Emerald Mala (Panna)','Ruby Mala (Manik)',
      'Silver Chain (Puja)','Gold Plated Mala','Navratna Thread Bracelet','Mauli Thread Bulk (1Kg)','Janeu Bulk Pack (50)',
      'Kusha Ring Set (7 days)','Silk Thread (Red for Puja)','Sacred Thread (Black Protection)','Panchmukhi Rudraksha Pendant','Gauri Shankar Pendant'
    ].map((n,i) => ({ cat:'sacred-threads', name:n, bp:29+rand(0,50)*100, w:`${5+rand(0,20)*5} gm` })),

    // Herbs & Powders — more
    ...['Red Sandalwood Stick (Lal Chandan)','White Sandalwood Stick (Safed)','Sandalwood Paste (Ready-made)','Saffron Paste (Kesar Tilak)','Ashtagandha Stick',
      'Kasturi Powder (Premium)','Gorochana (Pure 5gm)','Javadhu (Temple Powder)','Panch Sugandhi Set','Dashang Dhoop Powder',
      'Havan Samagri Herbs (Loose 36 types)','Guggul Powder','Loban Powder','Kapoor Kachri Powder','Nagarmotha Powder',
      'Jatamansi Powder','Priyangu Powder','Devdaru Powder','Tagara Powder','Agar (Agarwood) Chips',
      'Oud Wood Chips','Sandalwood Chips','Cedar Wood Chips','Sage Bundle (Smudge Stick)','Palo Santo Stick',
      'Benzoin Resin','Myrrh Resin','Dragon Blood Resin','Copal Resin','White Sage Leaves (Dried)'
    ].map((n,i) => ({ cat:'herbs-powders', name:n, bp:49+rand(0,20)*50, w:`${10+rand(0,9)*25} gm` })),

    // Books — more scriptures
    ...['Bhagavad Gita (English)','Bhagavad Gita (Pocket Sanskrit)','Ramayan (Children Edition)','Mahabharat (Children Edition)','Hanuman Chalisa (100 Pack)',
      'Sundarkand (Large Print)','Durga Saptashati (Deluxe)','Vishnu Sahasranama (Large)','Shiv Chalisa','Ganesh Chalisa & Aarti',
      'Lakshmi Chalisa & Aarti','Saraswati Chalisa','Santoshi Mata Chalisa','Aarti Sangrah (Complete)','Bhajan Sangrah (500 Bhajans)',
      'Puja Vidhi (All Festivals)','Muhurat Calendar 2026','Panchang 2026','Kundali Matching Guide','Vastu Shastra Book',
      'Jyotish Shastra (Beginner)','Tantra Shastra (Introduction)','Yoga Darshan','Samkhya Darshan','Nyaya Darshan',
      'Vedanta Sara','Panchatantra Stories','Hitopadesha','Chanakya Sutra','Thirukkural (Hindi)'
    ].map((n,i) => ({ cat:'books-granths', name:n, bp:29+rand(0,10)*50, w:`${50+rand(0,10)*100} gm` })),

    // Extra Puja Kits — regional & specialty
    ...['Tamil Nadu Puja Kit','Kerala Special Puja Kit','Bengali Puja Kit','Marathi Puja Kit','Gujarati Puja Kit',
      'Rajasthani Puja Kit','Assamese Puja Kit','Odia Puja Kit','Punjabi Puja Kit','Telugu Puja Kit',
      'Kannada Puja Kit','Maithili Puja Kit','Kashmiri Puja Kit','Konkani Puja Kit','Sindhi Puja Kit'
    ].map((n,i) => ({ cat:'puja-kits', name:n, bp:399+rand(0,5)*100, w:`${2+rand(0,2)} Kg` })),

    // Extra Essentials — organic & premium
    ...['Organic Turmeric Powder (500gm)','Organic Kumkum (100gm)','Premium Camphor (500gm)','Dhoop Powder Mix (Organic)','Chandan Powder (Premium 50gm)',
      'Kesari Kumkum (Saffron Based)','Organic Roli (200gm)','Premium Akshat (Saffron Coated)','Puja Water (7 Rivers Mix)','Sacred Ash (Vibhuti 500gm)',
      'Premium Supari Pack (100)','Paan Leaves (Fresh 50)','Dry Dates (Premium 500gm)','Premium Mishri (1Kg)','Organic Jaggery Blocks (1Kg)'
    ].map((n,i) => ({ cat:'essentials', name:n, bp:49+rand(0,8)*40, w:`${100+rand(0,5)*100} gm` })),

    // Extra Flowers — artificial & preserved
    ...['Preserved Rose Box (Luxury)','Artificial Lotus Set (12)','Artificial Jasmine Strings (20)','Silk Marigold Garlands (50)','Artificial Flower Mandap Set',
      'Dried Flower Potpourri (Puja)','Preserved Marigold Garland (Long-lasting)','Artificial Tulsi Plant','Silk Rose Petals (1Kg)','Artificial Champa Garland',
      'Preserved Mogra Box','Silk Chrysanthemum Garland','Artificial Flower Toran Set','Paper Flower Decoration Kit','Origami Lotus Set (DIY)'
    ].map((n,i) => ({ cat:'flowers-garlands', name:n, bp:99+rand(0,10)*50, w:'As Packed' })),

    // Extra Idols — mini & collectible
    ...['Mini Ganesh Set (7 Days)','Mini Lakshmi-Ganesh Set','Mini Shivling Set (3 sizes)','Mini Hanuman (Car Dashboard)','Mini Krishna (Car Dashboard)',
      'Mini Sai Baba (Car Dashboard)','Brass Nataraja (Dancing Shiva 12in)','Marble Radha Krishna (18in)','Wooden Ganesh (Hand Carved)','Stone Nandi (Polished)',
      'Crystal Ganesh','Crystal Lakshmi','Crystal Shivling Set','Terracotta Ganesh (Eco 6in)','Terracotta Durga (Eco 8in)'
    ].map((n,i) => ({ cat:'idols-murtis', name:n, bp:149+rand(0,40)*100, w:`${50+rand(0,20)*50} gm` })),

    // Extra Utensils — gift sets & combos
    ...['Brass Puja Gift Set (11 pcs)','Brass Puja Gift Set (21 pcs)','Copper Puja Set (Complete)','German Silver Gift Set','Stainless Steel Puja Set (Premium)',
      'Wedding Puja Set (Bride)','Wedding Puja Set (Groom)','Griha Pravesh Puja Set','Satyanarayan Puja Set (Complete)','Baby Naming Ceremony Set',
      'Brass Kangana Set','Copper Water Set (Puja)','Silver Coated Puja Set','Miniature Temple Accessories','Puja Storage Box (Brass)'
    ].map((n,i) => ({ cat:'puja-utensils', name:n, bp:299+rand(0,30)*100, w:`${200+rand(0,10)*100} gm` })),

    // Extra Incense — gift & premium
    ...['Incense Gift Hamper (Premium)','Temple Collection Box (6 Fragrances)','Meditation Incense Kit','Premium Oud Agarbatti','White Sage Smudge Kit',
      'Palo Santo Gift Set','Artisan Dhoop Collection','Natural Resin Incense Kit','Festival Incense Combo','Luxury Agarbatti Set (Silk Box)'
    ].map((n,i) => ({ cat:'incense-dhoop', name:n, bp:149+rand(0,10)*100, w:`${50+rand(0,5)*50} gm` })),
  ];

  for (const item of bulkVariants) {
    const id = `sp-${counter}`;
    const name = item.name;
    const s = uniqueSlug(name);
    const bp = item.bp;
    products.push({
      id,
      name,
      slug: s,
      category_id: item.cat,
      price: bp,
      original_price: price(bp * 1.3),
      description: `Premium quality ${name} for authentic Hindu puja rituals. Sourced and verified by ShubhKarma.`,
      long_description: `${name} — a trusted ShubhKarma product for your sacred rituals. We source directly from traditional manufacturers across India.\n\nEvery product is quality-verified before dispatch. Whether for home puja or grand ceremonies, trust ShubhKarma for 100% authentic puja materials.\n\nFull replacement guarantee on any quality concerns.`,
      puja_tags: getPujaTags(item.cat, name),
      weight: item.w,
      image_url: `/assets/samagri/${s}.jpg`,
      images: [`/assets/samagri/${s}-1.jpg`, `/assets/samagri/${s}-2.jpg`],
      in_stock: Math.random() > 0.04,
      rating: (4.2 + Math.random() * 0.7).toFixed(1),
      reviews: rand(5, 180),
      featured: counter % 13 === 0,
      specifications: {},
      purity_info: "100% authentic. ShubhKarma verified.",
      sourcing_details: "Sourced from verified traditional suppliers across India.",
      usage_instructions: "Use as directed during puja ceremony. Handle with devotion.",
      storage_info: "Store in cool, dry place. Keep in original packaging.",
      certifications: ["ShubhKarma Verified"],
      ingredients: [],
      shelf_life: "12+ Months",
      sku: `SK-${item.cat.toUpperCase().slice(0,3)}-${String(counter).padStart(4,'0')}`,
      brand: "ShubhKarma",
      benefits: [`Quality ${name.toLowerCase()}`, "Authentic & pure", "Verified by experts"],
    });
    counter++;
  }

  return products;
}

function getPujaTags(catId, name) {
  const n = name.toLowerCase();
  const tags = ["all"];
  if (n.includes("satyanarayan")) tags.push("satyanarayan-katha");
  if (n.includes("griha") || n.includes("vastu")) tags.push("griha-pravesh","vastu-shanti");
  if (n.includes("rudrabhishek") || n.includes("shiv")) tags.push("rudrabhishek","shiv-puja");
  if (n.includes("navratri") || n.includes("durga")) tags.push("navratri-puja","durga-puja-regular");
  if (n.includes("lakshmi") || n.includes("diwali")) tags.push("lakshmi-puja","diwali-lakshmi-puja");
  if (n.includes("ganesh")) tags.push("ganesh-puja","ganesh-chaturthi");
  if (n.includes("hanuman")) tags.push("hanuman-puja","sundarkand-path");
  if (n.includes("havan") || n.includes("samagri")) tags.push("gayatri-havan");
  if (n.includes("navagraha")) tags.push("navagraha-shanti");
  if (n.includes("vivah") || n.includes("wedding")) tags.push("vivah-puja");
  if (n.includes("namkaran")) tags.push("namkaran-sanskar");
  if (n.includes("mrityunjaya")) tags.push("maha-mrityunjaya");
  if (n.includes("kaal sarp")) tags.push("kaal-sarp-dosh");
  return tags;
}

const samagriProducts = generateProducts();
console.log(`Generated ${samagriProducts.length} samagri products`);

// ════════════════════════════════════════════
// 40 TESTIMONIALS
// ════════════════════════════════════════════
const cities = ["Mumbai, MH","Delhi, DL","Bangalore, KA","Hyderabad, TG","Ahmedabad, GJ","Chennai, TN","Pune, MH","Jaipur, RJ","Lucknow, UP","Kolkata, WB","Bhopal, MP","Indore, MP","Varanasi, UP","Chandigarh, PB","Surat, GJ","Patna, Bihar","Noida, UP","Gurugram, HR","Nagpur, MH","Nashik, MH"];
const tNames = ["Rahul Verma","Sneha Sharma","Amit Patel","Priya Singh","Vikram Joshi","Meena Agarwal","Suresh Reddy","Kavita Dubey","Ravi Kumar","Anita Mishra","Deepak Gupta","Sunita Devi","Rajesh Tiwari","Pooja Chauhan","Manoj Srivastava","Nidhi Pandey","Arun Shukla","Rekha Yadav","Sanjay Mehta","Geeta Sharma","Ramesh Chandra","Neha Tripathi","Vikas Agarwal","Savita Jain","Prakash Dubey","Kiran Verma","Ashok Kumar","Mamta Singh","Dinesh Pandey","Ritu Gupta","Ajay Saxena","Pallavi Tiwari","Sunil Sharma","Anjali Mishra","Naveen Reddy","Shilpa Joshi","Rohit Patel","Aarti Dubey","Vinod Mehta","Sunaina Rao"];
const pujaIds = pujas.map(p => p.id);

const testimonials = tNames.map((name, i) => {
  const pId = pujaIds[i % pujaIds.length];
  const puja = pujas.find(p => p.id === pId);
  const texts = [
    `The ${puja.title} performed by ShubhKarma Pandits was absolutely divine. Every mantra was recited with precision and the entire family felt blessed. Highly recommended!`,
    `Booked ${puja.title} for our family. The Pandit was punctual, knowledgeable, and explained every ritual beautifully. The samagri quality was excellent. Will book again!`,
    `Amazing experience with ${puja.title}! The Pandit's expertise was evident from the very first mantra. The entire ceremony was conducted with utmost devotion and authenticity.`,
    `We were skeptical about online puja booking, but ShubhKarma exceeded all expectations. The ${puja.title} was performed perfectly. The Pandit even stayed for extra time to answer our questions.`,
    `${puja.title} was conducted beautifully at our home. The Pandit brought all the samagri, set up everything, and performed the puja with great devotion. My parents were extremely happy.`,
  ];
  return {
    id: `t${i + 1}`,
    name,
    location: cities[i % cities.length],
    puja_booked: pId,
    puja_title: puja.title,
    text: texts[i % texts.length],
    rating: i % 5 === 0 ? 4 : 5,
    date: `2026-${String(1 + (i % 3)).padStart(2, '0')}-${String(1 + (i * 3) % 28).padStart(2, '0')}`,
    image_url: `/assets/testimonials/t${i + 1}.jpg`,
    verified: true,
  };
});

// ════════════════════════════════════════════
// BLOG POSTS (keep existing 6)
// ════════════════════════════════════════════
const blogPosts = [
  { id:"b1", title:"The Science Behind Havan: Why Ancient Fire Rituals Still Matter", slug:"science-behind-havan", excerpt:"Modern research confirms what Vedic rishis knew — havan purifies air, reduces bacteria, and creates a meditative environment.", category_id:"regular", tags:["havan","science","wellness"], author_name:"Acharya Veda Prakash", author_id:"p1", date:"2026-03-10", read_time:"6 min", image_url:"/assets/blog/havan-science.jpg", featured:true },
  { id:"b2", title:"Navagraha Shanti: Understanding the 9 Planets and Their Effects", slug:"navagraha-shanti-guide", excerpt:"Each planet governs specific life aspects. Learn how unfavorable planetary positions affect you.", category_id:"astrological", tags:["navagraha","astrology","remedies"], author_name:"Pandit Ramakant Sharma", author_id:"p3", date:"2026-03-05", read_time:"8 min", image_url:"/assets/blog/navagraha-guide.jpg", featured:true },
  { id:"b3", title:"The 7 Vedic Wedding Rituals Every Couple Should Know", slug:"vedic-wedding-rituals-explained", excerpt:"From Kanyadaan to Saptapadi — a deep dive into each ritual, its meaning, and why it matters.", category_id:"samskara", tags:["wedding","rituals","saptapadi"], author_name:"Pandit Manoj Mishra", author_id:"p5", date:"2026-02-28", read_time:"7 min", image_url:"/assets/blog/vedic-wedding.jpg", featured:false },
  { id:"b4", title:"Griha Pravesh 2026: Auspicious Dates and Complete Guide", slug:"griha-pravesh-2026-dates", excerpt:"Planning to move into your new home? Here are the most auspicious muhurat dates for 2026.", category_id:"regular", tags:["griha-pravesh","muhurat","2026"], author_name:"Pandit Ramakant Sharma", author_id:"p3", date:"2026-02-20", read_time:"5 min", image_url:"/assets/blog/griha-pravesh-guide.jpg", featured:false },
  { id:"b5", title:"Kaal Sarp Dosh: Myths, Reality, and Authentic Remedies", slug:"kaal-sarp-dosh-remedies", excerpt:"One of the most feared doshas. Separating myths from reality and how to genuinely address it.", category_id:"astrological", tags:["kaal-sarp","dosh","remedies"], author_name:"Acharya Dinesh Joshi", author_id:"p6", date:"2026-02-12", read_time:"9 min", image_url:"/assets/blog/kaalsarp-guide.jpg", featured:true },
  { id:"b6", title:"Why Rudrabhishek Is the Most Powerful Shiva Puja", slug:"rudrabhishek-power", excerpt:"The Rudram-Chamakam is the highest form of Shiva worship. Understand the 11 abhishek materials.", category_id:"regular", tags:["rudrabhishek","shiva","abhishek"], author_name:"Acharya Suresh Dwivedi", author_id:"p4", date:"2026-02-01", read_time:"6 min", image_url:"/assets/blog/rudrabhishek.jpg", featured:false },
];

// ════════════════════════════════════════════
// FAQ, STATS, PROMISES (keep existing)
// ════════════════════════════════════════════
const faqData = [
  { id:"f1", question:"Do I need to arrange samagri separately?", answer:"No. Our Pandits bring 100% pure and premium samagri based on the package you select. Every item is quality-checked before the puja.", category:"booking", sort_order:1 },
  { id:"f2", question:"How does payment work?", answer:"Pay a small booking amount online to confirm your slot. The remaining amount is paid after the puja is completed to your satisfaction.", category:"payment", sort_order:2 },
  { id:"f3", question:"Can I choose my Pandit?", answer:"Yes. You can view Pandit profiles, their expertise, and ratings before booking. If your preferred Pandit is unavailable, we'll suggest equally qualified alternatives.", category:"booking", sort_order:3 },
  { id:"f4", question:"What if I need to reschedule?", answer:"You can reschedule up to 24 hours before the puja at no extra cost. We'll help find the next auspicious muhurat.", category:"booking", sort_order:4 },
  { id:"f5", question:"Are the Pandits verified?", answer:"Yes. Every Pandit on ShubhKarma is verified through a 5-step process: Vedic knowledge test, identity verification, experience check, background check, and trial puja performance.", category:"trust", sort_order:5 },
  { id:"f6", question:"Which cities do you serve?", answer:"We currently serve 50+ cities across India including Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Jaipur, Varanasi, and more.", category:"general", sort_order:6 },
  { id:"f7", question:"Is online puja booking safe?", answer:"Absolutely. We use industry-standard encryption for all transactions. Your personal data is never shared with third parties.", category:"trust", sort_order:7 },
  { id:"f8", question:"Can I request extra Pandits?", answer:"Yes! Many pujas allow you to add extra Pandits beyond the package default. Extra Pandit charges are clearly shown during booking.", category:"booking", sort_order:8 },
  { id:"f9", question:"Do you provide muhurat consultation?", answer:"Yes. Our Jyotish Acharyas can suggest the most auspicious date and time for your puja based on your birth chart.", category:"booking", sort_order:9 },
  { id:"f10", question:"What is the cancellation policy?", answer:"Free cancellation up to 48 hours before the puja. Cancellations within 24 hours may incur a 10% fee. Full refund if we cancel.", category:"payment", sort_order:10 },
];

const stats = [
  { id:"stat-pujas", label:"Pujas Performed", value:15000, display_value:"15,000+", icon:"calendar", suffix:"+" },
  { id:"stat-families", label:"Happy Families", value:8000, display_value:"8,000+", icon:"heart", suffix:"+" },
  { id:"stat-pandits", label:"Verified Pandits", value:200, display_value:"200+", icon:"users", suffix:"+" },
  { id:"stat-cities", label:"Cities Covered", value:50, display_value:"50+", icon:"map", suffix:"+" },
  { id:"stat-rating", label:"Average Rating", value:4.8, display_value:"4.8/5", icon:"star", suffix:"/5" },
];

const promises = [
  { id:"pr1", title:"100% Vedic Authentic", description:"Every puja performed by ShubhKarma follows the authentic Vedic procedures with correct mantras, precise pronunciation, and proper rituals.", icon:"shield-check", sort_order:1 },
  { id:"pr2", title:"Verified Expert Pandits", description:"Our Pandits undergo a rigorous 5-step verification including Vedic knowledge test, background check, and trial puja performance.", icon:"badge-check", sort_order:2 },
  { id:"pr3", title:"Pure Premium Samagri", description:"We use only premium, lab-tested puja materials. No synthetic chemicals, no adulterated items — 100% pure and natural.", icon:"sparkles", sort_order:3 },
  { id:"pr4", title:"On-Time, Every Time", description:"Our Pandits arrive 15 minutes before the scheduled time with complete samagri setup. Zero delays, zero excuses.", icon:"clock", sort_order:4 },
  { id:"pr5", title:"Transparent Pricing", description:"What you see is what you pay. No hidden charges, no last-minute additions. Complete cost breakdown before you book.", icon:"currency", sort_order:5 },
  { id:"pr6", title:"Satisfaction Guaranteed", description:"If you're not satisfied with the puja quality, we'll arrange a re-puja at no extra cost. Your faith matters to us.", icon:"thumb-up", sort_order:6 },
];

// ════════════════════════════════════════════
// SEED RUNNER
// ════════════════════════════════════════════

async function seed() {
  console.log('🚀 ShubhKarma v2 Seed — Starting...\n');
  console.log(`  Pujas: ${pujas.length}`);
  console.log(`  Products: ${samagriProducts.length}`);
  console.log(`  Pandits: ${pandits.length}`);
  console.log(`  Testimonials: ${testimonials.length}\n`);

  // Clean old samagri data (FK: products reference categories)
  console.log('Cleaning old samagri data...');
  await sb.from('samagri_products').delete().neq('id', '___none___');
  await sb.from('samagri_categories').delete().neq('id', '___none___');
  console.log('✓ Old samagri data cleaned\n');

  await upsertBatch('categories', categories);
  await upsertBatch('pandits', pandits);
  await upsertBatch('pujas', pujas);
  await upsertBatch('samagri_categories', samagriCategories);
  await upsertBatch('samagri_products', samagriProducts, 100);
  await upsertBatch('testimonials', testimonials);
  await upsertBatch('blog_posts', blogPosts);
  await upsertBatch('faq', faqData);
  await upsertBatch('stats', stats);
  await upsertBatch('promises', promises);

  console.log('\n✅ Seed complete!');
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
