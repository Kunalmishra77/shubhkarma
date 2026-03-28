// src/data/bhagwatData.js
export const bhagwatData = {
  hero: {
    title: "Srimad Bhagwat Mahapuran",
    subtitle: "7 Days of Divine Nectar — The Supreme Scripture of Devotion",
    image: "/assets/pujas/bhagwat-hero.jpg",
    cta: { label: "Book Bhagwat Katha", link: "/book/bhagwat-katha" },
  },
  intro: {
    heading: "About the Mahapuran",
    text: "Srimad Bhagwat is the crown jewel of all Hindu scriptures. Composed by Veda Vyasa, it contains 18,000 shlokas across 12 cantos. Listening to it with devotion brings liberation (Moksha) and frees ancestors from bondage.",
  },
  schedule: [
    {
      day: 1,
      title: "Mahatmya & Shukdev-Parikshit Milan",
      description: "The glory of Bhagwat Katha and the divine meeting of Shukdev Muni with King Parikshit.",
      highlights: ["Bhagwat Mahatmya", "Why listening grants Moksha"],
    },
    {
      day: 2,
      title: "Kapil Dev Avataar & Devahuti Updesh",
      description: "Lord Kapil's profound teachings on Sankhya philosophy to his mother Devahuti.",
      highlights: ["Sankhya Darshan", "Devotion as the path to liberation"],
    },
    {
      day: 3,
      title: "Narasimha Avataar & Prahlad Charitra",
      description: "The story of devotee Prahlad and Lord Narasimha's fierce protection of his bhakta.",
      highlights: ["Power of unwavering faith", "Holika Dahan origin"],
    },
    {
      day: 4,
      title: "Shri Krishna Janma & Bal Leela",
      description: "The divine birth of Lord Krishna in Mathura and his enchanting childhood pastimes in Gokul and Vrindavan.",
      highlights: ["Janmashtami leela", "Butter theft", "Kaliya Nag Daman"],
    },
    {
      day: 5,
      title: "Govardhan Leela & Raas Leela",
      description: "Krishna lifts Govardhan to protect Vrindavan, and the divine Raas with the Gopis.",
      highlights: ["Govardhan Puja origin", "Spiritual meaning of Raas"],
    },
    {
      day: 6,
      title: "Rukmini Vivah & Sudama Charitra",
      description: "Krishna's marriage with Rukmini and the moving story of his friendship with Sudama.",
      highlights: ["True friendship", "Detachment and devotion"],
    },
    {
      day: 7,
      title: "Uddhav Gita & Purnahuti",
      description: "Krishna's final teachings to Uddhav, the departure, and grand conclusion with Purnahuti havan.",
      highlights: ["Uddhav Gita", "Grand Purnahuti", "Community bhandara"],
    },
  ],
  packages: [
    {
      id: "basic",
      name: "Basic",
      price: 51000,
      originalPrice: 61000,
      pandits: 1,
      highlights: ["1 Katha Vyas", "4 hours/day", "Basic setup"],
    },
    {
      id: "standard",
      name: "Standard",
      price: 151000,
      originalPrice: 175000,
      pandits: 3,
      highlights: ["3 Pandits", "6 hours/day", "Live music", "Stage decor"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium (VVIP)",
      price: 501000,
      originalPrice: 551000,
      pandits: 11,
      highlights: ["Renowned Vyas", "8 hours/day", "Full AV setup", "Live-stream", "Coordinator"],
    },
  ],
  benefits: [
    { title: "Moksha for Ancestors", description: "Listening to Bhagwat Katha liberates 21 generations of ancestors." },
    { title: "Karmic Purification", description: "7 days of immersion in divine knowledge washes away accumulated sins." },
    { title: "Family Unity", description: "Brings the entire family together in a shared spiritual experience." },
    { title: "Community Blessings", description: "Hosting a Katha earns immense punya and uplifts the entire community." },
  ],
};
