import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Basic translations - in production these would be JSON files
const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.about": "About Us",
      "nav.programs": "Programs",
      "nav.events": "Events",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "nav.donate": "Donate Now",
      "hero.title": "Empowering Dreams, Transform Lives",
      "hero.subtitle": "Join our mission to provide education, healthcare, and sustainable livelihood opportunities.",
      "hero.cta": "Make a Donation",
      "hero.welcome": "Welcome to Umedh Foundation"
    }
  },
  hi: {
    translation: {
      "nav.home": "मुख्य पृष्ठ",
      "nav.about": "हमारे बारे में",
      "nav.programs": "कार्यक्रम",
      "nav.events": "आयोजन",
      "nav.blog": "ब्लॉग",
      "nav.contact": "संपर्क करें",
      "nav.donate": "दान करें",
      "hero.title": "सपनों को सशक्त करें, जीवन बदलें",
      "hero.subtitle": "शिक्षा, स्वास्थ्य सेवा और स्थायी आजीविका के अवसर प्रदान करने के हमारे मिशन में शामिल हों।",
      "hero.cta": "दान करें",
      "hero.welcome": "उमेद फाउंडेशन में आपका स्वागत है"
    }
  },
  mr: {
    translation: {
      "nav.home": "मुख्यपृष्ठ",
      "nav.about": "आमच्याबद्दल",
      "nav.programs": "उपक्रम",
      "nav.events": "कार्यक्रम",
      "nav.blog": "ब्लॉग",
      "nav.contact": "संपर्क साधा",
      "nav.donate": "देणगी द्या",
      "hero.title": "स्वप्नांना बळ द्या, जीवन बदला",
      "hero.subtitle": "शिक्षण, आरोग्यसेवा आणि शाश्वत उपजीविकेच्या संधी उपलब्ध करून देण्याच्या आमच्या मोहिमेत सामील व्हा.",
      "hero.cta": "देणगी द्या",
      "hero.welcome": "उमेद फाउंडेशन मध्ये आपले स्वागत आहे"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
