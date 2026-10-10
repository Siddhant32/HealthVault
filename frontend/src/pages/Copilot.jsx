import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

const languages = [
  { code: "en", label: "English", flag: "EN" },
  { code: "hi", label: "हिन्दी · Hindi", flag: "हि" },
  { code: "mr", label: "मराठी · Marathi", flag: "म" },
  { code: "gu", label: "ગુજરાતી · Gujarati", flag: "ગુ" },
  { code: "ta", label: "தமிழ் · Tamil", flag: "த" },
  { code: "bn", label: "বাংলা · Bengali", flag: "বা" },
];
const ui = {
  en: { eyebrow: "PERSONAL HEALTH INTELLIGENCE", title: "Your health, in your language.", subtitle: "Ask about the information saved in your HealthVault profile.", language: "Response language", placeholder: "For example: Which medications are listed in my profile?", ask: "Ask Health Copilot", thinking: "Thinking…", answer: "Your answer", disclaimer: "This assistant summarizes stored information and does not diagnose, prescribe, or replace a healthcare professional.", suggestions: "Try asking", prompts: ["What medications am I taking?", "What allergies are listed?", "What is my blood group?", "How many medical records do I have?"], error: "I couldn't process that request. Check your connection and try again." },
  hi: { eyebrow: "आपका व्यक्तिगत स्वास्थ्य सहायक", title: "आपकी भाषा में आपका स्वास्थ्य।", subtitle: "अपने HealthVault प्रोफ़ाइल में सेव की गई जानकारी के बारे में पूछें।", language: "उत्तर की भाषा", placeholder: "उदाहरण: मेरी प्रोफ़ाइल में कौन-सी दवाएँ दर्ज हैं?", ask: "हेल्थ कोपायलट से पूछें", thinking: "सोच रहा है…", answer: "आपका उत्तर", disclaimer: "यह सहायक सेव की गई जानकारी समझाता है। यह बीमारी का निदान नहीं करता और डॉक्टर की सलाह का विकल्प नहीं है।", suggestions: "ये सवाल पूछें", prompts: ["मैं कौन-सी दवाएँ ले रहा/रही हूँ?", "मेरी कौन-सी एलर्जी दर्ज है?", "मेरा ब्लड ग्रुप क्या है?", "मेरे कितने मेडिकल रिकॉर्ड हैं?"], error: "अनुरोध पूरा नहीं हो सका। कनेक्शन जाँचें और फिर प्रयास करें।" },
  mr: { eyebrow: "तुमचा वैयक्तिक आरोग्य सहाय्यक", title: "तुमचे आरोग्य, तुमच्या भाषेत.", subtitle: "तुमच्या HealthVault प्रोफाइलमध्ये जतन केलेल्या माहितीबद्दल विचारा.", language: "उत्तराची भाषा", placeholder: "उदाहरण: माझ्या प्रोफाइलमध्ये कोणती औषधे नोंदवली आहेत?", ask: "हेल्थ कोपायलटला विचारा", thinking: "विचार करत आहे…", answer: "तुमचे उत्तर", disclaimer: "हा सहाय्यक जतन केलेली माहिती समजावतो. तो निदान करत नाही किंवा डॉक्टरांच्या सल्ल्याची जागा घेत नाही.", suggestions: "हे प्रश्न विचारा", prompts: ["मी कोणती औषधे घेत आहे?", "माझ्या कोणत्या अॅलर्जी नोंदल्या आहेत?", "माझा रक्तगट कोणता?", "माझे किती वैद्यकीय रेकॉर्ड आहेत?"], error: "विनंती पूर्ण करता आली नाही. कनेक्शन तपासून पुन्हा प्रयत्न करा." },
  gu: { eyebrow: "તમારો વ્યક્તિગત આરોગ્ય સહાયક", title: "તમારું આરોગ્ય, તમારી ભાષામાં.", subtitle: "તમારી HealthVault પ્રોફાઇલમાં સાચવેલી માહિતી વિશે પૂછો.", language: "જવાબની ભાષા", placeholder: "ઉદાહરણ: મારી પ્રોફાઇલમાં કઈ દવાઓ નોંધાયેલી છે?", ask: "હેલ્થ કોપાઇલટને પૂછો", thinking: "વિચારી રહ્યું છે…", answer: "તમારો જવાબ", disclaimer: "આ સહાયક સાચવેલી માહિતી સમજાવે છે. તે નિદાન કરતું નથી અને ડૉક્ટરની સલાહનો વિકલ્પ નથી.", suggestions: "આ પૂછવાનો પ્રયાસ કરો", prompts: ["હું કઈ દવાઓ લઉં છું?", "કઈ એલર્જી નોંધાયેલી છે?", "મારો બ્લડ ગ્રુપ શું છે?", "મારા કેટલા મેડિકલ રેકોર્ડ છે?"], error: "વિનંતી પૂર્ણ થઈ શકી નથી. કનેક્શન તપાસો અને ફરી પ્રયાસ કરો." },
  ta: { eyebrow: "உங்கள் தனிப்பட்ட சுகாதார உதவியாளர்", title: "உங்கள் மொழியில் உங்கள் உடல்நலம்.", subtitle: "உங்கள் HealthVault சுயவிவரத்தில் சேமித்த தகவல்களைப் பற்றி கேளுங்கள்.", language: "பதில் மொழி", placeholder: "உதாரணம்: என் சுயவிவரத்தில் எந்த மருந்துகள் உள்ளன?", ask: "ஹெல்த் கோபைலட்டிடம் கேளுங்கள்", thinking: "சிந்திக்கிறது…", answer: "உங்கள் பதில்", disclaimer: "இந்த உதவியாளர் சேமித்த தகவல்களை விளக்குகிறது. இது நோயறிதல் செய்யாது; மருத்துவரின் ஆலோசனைக்கு மாற்றாகாது.", suggestions: "இவற்றைக் கேளுங்கள்", prompts: ["நான் என்ன மருந்துகள் எடுத்துக்கொள்கிறேன்?", "என்ன ஒவ்வாமைகள் பதிவு செய்யப்பட்டுள்ளன?", "என் இரத்த வகை என்ன?", "எத்தனை மருத்துவப் பதிவுகள் உள்ளன?"], error: "கோரிக்கையைச் செயல்படுத்த முடியவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்." },
  bn: { eyebrow: "আপনার ব্যক্তিগত স্বাস্থ্য সহায়ক", title: "আপনার ভাষায় আপনার স্বাস্থ্য।", subtitle: "আপনার HealthVault প্রোফাইলে সংরক্ষিত তথ্য সম্পর্কে জিজ্ঞাসা করুন।", language: "উত্তরের ভাষা", placeholder: "যেমন: আমার প্রোফাইলে কোন ওষুধগুলি লেখা আছে?", ask: "হেলথ কোপাইলটকে জিজ্ঞাসা করুন", thinking: "ভাবছে…", answer: "আপনার উত্তর", disclaimer: "এই সহায়ক সংরক্ষিত তথ্য ব্যাখ্যা করে। এটি রোগ নির্ণয় করে না এবং চিকিৎসকের পরামর্শের বিকল্প নয়।", suggestions: "এগুলি জিজ্ঞাসা করুন", prompts: ["আমি কোন ওষুধ খাচ্ছি?", "কোন অ্যালার্জিগুলি নথিভুক্ত আছে?", "আমার রক্তের গ্রুপ কী?", "আমার কতগুলি মেডিকেল রেকর্ড আছে?"], error: "অনুরোধটি সম্পন্ন করা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।" },
};

export default function Copilot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("hv-language") || "en");
  const t = ui[language] || ui.en;

  const ask = async (prompt = question) => {
    if (!prompt.trim()) return;
    setQuestion(prompt);
    setLoading(true);
    setAnswer("");
    try {
      const response = await api.post("/copilot", { question: prompt, language });
      setAnswer(response.data.answer);
    } catch {
      setAnswer(t.error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (value) => {
    setLanguage(value);
    localStorage.setItem("hv-language", value);
    setAnswer("");
  };

  return <>
    <Navbar />
    <main className="page copilot-page futuristic-copilot">
      <section className="copilot-hero-panel">
        <div className="copilot-orb" aria-hidden="true"><span>✦</span></div>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="copilot-intro">{t.subtitle}</p>
        <div className="language-control">
          <label htmlFor="copilot-language">{t.language}</label>
          <select id="copilot-language" value={language} onChange={(e) => changeLanguage(e.target.value)}>
            {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>
        </div>
      </section>

      <section className="copilot-box futuristic-chat-box">
        <div className="chat-box-heading"><span className="live-dot" /> <span>HEALTHVAULT AI</span><span className="chat-secure-label">Private profile context</span></div>
        <textarea aria-label="Ask Health Copilot" placeholder={t.placeholder} value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") ask(); }} />
        <div className="chat-actions"><small>Ctrl + Enter to send</small><button className="primary-button" onClick={() => ask()} disabled={loading || !question.trim()}>{loading ? t.thinking : t.ask} <span aria-hidden="true">↗</span></button></div>
      </section>

      {answer && <section className="copilot-answer futuristic-answer" aria-live="polite"><div className="answer-icon">✦</div><div className="answer-copy"><h3>{t.answer}</h3><p className="answer-text">{answer}</p><small>{t.disclaimer}</small></div></section>}

      <section className="suggestion-section"><p className="eyebrow">{t.suggestions}</p><div className="suggestions">{t.prompts.map((prompt) => <button key={prompt} onClick={() => ask(prompt)} disabled={loading}>{prompt}<span>↗</span></button>)}</div></section>
    </main>
  </>;
}
