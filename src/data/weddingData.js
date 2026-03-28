// src/data/weddingData.js
export const weddingData = {
  hero: {
    title: "Vedic Vivah",
    subtitle: "A divine union of two souls, sanctified by sacred mantras and eternal vows.",
    image: "/assets/pujas/wedding-hero.jpg",
    cta: { label: "Book Wedding Puja", link: "/book/vedic-vivah" },
  },
  intro: {
    heading: "Why Choose a Vedic Wedding?",
    text: "Marriage in the Vedic tradition is not merely a social contract — it is a profound spiritual union witnessed by Agni Dev. Every mantra carries a specific blessing for the couple's journey together.",
  },
  rituals: [
    {
      id: "ganesh-puja",
      name: "Ganesh Puja",
      description: "Invoking Lord Ganesha to remove all obstacles and bless the ceremony.",
      order: 1,
    },
    {
      id: "kanyadaan",
      name: "Kanyadaan",
      description: "The bride's father offers her hand — considered the highest form of daan (charity).",
      order: 2,
    },
    {
      id: "panigrahana",
      name: "Panigrahana",
      description: "The groom holds the bride's hand, accepting responsibility for her well-being.",
      order: 3,
    },
    {
      id: "mangal-phera",
      name: "Mangal Phera",
      description: "Four sacred rounds around the holy fire, each representing Dharma, Artha, Kama, and Moksha.",
      order: 4,
    },
    {
      id: "saptapadi",
      name: "Saptapadi (Seven Vows)",
      description: "Seven steps taken together, each with a sacred vow — the moment the marriage becomes irrevocable.",
      order: 5,
    },
    {
      id: "sindoor-daan",
      name: "Sindoor Daan",
      description: "The groom applies sindoor to the bride's hair parting, symbolizing her married status.",
      order: 6,
    },
    {
      id: "ashirvad",
      name: "Ashirvad",
      description: "Elders and the Pandit bless the couple for a prosperous and harmonious life.",
      order: 7,
    },
  ],
  packages: [
    {
      id: "basic",
      name: "Basic",
      price: 11000,
      originalPrice: 15000,
      pandits: 2,
      highlights: ["Core rituals", "2 Pandits", "Standard Samagri"],
    },
    {
      id: "standard",
      name: "Standard",
      price: 31000,
      originalPrice: 39000,
      pandits: 5,
      highlights: ["Full Vedic rituals", "5 Pandits", "Decorated Vedi", "Shehnai"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium (Royal)",
      price: 101000,
      originalPrice: 121000,
      pandits: 11,
      highlights: ["Grand ceremony", "11 Pandits", "Floral Vedi", "Vedic choir", "Photo+Video"],
    },
  ],
  whyUs: [
    { title: "Shastra-Certified Pandits", description: "Every Pandit is verified for correct mantra pronunciation and ritual knowledge." },
    { title: "Complete Samagri Included", description: "No last-minute shopping — we bring everything from Mangal Sutra to havan items." },
    { title: "Family-Friendly Ceremony", description: "Our Pandits explain each ritual in Hindi/English so every guest understands." },
    { title: "Flexible Timing", description: "We work around your muhurat and venue schedule, not the other way around." },
  ],
};
