import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "Home",
        browseMachinery: "Browse Machinery",
        login: "Login",
        getStarted: "Get Started"
      },
      landing: {
        heroTitle: "Empowering Farmers through\nShared Machinery Access",
        heroSubtitle:
          "Connect with nearby farmers to rent, share, and access agricultural equipment when you need it",
        findMachinery: "Find Machinery",
        listYourMachine: "List Your Machine",
        howItWorks: "How It Works",
        step1Title: "Find Nearby Equipment",
        step1Text:
          "Search for available machinery in your area by type, price, and availability",
        step2Title: "Book Instantly",
        step2Text:
          "Request bookings with a single click and coordinate directly with equipment owners",
        step3Title: "Build Community",
        step3Text:
          "Connect with fellow farmers and local agents to create a thriving agricultural network",
        whyChoose: "Why Choose FarmShare?",
        featureCostTitle: "Cost-Effective",
        featureCostText:
          "Save money by renting equipment only when needed instead of buying",
        featureQuickTitle: "Quick Access",
        featureQuickText:
          "Get the machinery you need within hours, not days",
        featureVerifiedTitle: "Verified Community",
        featureVerifiedText:
          "All users and equipment verified by local agents",
        featureIncomeTitle: "Earn Extra Income",
        featureIncomeText: "Machine owners can monetize idle equipment",
        testimonialsTitle: "What Farmers Say",
        testimonial1Text:
          "FarmShare helped me access a harvester during peak season. Saved me thousands and got the job done on time!",
        testimonial1Name: "Rajesh Kumar",
        testimonial1Meta: "Wheat Farmer, Punjab",
        testimonial2Text:
          "I list my tractor when I'm not using it. The extra income has been a game-changer for my family.",
        testimonial2Name: "Priya Sharma",
        testimonial2Meta: "Equipment Owner, Maharashtra",
        testimonial3Text:
          "As an agent, I love connecting farmers and helping build our agricultural community stronger.",
        testimonial3Name: "Amit Patel",
        testimonial3Meta: "Community Agent, Gujarat",
        ctaTitle: "Ready to Get Started?",
        ctaSubtitle:
          "Join thousands of farmers already sharing machinery in your community",
        ctaButton: "Create Free Account"
      },
      language: {
        label: "Language",
        en: "English",
        hi: "Hindi",
        mr: "Marathi",
        ta: "Tamil",
        te: "Telugu",
        kn: "Kannada",
        gu: "Gujarati",
        bn: "Bengali",
        pa: "Punjabi"
      }
    }
  },
  hi: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "होम",
        browseMachinery: "मशीनरी देखें",
        login: "लॉगिन",
        getStarted: "शुरू करें"
      },
      landing: {
        heroTitle: "किसानों को साझा मशीनरी से सशक्त बनाना",
        heroSubtitle:
          "पास के किसानों से जुड़ें और ज़रूरत पड़ने पर कृषि मशीनरी किराये पर लें या साझा करें",
        findMachinery: "मशीनरी खोजें",
        listYourMachine: "अपनी मशीन सूचीबद्ध करें",
        howItWorks: "यह कैसे काम करता है",
        step1Title: "पास की मशीनरी खोजें",
        step1Text:
          "अपनी क्षेत्र में उपलब्ध मशीनरी को प्रकार, कीमत और उपलब्धता के आधार पर खोजें",
        step2Title: "तुरंत बुक करें",
        step2Text:
          "एक क्लिक में बुकिंग अनुरोध भेजें और सीधे मालिकों से समन्वय करें",
        step3Title: "समुदाय बनाएं",
        step3Text:
          "किसानों और स्थानीय एजेंटों से जुड़कर एक मजबूत कृषि नेटवर्क बनाएं",
        whyChoose: "FarmShare क्यों चुनें?",
        featureCostTitle: "किफायती",
        featureCostText:
          "ज़रूरत पड़ने पर ही किराये पर लेकर मशीनरी खरीदने का खर्च बचाएं",
        featureQuickTitle: "तेज़ सुविधा",
        featureQuickText:
          "घंटों में ज़रूरी मशीनरी पाएं, दिनों में नहीं",
        featureVerifiedTitle: "पुष्टि किया हुआ समुदाय",
        featureVerifiedText:
          "सभी उपयोगकर्ता और मशीनें स्थानीय एजेंटों द्वारा सत्यापित",
        featureIncomeTitle: "अतिरिक्त आय कमाएँ",
        featureIncomeText: "मशीन मालिक खाली समय में मशीनरी से कमाई कर सकते हैं",
        testimonialsTitle: "किसान क्या कहते हैं",
        testimonial1Text:
          "FarmShare ने सीज़न के समय मुझे हार्वेस्टर दिलाने में मदद की। समय पर काम हुआ और अच्छी बचत भी हुई!",
        testimonial1Name: "राजेश कुमार",
        testimonial1Meta: "गेहूँ किसान, पंजाब",
        testimonial2Text:
          "जब मेरा ट्रैक्टर खाली रहता है तो मैं उसे सूचीबद्ध कर देती हूँ। अतिरिक्त आय हमारे लिए बहुत मददगार है।",
        testimonial2Name: "प्रिया शर्मा",
        testimonial2Meta: "मशीन मालिक, महाराष्ट्र",
        testimonial3Text:
          "एक एजेंट के रूप में, मुझे किसानों को जोड़ना और समुदाय मजबूत बनाना बहुत अच्छा लगता है।",
        testimonial3Name: "अमित पटेल",
        testimonial3Meta: "कम्युनिटी एजेंट, गुजरात",
        ctaTitle: "क्या आप तैयार हैं?",
        ctaSubtitle:
          "अपने समुदाय के हजारों किसानों के साथ मशीनरी साझा करना शुरू करें",
        ctaButton: "फ्री अकाउंट बनाएं"
      }
    }
  },
  mr: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "होम",
        browseMachinery: "मशीनरी पाहा",
        login: "लॉगिन",
        getStarted: "सुरू करा"
      }
    }
  },
  ta: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "முகப்பு",
        browseMachinery: "இயந்திரங்களை பார்க்க",
        login: "உள்நுழை",
        getStarted: "தொடங்குங்கள்"
      }
    }
  },
  te: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "హోమ్",
        browseMachinery: "యంత్రాలు చూడండి",
        login: "లాగిన్",
        getStarted: "ప్రారంభించండి"
      }
    }
  },
  kn: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "ಮುಖಪುಟ",
        browseMachinery: "ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ನೋಡಿ",
        login: "ಲಾಗಿನ್",
        getStarted: "ಪ್ರಾರಂಭಿಸಿ"
      }
    }
  },
  gu: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "હોમ",
        browseMachinery: "યંત્રો જુઓ",
        login: "લોગિન",
        getStarted: "શરૂ કરો"
      }
    }
  },
  bn: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "হোম",
        browseMachinery: "যন্ত্রপাতি দেখুন",
        login: "লগইন",
        getStarted: "শুরু করুন"
      }
    }
  },
  pa: {
    translation: {
      navbar: {
        brand: "FarmShare",
        home: "ਘਰ",
        browseMachinery: "ਮਸ਼ੀਨਰੀ ਵੇਖੋ",
        login: "ਲਾਗਇਨ",
        getStarted: "ਸ਼ੁਰੂ ਕਰੋ"
      }
    }
  }
} as const;

const storedLang = localStorage.getItem("lang");

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLang || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
