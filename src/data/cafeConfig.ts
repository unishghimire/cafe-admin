export const CAFE_CONFIG = {
  name: "AURA Artisanal Coffee & Kitchen",
  tagline: "Single-Origin Himalayan Roasts & Contemporary Gastronomy",
  location: {
    street: "Ward 3, Jhamsikhel (Restaurant Row)",
    city: "Lalitpur",
    valley: "Kathmandu Valley",
    country: "Nepal",
    postalCode: "44700",
    landmark: "Opposite St. Mary's Greenery, Jhamsikhel",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Jhamsikhel,Lalitpur,Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed",
    coordinates: {
      lat: 27.6782,
      lng: 85.3134,
    },
  },
  contact: {
    phone: "+977 1 554-8921",
    mobile: "+977 980-1234567",
    email: "bonjour@auracafe.np",
    reservationsEmail: "booking@auracafe.np",
  },
  operatingHours: [
    { days: "Monday – Thursday", hours: "7:00 AM – 10:00 PM" },
    { days: "Friday – Saturday", hours: "7:00 AM – 11:00 PM" },
    { days: "Sunday", hours: "8:00 AM – 9:30 PM" },
  ],
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tripadvisor: "https://tripadvisor.com",
    tiktok: "https://tiktok.com",
  },
  wifi: {
    ssid: "AURA_Artisan_Guest_5G",
    passcode: "singleorigin2026",
  },
  stats: [
    { label: "Altitude Roasted", value: "1,850m" },
    { label: "Bean Varieties", value: "14+" },
    { label: "Table Capacity", value: "65 Seats" },
    { label: "Customer Rating", value: "4.9 ★" },
  ],
  currency: {
    symbol: "NPR",
    locale: "en-NP",
    usdRate: 0.0075, // 1 NPR approx $0.0075 for dual currency view
  },
};
