import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const appStyles = `
  .app-root {
    font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
    background: #faf8f7;
    min-height: 100vh;
    color: #180404;
  }
  .app-layout { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem; }
  .app-header { background: #fff; border-bottom: 1px solid #e8ddd9; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; box-shadow: 0 18px 28px rgba(0,0,0,0.04); }
  .app-brand { display: flex; align-items: center; gap: 12px; }
  .app-brand-mark { width: 36px; height: 36px; background: #AC1212; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px; }
  .app-header-title { display: grid; }
  .app-title-main { font-size: 1rem; font-weight: 700; color: #180404; }
  .app-title-sub { font-size: 0.85rem; color: #5a3a3a; }
  .app-back { margin-left: auto; }
  .app-back button, .app-back a { font-size: 0.9rem; color: #AC1212; border: 1px solid rgba(172,18,18,0.18); border-radius: 10px; background: transparent; padding: 8px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
  .app-hero { background: #fff; border-bottom: 1px solid #e8ddd9; padding: 2rem 1rem 1.25rem; }
  .app-hero h1 { font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.1; margin: 0 0 0.9rem; color: #180404; }
  .app-hero p { max-width: 640px; color: #5a3a3a; font-size: 1rem; line-height: 1.7; margin: 0 0 1.5rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; max-width: 700px; }
  .featured-card { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: center; max-width: 980px; margin-top: 18px; }
  .featured-left { background: #fff; border: 1px solid #efe6de; border-radius: 14px; padding: 18px; }
  .featured-left h2 { margin: 0 0 6px; font-size: 1.05rem; color: #180404; }
  .featured-left p { margin: 0; color: #5a3a3a; }
  .featured-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .featured-stat { background: #fff; border: 1px solid #efe6de; border-radius: 12px; padding: 12px; text-align: center; }
  .featured-stat .num { font-size: 1.5rem; font-weight: 800; color: #AC1212; }
  .featured-stat .lbl { font-size: 0.78rem; color: #5a3a3a; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 6px; }
  .stat-card { background: #fff; border: 1px solid #e8ddd9; box-shadow: 0 12px 30px rgba(0,0,0,0.05); border-radius: 14px; padding: 1rem 1.25rem; text-align: center; }
  .stat-card .value { font-size: 1.75rem; font-weight: 700; color: #AC1212; }
  .stat-card .label { font-size: 0.78rem; color: #5a3a3a; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 6px; }
  .filter-bar { background: #fff; border-bottom: 1px solid #e8ddd9; padding: 1rem 1rem; }
  .filter-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .filter-input { flex: 2 1 220px; min-width: 0; }
  .filter-select { flex: 1 1 150px; min-width: 0; appearance: none; }
  .filter-button { flex: 0 0 auto; width: auto; padding: 10px 16px; }
  .filter-input, .filter-select, .filter-button { border: 1px solid #d9d2cc; border-radius: 12px; padding: 10px 14px; font-size: 0.9rem; color: #180404; background: #fff; }
  .filter-input::placeholder { color: #7a6f68; }
  .filter-button { background: transparent; color: #7a6f68; cursor: pointer; white-space: nowrap; }
  .tab-row { display: flex; gap: 6px; overflow-x: auto; padding: 0 1rem; margin: 0; }
  .tab-row button { flex: 0 0 auto; border: none; background: transparent; padding: 0.85rem 1rem; font-size: 0.92rem; color: #5a3a3a; border-bottom: 2px solid transparent; cursor: pointer; transition: color .2s, border-color .2s; }
  .tab-row button.active { color: #AC1212; border-color: #AC1212; font-weight: 700; }
  .content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
  .content-stack { display: flex; flex-direction: column; gap: 1rem; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; align-items: start; }
  .dataset-card { background: #fff; border: 1px solid #e8ddd9; border-radius: 16px; padding: 1.15rem; box-shadow: 0 12px 30px rgba(0,0,0,0.05); transition: transform .2s, border-color .2s; cursor: pointer; align-self: start; height: 220px; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
  .dataset-card:hover { transform: translateY(-2px); border-color: rgba(220,144,30,0.5); }
  .dataset-card-title { font-size: 1rem; font-weight: 700; color: #180404; margin: 0 0 6px; }
  .dataset-card-meta { font-size: 0.9rem; color: #5a3a3a; margin-bottom: 10px; }
  .dataset-card-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
  .dark-card { background: #f8f4f1; border: 1px solid #e8ddd9; color: #180404; }
  .badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 4px 10px; font-size: 0.75rem; font-weight: 700; }
  .badge.red { background: rgba(172,18,18,0.12); color: #AC1212; border: 1px solid rgba(172,18,18,0.18); }
  .badge.gold { background: rgba(220,144,30,0.12); color: #DC901E; border: 1px solid rgba(220,144,30,0.18); }
  .badge.green { background: rgba(13,158,117,0.12); color: #0D9E75; border: 1px solid rgba(13,158,117,0.18); }
  .summary-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #fff; border: 1px solid #e8ddd9; border-radius: 14px; overflow: hidden; }
  .summary-table th, .summary-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #f0e6df; }
  .summary-table th { color: #5a3a3a; background: #faf4ef; text-transform: uppercase; letter-spacing: 0.07em; font-size: 0.75rem; }
  .summary-table tbody tr:nth-child(even) { background: #fcf7f2; }
  .about-card { background: #fff; border: 1px solid #e8ddd9; border-radius: 14px; padding: 1.3rem; }
  .faq-item { border-bottom: 1px solid #e8ddd9; padding: 1.2rem 0; }
  .faq-item:last-child { border-bottom: none; }
  .footer { background: #fff; border-top: 1px solid #e8ddd9; padding: 1.5rem 1rem; }
  .footer a { color: #AC1212; text-decoration: none; }
  @media (max-width: 880px) {
    .content-grid { grid-template-columns: 1fr; }
    .dataset-card-footer { grid-template-columns: 1fr; }
  }
  @media (max-width: 680px) {
    .app-header, .filter-bar, .footer { padding: 1rem; }
    .tab-row { padding: 0 1rem; }
    .filter-input, .filter-select, .filter-button { flex: 1 1 100%; }
    .dataset-card { padding: 1rem; }
    .stats-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
  }
`;

const DATASETS = [
  { id: 1, country: "Kenya", region: "East Africa", org: "Maseno University \u2013 MCAAI", name: "AI4KSL Dataset", signLanguage: "Kenyan Sign Language (KSL)", domain: "Machine Learning", type: "Video + Gloss Corpus", year: 2024, participants: 448, size: "20,000 videos / 14,000 sentences", accessible: true, fee: false, design: "Dataset Collection", topics: ["Sign Language Recognition", "NLP / Gloss Translation", "Education"], contact: "Wanzare et al. (2024). arXiv:2410.18295", desc: "Open-access AI dataset of spontaneous and elicited KSL signs collected from 48 teachers and 400 Deaf learners. ~14,000 English sentences with KSL gloss and ~20,000 signed KSL videos.", lat: -0.39, lng: 37.08 },
  { id: 2, country: "Kenya", region: "East Africa", org: "Maseno University", name: "KSL Word-based Pose Dataset", signLanguage: "Kenyan Sign Language (KSL)", domain: "Computer Vision", type: "Pose Estimation", year: 2025, participants: null, size: "20,000 gesture recordings", accessible: true, fee: false, design: "Dataset Collection", topics: ["Pose Estimation", "Gesture Recognition"], contact: "Maina et al. (2025). DOI: 10.1016/j.dib.2025.111502", desc: "MediaPipe pose estimation dataset of KSL gestures converted into anonymised 3D stickman representations with .npy coordinate files for ML frameworks.", lat: -0.39, lng: 37.08 },
  { id: 3, country: "Kenya", region: "East Africa", org: "SignverseAI (Signvrse)", name: "KSL Motion Capture Dataset", signLanguage: "Kenyan Sign Language (KSL)", domain: "Assistive AI", type: "Motion Capture", year: 2023, participants: null, size: "2,300+ signs", accessible: false, fee: false, design: "Proprietary", topics: ["Avatar Translation", "Sign Language Recognition"], contact: "signvrse.com", desc: "Proprietary motion-capture dataset of 2,300+ KSL signs recorded in collaboration with Deaf Kenyans. Powers the Terp 360 AI avatar translation platform.", lat: -1.28, lng: 36.82 },
  { id: 4, country: "Multi-country", region: "Pan-African", org: "KNUST (Ghana) \u2013 AfriSign", name: "AfriSign Multilingual SL Dataset", signLanguage: "GSL / NSL / KSL / ZSL / ZISL / SASL", domain: "Machine Learning", type: "Video-to-Text Translation", year: 2025, participants: null, size: "6 countries \u2013 Bible verse videos", accessible: true, fee: false, design: "Multilingual Corpus", topics: ["Neural Machine Translation", "Multilingual Sign Language", "Transfer Learning"], contact: "Takyi et al. (2025). Discover AI. DOI:10.1007/s44163-025-00227-7", desc: "First multilingual African sign language translation dataset. Covers Ghana (GSL), Nigeria (NSL), Kenya (KSL), Zambia (ZSL), Zimbabwe (ZISL), South Africa (SASL). Transformer model: 94.6% accuracy, 97.3% precision.", lat: 7.95, lng: -1.02 },
  { id: 5, country: "Nigeria", region: "West Africa", org: "ML Collective / NeurIPS ML4D", name: "Nigerian Sign Language Dataset", signLanguage: "Nigerian Sign Language (NSL)", domain: "Machine Learning", type: "Image Classification", year: 2021, participants: 20, size: "5,000 images / 137 signs", accessible: true, fee: false, design: "Image Dataset", topics: ["Sign-to-Speech", "Object Detection"], contact: "Kolawole et al. (2021). arXiv:2111.00995. HuggingFace: Lanfrica Records", desc: "Pioneer sub-Saharan African SL dataset. 5,000 images covering 137 sign words/phrases including the 27 alphabet letters. Collected from TV broadcaster and 2 Nigerian special education schools. YOLOv5 and MobileNet benchmarks.", lat: 9.08, lng: 8.67 },
  { id: 6, country: "Ethiopia", region: "East Africa", org: "Research Institutions (Ethiopia)", name: "Mendeley EthSL Alphabet Dataset", signLanguage: "Ethiopian Sign Language (EthSL)", domain: "Computer Vision", type: "Static Gesture Images", year: 2022, participants: null, size: "1,172 RGB images", accessible: true, fee: false, design: "Image Dataset", topics: ["Sign Language Recognition", "Landmark Extraction"], contact: "Abeje et al. (2022). Mendeley Data", desc: "RGB images of selected EthSL alphabets for static gesture recognition and landmark extraction. Publicly available on Mendeley Data.", lat: 9.15, lng: 40.49 },
  { id: 7, country: "Ethiopia", region: "East Africa", org: "Ethiopian Research Institutions", name: "Continuous Ethiopian Sign Language (CESL) Dataset", signLanguage: "Ethiopian Sign Language (EthSL)", domain: "Machine Learning", type: "Video Corpus", year: 2022, participants: 22, size: "1,320 HD videos / 65 vocabulary words", accessible: false, fee: false, design: "Video Dataset", topics: ["Continuous Sign Language Recognition", "Daily Life Vocabulary"], contact: "Ethiopian universities", desc: "1,320 high-definition videos across 22 signers; 30 sentences and 65 common vocabulary words focusing on daily life and occupations.", lat: 9.15, lng: 40.49 },
  { id: 8, country: "Ethiopia", region: "East Africa", org: "Ethiopian Research Institutions", name: "Skeleton EthSL Dataset", signLanguage: "Ethiopian Sign Language (EthSL)", domain: "Computer Vision", type: "Keypoint / Skeletal", year: 2025, participants: null, size: "5,600 annotated video tracks", accessible: true, fee: false, design: "Skeletal Dataset", topics: ["Pose Estimation", "Real-time Recognition", "CNN-LSTM / BiLSTM / GRU"], contact: "Scientific Reports (2025). Nature/Springer", desc: "5,600 annotated video keypoint coordinate tracks via MediaPipe Holistic. Used to benchmark CNN-LSTM, LSTM, BiLSTM and GRU. 94% signer-dependent accuracy, 73% signer-independent.", lat: 9.15, lng: 40.49 },
  { id: 9, country: "Tanzania", region: "East Africa", org: "University of Dodoma (UDOM)", name: "UDOM TzSL Dataset", signLanguage: "Tanzanian Sign Language (TSL)", domain: "Computer Vision", type: "Image Dataset", year: 2021, participants: null, size: "3,000 images / 30 signs", accessible: false, fee: false, design: "Image Dataset", topics: ["Sign Language Recognition", "CNN vs SVM"], contact: "Myagila & Kilavo (2022). Applied AI, 36(1). DOI:10.1080/08839514.2021.2005297", desc: "~3,000 images covering 30 common educational TSL signs captured via HD camera. Used to benchmark CNN (96% accuracy) vs SVM for Tanzanian sign language recognition.", lat: -6.37, lng: 34.89 },
  { id: 10, country: "Tanzania", region: "East Africa", org: "NM-AIST (Arusha)", name: "TSL Mobile Phone Video Corpora", signLanguage: "Tanzanian Sign Language (TSL)", domain: "Computer Vision", type: "Video \u2013 Spatio-temporal", year: 2025, participants: null, size: "Unconstrained mobile video", accessible: false, fee: false, design: "Video Dataset", topics: ["Continuous Sign Language", "CNN-GRU / CNN-LSTM", "Signer Independence"], contact: "Myagila et al. (2025). Front. Artif. Intell. 8:1630743", desc: "Spatio-temporal video datasets recorded on selfie cameras in unconstrained environments. Captures hand dominance, signer independence, and image quality variation. Used for CNN-GRU and CNN-LSTM models.", lat: -3.36, lng: 36.68 },
  { id: 11, country: "Tanzania", region: "East Africa", org: "SignWiki Tanzania / Community", name: "SignWiki Tanzania Dictionary", signLanguage: "Tanzanian Sign Language (TSL)", domain: "Datasets", type: "Open Dictionary", year: 2020, participants: null, size: "2,194 signs", accessible: true, fee: false, design: "Open Lexical Resource", topics: ["Sign Language Dictionary", "Open Access"], contact: "sign-lang.uni-hamburg.de/lr/compendium/language/tza.html", desc: "Open-access multifaceted dictionary of TSL. Signs arranged alphabetically and by category, searchable by Swahili keywords. 2,194 signs documented.", lat: -6.37, lng: 34.89 },
  { id: 12, country: "Ghana", region: "West Africa", org: "KNUST / SignTalk-Gh", name: "SignTalk-Gh Healthcare GSL Dataset", signLanguage: "Ghanaian Sign Language (GSL)", domain: "Datasets", type: "Healthcare Domain Corpus", year: 2026, participants: null, size: "Doctor-patient conversations", accessible: true, fee: false, design: "Domain-specific Corpus", topics: ["Healthcare Accessibility", "Sign Language Translation", "Retrieval-based Synthesis"], contact: "Scientific Reports (2026). DOI:10.1038/s41598-026-43478-9", desc: "First domain-specific Ghanaian Sign Language dataset for healthcare capturing doctor\u2013patient conversations. Supports recognition and retrieval-based text-to-sign applications.", lat: 7.95, lng: -1.02 },
  { id: 13, country: "South Africa", region: "Southern Africa", org: "University of Cape Town (UCT)", name: "SASL Glove-based Gesture Database", signLanguage: "South African Sign Language (SASL)", domain: "Machine Learning", type: "Glove-based Sensor", year: 2015, participants: null, size: "SASL static alphabets", accessible: false, fee: false, design: "Sensor Dataset", topics: ["Gesture Recognition", "Hardware-based SL"], contact: "McInnes et al. UCT Open Research Repository", desc: "First SASL dataset using data glove to capture static SASL gestures. Hardware-dependent (kinetic/5DT gloves). Foundation for later SASL AI research.", lat: -30.56, lng: 22.94 },
  { id: 14, country: "Uganda", region: "East Africa", org: "Makerere University", name: "Ugandan SL-to-Speech Corpus", signLanguage: "Ugandan Sign Language (USL)", domain: "Machine Learning", type: "Recognition Corpus", year: 2024, participants: null, size: "Small undergraduate corpus", accessible: false, fee: false, design: "Undergraduate Research", topics: ["Sign-to-Speech", "Real-time Translation"], contact: "Nakuwanda, B. H. (2024). Makerere University Dissertation", desc: "Undergraduate dissertation dataset for real-time Ugandan Sign Language to speech translation. First known USL AI corpus from Makerere University.", lat: 1.37, lng: 32.29 },
  { id: 15, country: "Central Africa", region: "Central Africa", org: "Central African Research", name: "CASL-W60 Dataset", signLanguage: "Central African Sign Languages", domain: "Datasets", type: "Video Reference Corpus", year: 2023, participants: null, size: "60 vocabulary items", accessible: false, fee: false, design: "Video Dataset", topics: ["Central African Sign Language", "Low-resource SL"], contact: "CASL-W60 documentation", desc: "Dataset covering Central African sign languages (CASL) with video references. Covers vocabulary relevant to Central African Deaf communities. Limited public documentation available.", lat: 6.61, lng: 20.94 },
  { id: 16, country: "Kenya", region: "East Africa", org: "Zerobionic Africa", name: "Zerobionic SL-to-Speech Data", signLanguage: "Kenyan Sign Language (KSL)", domain: "Computer Vision", type: "Real-time Video / Robotics", year: 2023, participants: null, size: "Proprietary robotics dataset", accessible: false, fee: false, design: "Proprietary", topics: ["Robotics", "Real-time CV", "Speech-to-Sign"], contact: "zerobionic.com / Nairobi", desc: "AI + robotics system data for real-time speech-to-sign and sign-to-speech. Uses computer vision and robotic arms for STEM education in sign language. Demonstrated at KICC, May 2026.", lat: -1.28, lng: 36.82 },
  { id: 17, country: "Morocco", region: "North Africa", org: "MICCAI 2024 / AFRICAI", name: "AFRICAI Open Imaging Repository", signLanguage: "N/A (Disability AI)", domain: "Datasets", type: "Medical Imaging", year: 2024, participants: null, size: "Pan-African brain MRI + histology", accessible: true, fee: false, design: "Open Repository", topics: ["Neuroimaging", "Brain Tumour Segmentation", "Disability AI"], contact: "Euro-BioImaging Medical Imaging Archive", desc: "Established at MICCAI 2024 (first African continent MICCAI). Open imaging for AfNiA brain MRI archive, BraTS-Africa brain tumour segmentation, and AMONuSeg histological dataset for African populations.", lat: 31.79, lng: -7.09 },
];

// Sourced from the HAIDI Master Stakeholder Database (Ventures & Innovators sheet).
// Combined tab per user request: "Innovators & Ventures".
const VENTURES = [{"id": 1, "name": "Signvrse", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Computer Vision, NLP, Sign Language Recognition", "product": "AI-powered sign language translation platform (Terp 360) using 3D avatars and motion capture", "stage": "Growth", "website": "https://signvrse.com", "notes": "KSL datasets; supported by Innovate Now/AT4D", "lat": -1.28, "lng": 36.82}, {"id": 2, "name": "Lugha Ishara", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "NLP, Sign Language", "product": "KSL learning platform; language development data for deaf children", "stage": "Early Traction", "website": "https://www.lughaishara.org", "notes": "Supported by Innovate Now", "lat": -1.28, "lng": 36.82}, {"id": 3, "name": "Ishara AI", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "NLP, Speech Recognition, Sign Language Recognition", "product": "Real-time sign language, speech, and text translation", "stage": "Prototype / Pilot", "website": "https://ishara.co.ke", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 4, "name": "Sautora", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Generative AI, Sign Language Recognition, Computer Vision", "product": "AI platform converting speech/written language to KSL via 3D avatar", "stage": "MVP / Pilot", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 5, "name": "Signs Media Kenya", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "AI sign language interpretation", "product": "KSL interpretation & accessible media production", "stage": "Active", "website": "https://signsmedia.co.ke", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 6, "name": "Hali Halisi", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Platform AI", "product": "Interpreter matching platform connecting organisations with vetted KSL interpreters", "stage": "MVP", "website": "https://www.halisi.io", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 7, "name": "Deaf Outreach Program Kenya", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "LMS / EdTech AI", "product": "Inclusive digital learning platform with KSL educational content; online & offline", "stage": "Growth", "website": "https://deafopkenya.org", "notes": "Innovate Now Cohort 6", "lat": -1.28, "lng": 36.82}, {"id": 8, "name": "Deaf Elimu Plus", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "AI-powered learning tools", "product": "KSL dictionaries, educational content, AI-powered learning tools for Deaf learners", "stage": "Active", "website": "https://www.deafelimuplus.co.ke", "notes": "Deaf-led EdTech", "lat": -1.28, "lng": 36.82}, {"id": 9, "name": "eSharah (Loho Learning)", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "NLP, KSL EdTech", "product": "Inclusive digital learning solutions using KSL for Deaf learners", "stage": "Active", "website": "https://loholearning.co.ke", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 10, "name": "BlackRhino VR", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "AR, Computer Vision", "product": "AR medication information in sign language, audio, visual instructions", "stage": "Early Stage", "website": "https://www.blackrhinovr.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 11, "name": "Skio", "country": "Kenya", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Assistive Tech AI", "product": "Assistive technology solutions enhancing communication for hearing impairments", "stage": "Early Stage", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 12, "name": "Deaftronics", "country": "Botswana", "region": "Southern Africa", "focus": "Hearing Impairment", "aiSpecialization": "Hardware / Solar AT", "product": "Solar-powered rechargeable hearing aids; hearing screening; trains people with hearing impairments", "stage": "Active", "website": "https://deaftronics.wordpress.com", "notes": null, "lat": -24.65, "lng": 25.91}, {"id": 13, "name": "Reah", "country": "South Africa", "region": "Southern Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Sign-to-text, speech-to-text, wearable AI", "product": "Sign-to-text, speech-to-text, learning apps, wearable interpreter systems (REAH C9)", "stage": "Active", "website": "https://www.reah.co.za", "notes": "Focuses on African sign languages", "lat": -30.56, "lng": 22.94}, {"id": 14, "name": "DeafSync", "country": "Benin", "region": "West Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "AI sign language translation, adaptive e-learning", "product": "DeafTranslator (real-time), Lambdy (adaptive e-learning), Vocood (media dubbing)", "stage": "Early Stage", "website": "https://deafsync.com", "notes": "Strong focus on African sign languages & API", "lat": 9.31, "lng": 2.32}, {"id": 15, "name": "TalkSign", "country": "Nigeria", "region": "West Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Real-time bidirectional sign language AI", "product": "Real-time bidirectional sign language AI (speech \u2194 sign), avatar-based translation (Palm/Echo)", "stage": "Early Stage", "website": "https://www.talksign.co", "notes": "Large-scale sign language datasets", "lat": 9.08, "lng": 8.67}, {"id": 16, "name": "Diversity Innovations Initiative", "country": "Uganda", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "Mobile Health AI", "product": "Mobile app providing Deaf young people with accessible SRH information", "stage": "Active", "website": "https://diversityinnovationsinitiative.com", "notes": null, "lat": 1.37, "lng": 32.29}, {"id": 17, "name": "e-Kitabu", "country": "Kenya/Rwanda/Malawi", "region": "East Africa", "focus": "Hearing Impairment / Deaf", "aiSpecialization": "KSL EdTech, accessible e-books", "product": "Accessible digital learning with KSL content, accessible e-books, teacher training", "stage": "Active", "website": "https://www.ekitabu.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 18, "name": "Sauti Y3tu", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision, Wearable AI", "product": "Sightra -AI-powered wearable navigation system with real-time audio descriptions", "stage": "Active", "website": "https://sautiyetuassistive.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 19, "name": "Hope Tech Plus Kenya", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision, IoT", "product": "Sixth Sense -echolocation/sonar AI navigation device for visually impaired persons", "stage": "Scaling", "website": "https://www.hopetech.vision", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 20, "name": "Provision Sight Africa", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision / Assistive AI", "product": "Vision accessibility solutions", "stage": "Early MVP", "website": "https://provisionsightafrica.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 21, "name": "Enabled", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "AI Computer Vision", "product": "AI-powered smart glasses for real-time environment identification", "stage": "Early MVP", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 22, "name": "AuraLearn", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "Generative AI, Accessibility AI", "product": "AI-powered inclusive learning platform transforming visual materials for visually impaired", "stage": "Prototype", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 23, "name": "Vinsighte / Visis", "country": "Nigeria", "region": "West Africa", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision, OCR", "product": "AI reading and accessibility application for visually impaired", "stage": "Growth", "website": "https://www.vinsighte.com.ng", "notes": null, "lat": 9.08, "lng": 8.67}, {"id": 24, "name": "Senses Hub", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "aiSpecialization": "Vision AI", "product": "Vision accessibility projects", "stage": "Active", "website": "https://senseshub.vision", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 25, "name": "Be My Eyes", "country": "Global", "region": "Pan-African", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision, Generative AI", "product": "AI image description and volunteer-assisted accessibility app", "stage": "Scaling", "website": "https://www.bemyeyes.com", "notes": null, "lat": null, "lng": null}, {"id": 26, "name": "Seeing AI (Microsoft)", "country": "Global", "region": "Pan-African", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision, OCR", "product": "AI narration and environmental interpretation for blind users", "stage": "Mature", "website": "https://www.microsoft.com/ai/seeing-ai", "notes": null, "lat": null, "lng": null}, {"id": 27, "name": "Google Lookout", "country": "Global", "region": "Pan-African", "focus": "Visual Impairment", "aiSpecialization": "Computer Vision", "product": "AI-powered object recognition and scene description for blind users", "stage": "Mature", "website": "https://play.google.com", "notes": null, "lat": null, "lng": null}, {"id": 28, "name": "Utter", "country": "Kenya", "region": "East Africa", "focus": "Speech Impairment", "aiSpecialization": "Speech Recognition AI", "product": "AI speech recognition for Kenyan English & Swahili speakers with speech impairments", "stage": "Early MVP", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 29, "name": "Chacha", "country": "Kenya", "region": "East Africa", "focus": "Speech Impairment", "aiSpecialization": "Speech Recognition, Conversational AI", "product": "AI speech development platform for children with speech impairments", "stage": "Prototype", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 30, "name": "Spoken AAC", "country": "Global", "region": "Pan-African", "focus": "Speech Impairment", "aiSpecialization": "NLP, Predictive Text AI", "product": "AI-assisted AAC communication app for speech disabilities", "stage": "Growth", "website": "https://spokenaac.com", "notes": null, "lat": null, "lng": null}, {"id": 31, "name": "Tobii Dynavox", "country": "Global", "region": "Pan-African", "focus": "Speech Impairment", "aiSpecialization": "Eye Tracking AI, AAC Technology", "product": "AI-powered speech-generating and communication devices", "stage": "Scaling", "website": "https://us.tobiidynavox.com", "notes": null, "lat": null, "lng": null}, {"id": 32, "name": "Whispp", "country": "Global", "region": "Pan-African", "focus": "Speech Impairment", "aiSpecialization": "Voice AI, Speech Enhancement", "product": "AI voice technology for people with speech impairments", "stage": "Growth", "website": "https://whispp.com", "notes": null, "lat": null, "lng": null}, {"id": 33, "name": "SpeechAgent (Research)", "country": "Global", "region": "Pan-African", "focus": "Speech Impairment", "aiSpecialization": "Speech Recognition, NLP", "product": "AI mobile speech assistance for dysarthria, aphasia, stuttering", "stage": "Research", "website": "https://arxiv.org", "notes": null, "lat": null, "lng": null}, {"id": 34, "name": "Zerobionic", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Speech", "aiSpecialization": "Natural Language Processing", "product": "AI-powered robotic systems for educational accessibility -hearing and speech impairments", "stage": "Early Deployment", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 35, "name": "Uptyke Education", "country": "Kenya", "region": "East Africa", "focus": "Inclusive EdTech", "aiSpecialization": "AI-powered inclusive learning", "product": "Accessible K-12 digital learning content", "stage": "Growth", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 36, "name": "Learning Differently", "country": "Kenya", "region": "East Africa", "focus": "Neurodiversity / Inclusive Learning", "aiSpecialization": "Adaptive learning support", "product": "Inclusive learning platform and tools", "stage": "MVP", "website": "https://learningdifferently.africa", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 37, "name": "AssistiveMath", "country": "Kenya", "region": "East Africa", "focus": "Accessible STEM Education", "aiSpecialization": "AI-enabled learning accessibility", "product": "Assistive mathematics learning tools", "stage": "Prototype", "website": "https://assistivemath.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 38, "name": "Kytabu", "country": "Kenya", "region": "East Africa", "focus": "Inclusive Education", "aiSpecialization": "Adaptive Learning AI", "product": "Digital learning platform with accessibility capabilities", "stage": "Growth", "website": "https://kytabu.africa", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 39, "name": "Braille AI Tutor Projects", "country": "Pan-Africa", "region": "Pan-African", "focus": "Visual Impairment", "aiSpecialization": "OCR, NLP", "product": "AI-powered Braille learning and literacy tools", "stage": "Research / Pilot", "website": "https://www.unesco.org", "notes": null, "lat": null, "lng": null}, {"id": 40, "name": "BRCK Education (Kio Kit)", "country": "Kenya", "region": "East Africa", "focus": "Inclusive Education -Underserved", "aiSpecialization": "Offline EdTech", "product": "Offline digital learning for underserved learners", "stage": "Growth", "website": "https://brck.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 41, "name": "Access Ability Africa Limited", "country": "Malawi", "region": "Southern Africa", "focus": "Visual Impairment", "aiSpecialization": "Natural Language Processing", "product": "Inclusive solutions for equal access to education for persons with disabilities", "stage": "Early Deployment", "website": null, "notes": null, "lat": -13.25, "lng": 34.3}, {"id": 42, "name": "Riziki Source", "country": "Kenya", "region": "East Africa", "focus": "Disability Inclusion & Employment", "aiSpecialization": "Inclusive employment technology", "product": "Riziki inclusive job-matching platform", "stage": "Growth", "website": "https://rizikisource.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 43, "name": "Jobility", "country": "Egypt", "region": "North Africa", "focus": "Inclusive Employment", "aiSpecialization": "AI-powered job matching", "product": "Recruitment and employability platform for persons with disabilities", "stage": "MVP", "website": null, "notes": null, "lat": 26.82, "lng": 30.8}, {"id": 44, "name": "Kibo XS", "country": "Rwanda", "region": "East Africa", "focus": "Inclusive Employment", "aiSpecialization": "AI Recruitment Tools", "product": "Inclusive hiring and accessibility-centered workforce solutions", "stage": "Early Stage", "website": "https://kibo-xs.com", "notes": null, "lat": -1.94, "lng": 29.87}, {"id": 45, "name": "TuConnect / Job Genius", "country": "Kenya", "region": "East Africa", "focus": "Inclusive Employment", "aiSpecialization": "NLP, LLM", "product": "AI career development, job matching, professional growth platform", "stage": "Early Deployment", "website": null, "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 46, "name": "PsychX", "country": "Kenya", "region": "East Africa", "focus": "Mental Health", "aiSpecialization": "AI mental health assistance", "product": "Digital mental wellness platform", "stage": "MVP", "website": "https://psychx.io", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 47, "name": "UlizaLlama", "country": "Kenya", "region": "East Africa", "focus": "Mental Health / Conversational AI", "aiSpecialization": "Generative AI, NLP", "product": "AI assistant adaptable for mental wellness and accessibility", "stage": "Early Stage", "website": "https://ulizallama.co.ke", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 48, "name": "Earkick", "country": "Global", "region": "Pan-African", "focus": "Mental Health", "aiSpecialization": "Conversational AI, Predictive Analytics", "product": "AI mental health companion and emotional wellness platform", "stage": "Growth", "website": "https://www.earkick.com", "notes": null, "lat": null, "lng": null}, {"id": 49, "name": "Elomia Health", "country": "Global", "region": "Pan-African", "focus": "Mental Health", "aiSpecialization": "Conversational AI, NLP", "product": "AI conversational mental health support chatbot", "stage": "Growth", "website": "https://www.elomia.com", "notes": null, "lat": null, "lng": null}, {"id": 50, "name": "Jacaranda Health", "country": "Kenya", "region": "East Africa", "focus": "Maternal Mental Health", "aiSpecialization": "Conversational AI, Digital Health AI", "product": "AI-enabled maternal health support and digital counselling", "stage": "Scaling", "website": "https://jacarandahealth.org", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 51, "name": "mDoc", "country": "Nigeria", "region": "West Africa", "focus": "Mental Health & Chronic Care", "aiSpecialization": "AI-enabled Digital Health", "product": "Virtual care and behavioral health support", "stage": "Growth", "website": "https://mymdoc.com", "notes": null, "lat": 9.08, "lng": 8.67}, {"id": 52, "name": "Seizure Assistant", "country": "Zambia", "region": "Southern Africa", "focus": "HealthTech -Epilepsy", "aiSpecialization": "AI-assisted health monitoring", "product": "Seizure tracking and alert support tool", "stage": "MVP", "website": null, "notes": null, "lat": -13.13, "lng": 27.85}, {"id": 53, "name": "eScort Technologies", "country": "Uganda", "region": "East Africa", "focus": "Health -Disability", "aiSpecialization": "IoT / AI sensors", "product": "Embedded AI devices predicting health of disabled people; seizure alerts", "stage": "Early Deployment", "website": null, "notes": null, "lat": 1.37, "lng": 32.29}, {"id": 54, "name": "Murinzi Health Box", "country": "Rwanda", "region": "East Africa", "focus": "Health -Underserved", "aiSpecialization": "NLP", "product": "AI-powered health kiosk for private, inclusive SRH access", "stage": "Pilot", "website": null, "notes": null, "lat": -1.94, "lng": 29.87}, {"id": 55, "name": "hearX Group", "country": "South Africa", "region": "Southern Africa", "focus": "Hearing Impairment", "aiSpecialization": "Machine Learning, Audio Processing", "product": "AI-powered smartphone hearing tests and digital audiology", "stage": "Scaling", "website": "https://www.hearxgroup.com", "notes": null, "lat": -30.56, "lng": 22.94}, {"id": 56, "name": "Roverlabs Tanzania", "country": "Tanzania", "region": "East Africa", "focus": "Physical Disability / Amputation", "aiSpecialization": "AI/ML -tinyML, generative design", "product": "3D printed prosthetics & bionic hand; tinyML for EMG muscle signals", "stage": "Early Deployment", "website": null, "notes": "African Union Best Prize -Health AI & Robotics 2024", "lat": -6.37, "lng": 34.89}, {"id": 57, "name": "JKUAT Social Robotics Lab", "country": "Kenya", "region": "East Africa", "focus": "ASD / Hearing / Physical", "aiSpecialization": "ML, Computer Vision, Wearable Tech", "product": "Assistive ML/AI augmenting communication for ASD, hearing, physical disabilities", "stage": "Research", "website": "https://www.jkuatsocialroboticslab.com", "notes": "University lab", "lat": -1.28, "lng": 36.82}, {"id": 58, "name": "Neuronest", "country": "Kenya", "region": "East Africa", "focus": "Neurotechnology & Education", "aiSpecialization": "AI-driven neuro-support systems", "product": "Personalized neuro-support platform", "stage": "Early MVP", "website": "http://beyondbrainbarriersmhs.com", "notes": null, "lat": -1.28, "lng": 36.82}, {"id": 59, "name": "Hypnagogic React", "country": "South Africa", "region": "Southern Africa", "focus": "Smart Home / Accessibility", "aiSpecialization": "AI biometric, sleep automation", "product": "App using biometric devices to automate sleep-based media and smart home controls", "stage": "Prototype", "website": null, "notes": null, "lat": -30.56, "lng": 22.94}, {"id": 60, "name": "Neurotech Africa", "country": "South Africa", "region": "Southern Africa", "focus": "Neurodiversity / Cognitive Accessibility", "aiSpecialization": "Brain-Computer Interfaces, AI", "product": "Neurotechnology and cognitive accessibility innovation", "stage": "Early Stage", "website": "https://neurotech.africa", "notes": null, "lat": -30.56, "lng": 22.94}, {"id": 61, "name": "ShazaCin", "country": "South Africa", "region": "Southern Africa", "focus": "Media Accessibility", "aiSpecialization": "AI Audio Processing", "product": "AI-supported audio description technology for accessible media", "stage": "Growth", "website": "https://shazacin.com", "notes": null, "lat": -30.56, "lng": 22.94}, {"id": 62, "name": "Ace Mobility", "country": "Kenya", "region": "East Africa", "focus": "Physical / Mobility Disability", "aiSpecialization": "AI-enabled transport", "product": "Accessible transport platform for people with mobility challenges", "stage": "Active", "website": "https://acemobility.co.ke", "notes": null, "lat": -1.28, "lng": 36.82}];

// Sourced from the HAIDI Master Stakeholder Database (Master Overview sheet),
// Capacity Building + Advocacy & NGOs categories.
const ORGANISATIONS = [{"id": 1, "category": "Capacity Building", "subType": "Education Institution", "name": "Kenya Institute of Special Education (KISE)", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://kise.ac.ke", "desc": "Special education training & curriculum", "lat": -1.28, "lng": 36.82}, {"id": 2, "category": "Capacity Building", "subType": "Capacity Building Org", "name": "Technology Advocacy Centre (TAC)", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://www.tac.or.ke", "desc": "AT services, training & advocacy", "lat": -1.28, "lng": 36.82}, {"id": 3, "category": "Capacity Building", "subType": "Research Programme", "name": "AI4D Hub -Kenya Component", "country": "Kenya", "region": "East Africa", "focus": "Disability & AI", "website": "https://idrc-crdi.ca", "desc": "AI & disability inclusion research -IDRC funded", "lat": -1.28, "lng": 36.82}, {"id": 4, "category": "Capacity Building", "subType": "Education Org", "name": "Kenya Society for Deaf Children (KSDC)", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Deaf", "website": "https://deafchildrensociety-kenya.org", "desc": "Deaf children education & support", "lat": -1.28, "lng": 36.82}, {"id": 5, "category": "Capacity Building", "subType": "Deaf OPD", "name": "Deaf Empowerment Kenya", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Deaf", "website": "https://www.dekkenya.org", "desc": "Deaf community empowerment", "lat": -1.28, "lng": 36.82}, {"id": 6, "category": "Capacity Building", "subType": "Professional Assoc", "name": "Kenya Sign Language Interpreters Assoc (KSLIA)", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Deaf", "website": "https://kslia.org", "desc": "Interpreter training & professional standards", "lat": -1.28, "lng": 36.82}, {"id": 7, "category": "Capacity Building", "subType": "Education Institution", "name": "Humble Hearts School", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Deaf", "website": null, "desc": "Kenya's first bilingual school for Deaf learners", "lat": -1.28, "lng": 36.82}, {"id": 8, "category": "Capacity Building", "subType": "Community / Mental Health", "name": "Talking Hands Listening Eyes (THLEP)", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Deaf", "website": null, "desc": "KSL mental health awareness for Deaf mothers", "lat": -1.28, "lng": 36.82}, {"id": 9, "category": "Capacity Building", "subType": "Research / Language", "name": "Sauti Halisi", "country": "Kenya", "region": "East Africa", "focus": "Hearing / Language", "website": null, "desc": "Swahili speech-to-text & code-switching research", "lat": -1.28, "lng": 36.82}, {"id": 10, "category": "Capacity Building", "subType": "Dataset Project", "name": "Lacuna Fund -Kencorpus", "country": "Kenya", "region": "East Africa", "focus": "Language / disability data", "website": "https://lacunafund.org", "desc": "Kenyan language corpus for inclusive AI", "lat": -1.28, "lng": 36.82}, {"id": 11, "category": "Capacity Building", "subType": "AI / Language Research", "name": "African Next Voices Project Kenya", "country": "Kenya", "region": "East Africa", "focus": "Language / hearing", "website": "https://huggingface.co/Anv-ke", "desc": "Voice & language dataset project", "lat": -1.28, "lng": 36.82}, {"id": 12, "category": "Capacity Building", "subType": "Vision OPD", "name": "Kenya Society for the Blind (KSB)", "country": "Kenya", "region": "East Africa", "focus": "Visual Impairment", "website": "https://www.ksblind.org", "desc": "Blind community support & services", "lat": -1.28, "lng": 36.82}, {"id": 13, "category": "Capacity Building", "subType": "Education Org", "name": "Kilimanjaro Blind Trust Africa (KBTA)", "country": "East Africa", "region": "Pan-African", "focus": "Visual Impairment", "website": "https://www.kilimanjaroblindtrust.org", "desc": "Blind trust -East Africa", "lat": null, "lng": null}, {"id": 14, "category": "Advocacy & NGOs", "subType": "Disability OPD", "name": "Northern Nomadic Disabled Persons' Org (NONDO)", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": null, "desc": "Regional DPO -northern Kenya", "lat": -1.28, "lng": 36.82}, {"id": 15, "category": "Advocacy & NGOs", "subType": "Disability Fund", "name": "National Fund for the Disabled of Kenya (NFDK)", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://nfdk.or.ke", "desc": "National disability fund", "lat": -1.28, "lng": 36.82}, {"id": 16, "category": "Advocacy & NGOs", "subType": "Disability OPD", "name": "United Disabled Persons of Kenya", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": null, "desc": "Umbrella disability OPD", "lat": -1.28, "lng": 36.82}, {"id": 17, "category": "Advocacy & NGOs", "subType": "INGO", "name": "CBM Kenya", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://cbmkenya.org", "desc": "International disability organisation -Kenya", "lat": -1.28, "lng": 36.82}, {"id": 18, "category": "Advocacy & NGOs", "subType": "Community Org", "name": "Gifted Community Centre", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://giftedcommunitypwd.org", "desc": "Community support for persons with disabilities", "lat": -1.28, "lng": 36.82}, {"id": 19, "category": "Advocacy & NGOs", "subType": "Partnership", "name": "ATscale Partnership Kenya / CHAI", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://atscalepartnership.org/kenya", "desc": "AT access programme -Kenya", "lat": -1.28, "lng": 36.82}, {"id": 20, "category": "Advocacy & NGOs", "subType": "Continental Network", "name": "African Disability Forum", "country": "Pan-Africa", "region": "Pan-African", "focus": "All disabilities", "website": "https://adf.org", "desc": "Continental disability rights & advocacy network", "lat": null, "lng": null}, {"id": 21, "category": "Advocacy & NGOs", "subType": "INGO", "name": "CBM Global Disability Inclusion", "country": "Pan-Africa", "region": "Pan-African", "focus": "All disabilities", "website": "https://cbm-global.org", "desc": "Global disability inclusion organisation", "lat": null, "lng": null}, {"id": 22, "category": "Advocacy & NGOs", "subType": "INGO", "name": "Light for the World Africa", "country": "Pan-Africa", "region": "Pan-African", "focus": "All disabilities", "website": "https://light-for-the-world.org", "desc": "Inclusive education & AT focus", "lat": null, "lng": null}, {"id": 23, "category": "Advocacy & NGOs", "subType": "Programme", "name": "Inclusive Futures (Kenya)", "country": "Kenya", "region": "East Africa", "focus": "All disabilities", "website": "https://inclusivefutures.org", "desc": "DFID-supported inclusive development programme", "lat": -1.28, "lng": 36.82}, {"id": 24, "category": "Advocacy & NGOs", "subType": "Disability OPD", "name": "Cerebral Palsy Society of Kenya", "country": "Kenya", "region": "East Africa", "focus": "Cerebral palsy", "website": null, "desc": "Specialist disability OPD", "lat": -1.28, "lng": 36.82}, {"id": 25, "category": "Advocacy & NGOs", "subType": "INGO", "name": "Sense International Africa", "country": "Kenya", "region": "East Africa", "focus": "Deafblind", "website": "https://senseinternational.org.uk", "desc": "Deafblind community support & assistive tech", "lat": -1.28, "lng": 36.82}, {"id": 26, "category": "Advocacy & NGOs", "subType": "INGO", "name": "Starkey Hearing Foundation", "country": "Kenya", "region": "East Africa", "focus": "Hearing impairment", "website": null, "desc": "Hearing aids & community support", "lat": -1.28, "lng": 36.82}, {"id": 27, "category": "Advocacy & NGOs", "subType": "NGO", "name": "inABLE", "country": "Kenya", "region": "East Africa", "focus": "Visual impairment", "website": null, "desc": "Assistive tech & digital inclusion", "lat": -1.28, "lng": 36.82}, {"id": 28, "category": "Advocacy & NGOs", "subType": "INGO", "name": "Sightsavers Africa", "country": "Pan-Africa", "region": "Pan-African", "focus": "Visual impairment", "website": "https://sightsavers.org", "desc": "Vision impairment & accessibility programmes", "lat": null, "lng": null}];

// Compiled from a Google Scholar literature search on sign language research
// and datasets across Africa (search restricted to African countries/regions).
const PUBLICATIONS = [{"id": 1, "title": "AI4KSL: Kenyan Sign Language Dataset for Bridging Communication Barriers Among Deaf Learners", "authors": "Wanzare, L.D.A., Okutoyi, J., Kang'ahi, M., Ayere, M.", "year": 2024, "venue": "arXiv preprint 2410.18295", "country": "Kenya", "link": "https://scholar.google.com/scholar?q=AI4KSL%3A+Kenyan+Sign+Language+Dataset+for+Bridging+Communication+Barriers+Among+Deaf+Learners", "summary": "Describes the AI4KSL project, which built an open-access dataset of spontaneous and elicited Kenyan Sign Language from 48 teachers and 400 Deaf learners to support English-to-KSL translation technology.", "region": "East Africa"}, {"id": 2, "title": "Kenyan Sign Language Word-Based Pose Dataset", "authors": "Maina, E., Wanzare, L., Obuhuma, J., Ayere, M., Kang'ahi, M., Okutoyi, J.", "year": 2025, "venue": "Data in Brief, DOI:10.1016/j.dib.2025.111502", "country": "Kenya", "link": "https://scholar.google.com/scholar?q=Kenyan+Sign+Language+Word-Based+Pose+Dataset", "summary": "Presents 20,000 KSL gesture recordings converted to anonymised pose-estimation stickman data using MediaPipe, intended for machine learning research on a low-resource sign language.", "region": "East Africa"}, {"id": 3, "title": "AfriSign: African Sign Languages Machine Translation", "authors": "Takyi, K., Gyening, R., Gueuwou, S., Nyarko, M., Adade, R., Borkor, R., Boadu-Acheampong, S., Tabari, L.", "year": 2025, "venue": "Discover Artificial Intelligence, DOI:10.1007/s44163-025-00227-7", "country": "Multi-country (Ghana, Nigeria, Kenya, Zambia, Zimbabwe, South Africa)", "link": "https://scholar.google.com/scholar?q=AfriSign%3A+African+Sign+Languages+Machine+Translation", "summary": "Introduces the first multilingual African sign language translation dataset spanning six countries, built from Bible-verse videos, and reports a transformer translation model reaching over 94 percent accuracy.", "region": "Pan-African"}, {"id": 4, "title": "A Large-Scale Multimodal Dataset for Healthcare-Domain Ghanaian Sign Language Translation and Retrieval-Based Synthesis (SignTalk-Gh)", "authors": "Ahene, E., Frowne, C., Adetor, R., Amoah, N., Adade, R., Owusu-Agyemang, K., Gyening, R., Agyemang, J., Kponyo, B., Acheampong, E., Kponyo, J.", "year": 2026, "venue": "Scientific Reports, DOI:10.1038/s41598-026-43478-9", "country": "Ghana", "link": "https://scholar.google.com/scholar?q=A+Large-Scale+Multimodal+Dataset+for+Healthcare-Domain+Ghanaian+Sign+Language+Translation+and+Retrieval-Based+Synthesis+%28SignTalk-Gh%29", "summary": "Introduces the first domain-specific Ghanaian Sign Language dataset for healthcare, built from doctor-patient conversations to support recognition and retrieval-based translation in clinical settings.", "region": "West Africa"}, {"id": 5, "title": "Ghanaian Sign Language Recognition Using Deep Learning", "authors": "Edward, M., et al.", "year": 2019, "venue": "Proc. Intl Conf. on Pattern Recognition and Artificial Intelligence, DOI:10.1145/3357777.3357784", "country": "Ghana", "link": "https://scholar.google.com/scholar?q=Ghanaian+Sign+Language+Recognition+Using+Deep+Learning", "summary": "Builds an original Ghanaian Sign Language dataset in the absence of a public one and evaluates a convolutional neural network for recognition, with plans to release the dataset for future research.", "region": "West Africa"}, {"id": 6, "title": "Sign-to-Speech Model for Sign Language Understanding: A Case Study of Nigerian Sign Language", "authors": "Kolawole, S., Osakuade, O., Saxena, N., Olorisade, B.K.", "year": 2021, "venue": "arXiv preprint 2111.00995", "country": "Nigeria", "link": "https://scholar.google.com/scholar?q=Sign-to-Speech+Model+for+Sign+Language+Understanding%3A+A+Case+Study+of+Nigerian+Sign+Language", "summary": "Presents a pioneering Nigerian Sign Language dataset of 5,000 images across 137 signs collected from Deaf communities, benchmarking object-detection and classification models for sign-to-speech conversion.", "region": "West Africa"}, {"id": 7, "title": "Development of a Computer-Aided Real-Time Interpretation System for Indigenous Sign Language in Nigeria Using CNN", "authors": "Olabanji, A.O., Ponnle, A.A.", "year": 2022, "venue": "Journal article (as cited in Scientific Reports 2026)", "country": "Nigeria", "link": "https://scholar.google.com/scholar?q=Development+of+a+Computer-Aided+Real-Time+Interpretation+System+for+Indigenous+Sign+Language+in+Nigeria+Using+CNN", "summary": "Proposes a Nigerian Sign Language dataset of 15,000 images across 15 indigenous signs and trains a four-layer CNN, reporting accuracy above 95 percent on training and validation data.", "region": "West Africa"}, {"id": 8, "title": "A Deep Learning Framework for Ethiopian Sign Language Recognition Using Skeleton-Based Representation", "authors": "(Authors per Scientific Reports)", "year": 2025, "venue": "Scientific Reports, DOI:10.1038/s41598-025-19937-0", "country": "Ethiopia", "link": "https://scholar.google.com/scholar?q=A+Deep+Learning+Framework+for+Ethiopian+Sign+Language+Recognition+Using+Skeleton-Based+Representation", "summary": "Builds a 5,600-video skeleton-keypoint dataset via MediaPipe Holistic and benchmarks CNN-LSTM, LSTM, BiLSTM and GRU architectures, reporting 94 percent accuracy in signer-dependent settings and 73 percent signer-independent.", "region": "East Africa"}, {"id": 9, "title": "Ethiopian Sign Language Recognition Using Deep Convolutional Neural Network", "authors": "Abeje, B.T., Salau, A.O., Mengistu, A.D., Tamiru, N.K.", "year": 2022, "venue": "Multimedia Tools and Applications, DOI:10.1007/s11042-022-12768-5", "country": "Ethiopia", "link": "https://scholar.google.com/scholar?q=Ethiopian+Sign+Language+Recognition+Using+Deep+Convolutional+Neural+Network", "summary": "Develops a CNN-based system translating Ethiopian Sign Language to Amharic alphabet characters using images collected from hearing-impaired students, reporting high training and validation accuracy.", "region": "East Africa"}, {"id": 10, "title": "Word Level Ethiopian Sign Language Recognition Using Hybrid CNN-LSTM Model", "authors": "(Multiple authors, Addis Ababa University research)", "year": 2025, "venue": "Conference/preprint (ResearchGate)", "country": "Ethiopia", "link": "https://scholar.google.com/scholar?q=Word+Level+Ethiopian+Sign+Language+Recognition+Using+Hybrid+CNN-LSTM+Model", "summary": "Applies a hybrid CNN-LSTM architecture to word-level Ethiopian Sign Language recognition, combining single-frame feature extraction with sequence modelling across signed video.", "region": "East Africa"}, {"id": 11, "title": "A Comparative Study on Performance of SVM and CNN in Tanzania Sign Language Translation Using Image Recognition", "authors": "Myagila, K., Kilavo, H.", "year": 2021, "venue": "Applied Artificial Intelligence, DOI:10.1080/08839514.2021.2005297", "country": "Tanzania", "link": "https://scholar.google.com/scholar?q=A+Comparative+Study+on+Performance+of+SVM+and+CNN+in+Tanzania+Sign+Language+Translation+Using+Image+Recognition", "summary": "Compares SVM and CNN models on an image dataset of Tanzanian Sign Language signs, finding CNN outperforms SVM and establishing an early benchmark for Tanzanian sign recognition research.", "region": "East Africa"}, {"id": 12, "title": "Efficient Spatio-Temporal Modeling for Sign Language Recognition Using CNN and RNN Architectures", "authors": "Myagila, K., Nyambo, D.G., Dida, M.A.", "year": 2025, "venue": "Frontiers in Artificial Intelligence, DOI:10.3389/frai.2025.1630743", "country": "Tanzania", "link": "https://scholar.google.com/scholar?q=Efficient+Spatio-Temporal+Modeling+for+Sign+Language+Recognition+Using+CNN+and+RNN+Architectures", "summary": "Uses Tanzanian Sign Language videos captured on mobile phones to compare CNN-LSTM and CNN-GRU architectures, examining the effect of hand dominance and signer independence on recognition accuracy.", "region": "East Africa"}, {"id": 13, "title": "CASL-W60: A Word-Level Dataset for Central African Sign Language Recognition", "authors": "(Multiple authors)", "year": 2025, "venue": "Data in Brief / ScienceDirect", "country": "Central Africa", "link": "https://scholar.google.com/scholar?q=CASL-W60%3A+A+Word-Level+Dataset+for+Central+African+Sign+Language+Recognition", "summary": "Introduces a 60-word Central African Sign Language dataset collected from 19 volunteers, addressing the near-total absence of regional word-level datasets for the area's sign languages.", "region": "Central Africa"}, {"id": 14, "title": "South African Sign Language Dataset Development and Translation: A Glove-Based Approach", "authors": "McInnes, B.", "year": 2014, "venue": "University of Cape Town (Semantic Scholar)", "country": "South Africa", "link": "https://scholar.google.com/scholar?q=South+African+Sign+Language+Dataset+Development+and+Translation%3A+A+Glove-Based+Approach", "summary": "Describes an early glove-based sensor dataset capturing static South African Sign Language gestures, forming a foundation for later SASL recognition research at UCT.", "region": "Southern Africa"}, {"id": 15, "title": "The South African Sign Language Machine Translation Project: Issues on Non-Manual Sign Generation", "authors": "(UWC SASL-MT research group)", "year": 2003, "venue": "AFRIGRAPH '03, DOI:10.1145/602330.602339", "country": "South Africa", "link": "https://scholar.google.com/scholar?q=The+South+African+Sign+Language+Machine+Translation+Project%3A+Issues+on+Non-Manual+Sign+Generation", "summary": "Reports on an English-to-SASL machine translation system driven by a signing avatar, extending a syntax-based parser to generate non-manual signing features such as facial expression and stress patterns.", "region": "Southern Africa"}, {"id": 16, "title": "Investigating Signer-Independent Sign Language Recognition on the LSA64 Dataset", "authors": "Marais, M., Brown, D., Connan, J., Boby, A., Kuhlane, L.L.", "year": 2022, "venue": "Southern Africa Telecommunication Networks and Applications Conference (SATNAC)", "country": "South Africa", "link": "https://scholar.google.com/scholar?q=Investigating+Signer-Independent+Sign+Language+Recognition+on+the+LSA64+Dataset", "summary": "Examines signer-independent recognition performance for sign language models, contributing to the broader South African research programme on automated sign recognition.", "region": "Southern Africa"}, {"id": 17, "title": "Upper Body Pose Recognition and Estimation Towards the Translation of South African Sign Language", "authors": "Achmed, I.", "year": 2011, "venue": "Doctoral dissertation, University of the Western Cape", "country": "South Africa", "link": "https://scholar.google.com/scholar?q=Upper+Body+Pose+Recognition+and+Estimation+Towards+the+Translation+of+South+African+Sign+Language", "summary": "A doctoral study on estimating upper-body pose as a step toward automated South African Sign Language translation, cited widely in later African sign-language machine-translation research.", "region": "Southern Africa"}, {"id": 18, "title": "Alabib-65: A Realistic Dataset for Algerian Sign Language Recognition", "authors": "Khellas, K., Seghir, R.", "year": 2023, "venue": "ACM Transactions on Asian and Low-Resource Language Information Processing", "country": "Algeria", "link": "https://scholar.google.com/scholar?q=Alabib-65%3A+A+Realistic+Dataset+for+Algerian+Sign+Language+Recognition", "summary": "Contributes a realistic North African sign language dataset for Algerian Sign Language, used as a comparison point in subsequent African sign-language dataset papers.", "region": "North Africa"}, {"id": 19, "title": "Automatic Speech Recognition (ASR) for African Low-Resource Languages: A Systematic Literature Review", "authors": "(Multiple authors)", "year": 2025, "venue": "arXiv preprint 2510.01145", "country": "Pan-African", "link": "https://scholar.google.com/scholar?q=Automatic+Speech+Recognition+%28ASR%29+for+African+Low-Resource+Languages%3A+A+Systematic+Literature+Review", "summary": "A PRISMA-guided review of 71 studies on speech and language technology for African low-resource languages, providing useful context on datasets, models and evaluation gaps relevant to sign language work.", "region": "Pan-African"}, {"id": 20, "title": "Mendeley EthSL Alphabet Dataset: RGB Images for Static Ethiopian Sign Language Gesture Recognition", "authors": "Abeje, B.T., et al.", "year": 2022, "venue": "Mendeley Data", "country": "Ethiopia", "link": "https://scholar.google.com/scholar?q=Mendeley+EthSL+Alphabet+Dataset%3A+RGB+Images+for+Static+Ethiopian+Sign+Language+Gesture+Recognition", "summary": "Provides a public collection of 1,172 RGB images of Ethiopian Sign Language alphabet gestures for static recognition and landmark-extraction research.", "region": "East Africa"}];

const REGIONS = ["All Africa", "East Africa", "West Africa", "Central Africa", "Southern Africa", "North Africa", "Pan-African"];
const REGION_COORDS = {
  "All Africa": { center: [2, 20], zoom: 2.5 },
  "East Africa": { center: [2, 35], zoom: 4 },
  "West Africa": { center: [8, -2], zoom: 4 },
  "Central Africa": { center: [4, 22], zoom: 4 },
  "Southern Africa": { center: [-25, 25], zoom: 4 },
  "North Africa": { center: [25, 20], zoom: 4 },
  "Pan-African": { center: [2, 20], zoom: 2.5 },
};

const DOMAIN_COLORS = {
  "Machine Learning": "#0D9E75",
  "NLP": "#1F4E79",
  "Computer Vision": "#E67E22",
  "Assistive AI": "#8E44AD",
  "Datasets": "#C0392B",
};

const CATEGORY_COLORS = {
  "Capacity Building": "#0D9E75",
  "Advocacy & NGOs": "#8E44AD",
};

// Real country boundaries (Natural Earth 110m admin-0, simplified), not hand-drawn
// approximations — this is what previously made borders look wrong on the map.
const COUNTRY_BORDER_FEATURES = [{"type": "Feature", "properties": {"name": "Kenya"}, "geometry": {"type": "Polygon", "coordinates": [[[39.2, -4.68], [37.77, -3.68], [37.7, -3.1], [33.9, -0.95], [33.89, 0.11], [34.67, 1.18], [35.04, 1.91], [34.48, 3.56], [34.01, 4.25], [35.3, 5.51], [35.82, 5.34], [35.82, 4.78], [36.16, 4.45], [36.86, 4.45], [38.12, 3.6], [38.67, 3.62], [39.56, 3.42], [39.85, 3.84], [40.77, 4.26], [41.17, 3.92], [41.86, 3.92], [40.98, 2.78], [40.99, -0.86], [41.59, -1.68], [40.88, -2.08], [40.64, -2.5], [40.26, -2.57], [40.12, -3.28], [39.8, -3.68], [39.6, -4.35], [39.2, -4.68]]]}}, {"type": "Feature", "properties": {"name": "Nigeria"}, "geometry": {"type": "Polygon", "coordinates": [[[2.69, 6.26], [2.72, 8.51], [2.91, 9.14], [3.71, 10.06], [3.6, 10.33], [3.8, 10.73], [3.57, 11.33], [3.68, 12.55], [3.97, 12.96], [4.11, 13.53], [4.37, 13.75], [5.44, 13.87], [6.45, 13.49], [6.82, 13.12], [7.33, 13.1], [7.8, 13.34], [9.01, 12.83], [9.52, 12.85], [10.11, 13.28], [10.7, 13.25], [10.99, 13.39], [11.53, 13.33], [12.3, 13.04], [13.08, 13.6], [13.32, 13.56], [14.0, 12.46], [14.18, 12.48], [14.58, 12.09], [14.42, 11.57], [13.57, 10.8], [12.75, 8.72], [12.22, 8.31], [11.75, 6.98], [11.06, 6.64], [10.5, 7.06], [10.12, 7.04], [9.52, 6.45], [9.23, 6.44], [8.5, 4.77], [7.46, 4.41], [7.08, 4.46], [6.7, 4.24], [5.9, 4.26], [5.36, 4.89], [5.03, 5.61], [4.33, 6.27], [2.69, 6.26]]]}}, {"type": "Feature", "properties": {"name": "Ghana"}, "geometry": {"type": "Polygon", "coordinates": [[[0.02, 11.02], [-0.05, 10.71], [0.37, 10.19], [0.46, 8.68], [0.71, 8.31], [0.49, 7.41], [0.57, 6.91], [1.06, 5.93], [-1.96, 4.71], [-2.86, 4.99], [-2.81, 5.39], [-3.24, 6.25], [-2.98, 7.38], [-2.56, 8.22], [-2.96, 10.4], [-2.94, 10.96], [-0.76, 10.94], [-0.44, 11.1], [0.02, 11.02]]]}}, {"type": "Feature", "properties": {"name": "Ethiopia"}, "geometry": {"type": "Polygon", "coordinates": [[[47.79, 8.0], [44.96, 5.0], [43.66, 4.96], [42.77, 4.25], [42.13, 4.23], [41.86, 3.92], [41.17, 3.92], [40.77, 4.26], [39.85, 3.84], [39.56, 3.42], [38.67, 3.62], [38.12, 3.6], [36.86, 4.45], [36.16, 4.45], [35.82, 4.78], [35.82, 5.34], [35.3, 5.51], [34.71, 6.59], [34.25, 6.83], [34.08, 7.23], [33.57, 7.71], [32.95, 7.78], [33.29, 8.35], [33.83, 8.38], [33.97, 8.68], [33.96, 9.58], [34.26, 10.63], [34.73, 10.91], [35.26, 12.08], [35.86, 12.58], [36.27, 13.56], [36.43, 14.42], [37.59, 14.21], [37.91, 14.96], [38.51, 14.51], [39.1, 14.74], [39.34, 14.53], [40.03, 14.52], [40.9, 14.12], [41.6, 13.45], [42.35, 12.54], [41.66, 11.63], [41.76, 11.05], [42.55, 11.11], [42.78, 10.93], [42.56, 10.57], [43.68, 9.18], [46.95, 8.0], [47.79, 8.0]]]}}, {"type": "Feature", "properties": {"name": "Tanzania"}, "geometry": {"type": "Polygon", "coordinates": [[[33.9, -0.95], [37.7, -3.1], [37.77, -3.68], [39.2, -4.68], [38.74, -5.91], [38.8, -6.48], [39.44, -6.84], [39.47, -7.1], [39.19, -7.7], [39.19, -8.49], [39.95, -10.1], [40.32, -10.32], [39.52, -10.9], [38.43, -11.29], [37.83, -11.27], [37.47, -11.57], [36.78, -11.59], [36.51, -11.72], [35.31, -11.44], [34.56, -11.52], [34.28, -10.16], [33.74, -9.42], [32.76, -9.23], [30.74, -8.34], [30.2, -7.08], [29.62, -6.52], [29.42, -5.94], [29.52, -5.42], [29.34, -4.5], [29.75, -4.45], [30.75, -3.36], [30.74, -3.03], [30.53, -2.81], [30.47, -2.41], [30.76, -2.29], [30.82, -1.7], [30.42, -1.13], [30.77, -1.01], [33.9, -0.95]]]}}, {"type": "Feature", "properties": {"name": "South Africa"}, "geometry": {"type": "Polygon", "coordinates": [[[16.34, -28.58], [16.82, -28.08], [17.22, -28.36], [17.39, -28.78], [18.46, -29.05], [19.0, -28.97], [19.89, -28.46], [19.9, -24.77], [20.17, -24.92], [20.76, -25.87], [20.67, -26.48], [20.89, -26.83], [21.61, -26.73], [22.58, -25.98], [22.82, -25.5], [23.31, -25.27], [24.21, -25.67], [25.03, -25.72], [25.66, -25.49], [25.94, -24.7], [26.49, -24.62], [27.12, -23.57], [28.02, -22.83], [29.43, -22.09], [30.32, -22.27], [30.66, -22.15], [31.19, -22.25], [31.93, -24.37], [31.75, -25.48], [31.84, -25.84], [31.33, -25.66], [31.04, -25.73], [30.68, -26.4], [30.69, -26.74], [31.28, -27.29], [31.87, -27.18], [32.07, -26.73], [32.83, -26.74], [32.46, -28.3], [32.2, -28.75], [31.33, -29.4], [30.06, -31.14], [28.22, -32.77], [27.46, -33.23], [26.42, -33.61], [25.91, -33.67], [25.78, -33.94], [25.17, -33.8], [24.68, -33.99], [23.59, -33.79], [22.99, -33.92], [22.57, -33.86], [21.54, -34.26], [20.69, -34.42], [20.07, -34.8], [19.62, -34.82], [19.19, -34.46], [18.86, -34.44], [18.42, -34.0], [18.38, -34.14], [18.24, -33.87], [18.25, -33.28], [17.93, -32.61], [18.25, -32.43], [18.22, -31.66], [16.34, -28.58]], [[29.33, -29.26], [28.54, -28.65], [28.07, -28.85], [27.53, -29.24], [27.0, -29.88], [27.75, -30.65], [28.11, -30.55], [28.29, -30.23], [28.85, -30.07], [29.33, -29.26]]]}}, {"type": "Feature", "properties": {"name": "Uganda"}, "geometry": {"type": "Polygon", "coordinates": [[[33.9, -0.95], [30.77, -1.01], [29.82, -1.44], [29.58, -1.34], [29.59, -0.59], [29.82, -0.21], [29.88, 0.6], [30.47, 1.58], [31.17, 2.2], [30.77, 2.34], [30.83, 3.51], [31.25, 3.78], [31.88, 3.56], [32.69, 3.79], [33.39, 3.79], [34.01, 4.25], [34.48, 3.56], [35.04, 1.91], [34.67, 1.18], [33.89, 0.11], [33.9, -0.95]]]}}, {"type": "Feature", "properties": {"name": "Sudan"}, "geometry": {"type": "Polygon", "coordinates": [[[24.57, 8.23], [23.81, 8.67], [23.46, 8.95], [23.39, 9.27], [23.56, 9.68], [23.55, 10.09], [22.98, 10.71], [22.88, 11.38], [22.51, 11.68], [22.5, 12.26], [22.29, 12.65], [21.94, 12.59], [22.3, 13.37], [22.18, 13.79], [22.51, 14.09], [22.3, 14.33], [23.02, 15.68], [23.89, 15.61], [23.85, 20.0], [25.0, 20.0], [25.0, 22.0], [36.87, 22.0], [37.19, 21.02], [36.97, 20.84], [37.11, 19.81], [37.48, 18.61], [38.41, 18.0], [37.9, 17.43], [37.17, 17.26], [36.85, 16.96], [36.32, 14.82], [36.43, 14.42], [36.27, 13.56], [35.86, 12.58], [35.26, 12.08], [34.73, 10.91], [34.26, 10.63], [33.96, 9.58], [33.97, 8.68], [33.96, 9.46], [33.82, 9.48], [33.72, 10.33], [33.21, 10.72], [33.09, 11.44], [33.21, 12.18], [32.74, 12.25], [32.67, 12.02], [32.07, 11.97], [32.31, 11.68], [32.4, 11.08], [31.35, 9.81], [30.84, 9.71], [30.0, 10.29], [29.62, 10.08], [29.52, 9.79], [29.0, 9.6], [28.97, 9.4], [27.97, 9.4], [27.83, 9.6], [27.11, 9.64], [26.75, 9.47], [26.48, 9.55], [25.79, 10.41], [25.07, 10.27], [24.79, 9.81], [24.54, 8.92], [23.89, 8.62], [24.57, 8.23]]]}}, {"type": "Feature", "properties": {"name": "Morocco"}, "geometry": {"type": "Polygon", "coordinates": [[[-2.17, 35.17], [-1.79, 34.53], [-1.73, 33.92], [-1.39, 32.86], [-1.12, 32.65], [-1.31, 32.26], [-2.62, 32.09], [-3.07, 31.72], [-3.65, 31.64], [-3.69, 30.9], [-4.86, 30.5], [-5.24, 30.0], [-7.06, 29.58], [-8.67, 28.84], [-8.67, 27.66], [-8.82, 27.66], [-8.79, 27.12], [-9.41, 27.09], [-9.74, 26.86], [-10.55, 26.99], [-11.39, 26.88], [-11.72, 26.1], [-12.03, 26.03], [-12.5, 24.77], [-13.89, 23.69], [-14.22, 22.31], [-14.63, 21.86], [-14.75, 21.5], [-17.02, 21.42], [-16.97, 21.89], [-16.59, 22.16], [-16.26, 22.68], [-16.33, 23.02], [-15.98, 23.72], [-15.43, 24.36], [-15.09, 24.52], [-14.82, 25.1], [-14.8, 25.64], [-14.44, 26.25], [-13.77, 26.62], [-13.14, 27.64], [-12.62, 28.04], [-11.69, 28.15], [-10.9, 28.83], [-10.4, 29.1], [-9.56, 29.93], [-9.81, 31.18], [-9.3, 32.56], [-8.66, 33.24], [-6.91, 34.11], [-5.93, 35.76], [-5.19, 35.76], [-4.59, 35.33], [-3.64, 35.4], [-2.17, 35.17]]]}}, {"type": "Feature", "properties": {"name": "Botswana"}, "geometry": {"type": "Polygon", "coordinates": [[[29.43, -22.09], [28.02, -22.83], [27.12, -23.57], [26.49, -24.62], [25.94, -24.7], [25.66, -25.49], [25.03, -25.72], [24.21, -25.67], [23.31, -25.27], [22.82, -25.5], [22.58, -25.98], [21.61, -26.73], [20.89, -26.83], [20.67, -26.48], [20.76, -25.87], [20.17, -24.92], [19.9, -24.77], [19.9, -21.85], [20.88, -21.81], [20.91, -18.25], [21.66, -18.22], [23.2, -17.87], [23.58, -18.28], [24.22, -17.89], [25.08, -17.66], [25.26, -17.74], [26.16, -19.29], [27.3, -20.39], [27.72, -20.5], [27.73, -20.85], [28.02, -21.49], [28.79, -21.64], [29.43, -22.09]]]}}, {"type": "Feature", "properties": {"name": "Benin"}, "geometry": {"type": "Polygon", "coordinates": [[[2.69, 6.26], [1.87, 6.14], [1.62, 6.83], [1.66, 9.13], [1.46, 9.33], [1.43, 9.83], [0.77, 10.47], [0.9, 11.0], [1.24, 11.11], [1.45, 11.55], [1.94, 11.64], [2.49, 12.23], [2.85, 12.24], [3.61, 11.66], [3.57, 11.33], [3.8, 10.73], [3.6, 10.33], [3.71, 10.06], [2.91, 9.14], [2.72, 8.51], [2.69, 6.26]]]}}, {"type": "Feature", "properties": {"name": "Egypt"}, "geometry": {"type": "Polygon", "coordinates": [[[36.87, 22.0], [25.0, 22.0], [25.0, 29.24], [24.7, 30.04], [24.96, 30.66], [24.8, 31.09], [25.16, 31.57], [26.5, 31.59], [28.91, 30.87], [30.1, 31.47], [30.98, 31.56], [31.69, 31.43], [31.96, 30.93], [32.19, 31.26], [32.99, 31.02], [33.77, 30.97], [34.27, 31.22], [34.92, 29.5], [34.64, 29.1], [34.15, 27.82], [33.92, 27.65], [33.14, 28.42], [32.42, 29.85], [32.32, 29.76], [32.73, 28.71], [34.1, 26.14], [34.8, 25.03], [35.69, 23.93], [35.49, 23.75], [35.53, 23.1], [36.87, 22.0]]]}}, {"type": "Feature", "properties": {"name": "Rwanda"}, "geometry": {"type": "Polygon", "coordinates": [[[30.42, -1.13], [30.82, -1.7], [30.76, -2.29], [30.47, -2.41], [29.94, -2.35], [29.63, -2.92], [29.02, -2.84], [29.12, -2.29], [29.25, -2.22], [29.29, -1.62], [29.58, -1.34], [29.82, -1.44], [30.42, -1.13]]]}}, {"type": "Feature", "properties": {"name": "Malawi"}, "geometry": {"type": "Polygon", "coordinates": [[[32.76, -9.23], [33.74, -9.42], [34.28, -10.16], [34.56, -11.52], [34.28, -12.28], [34.56, -13.58], [34.91, -13.57], [35.27, -13.89], [35.69, -14.61], [35.77, -15.9], [35.34, -16.11], [35.03, -16.8], [34.38, -16.18], [34.31, -15.48], [34.52, -15.01], [34.46, -14.61], [34.06, -14.36], [33.79, -14.45], [32.69, -13.71], [32.99, -12.78], [33.31, -12.44], [33.11, -11.61], [33.49, -10.53], [33.23, -9.68], [32.76, -9.23]]]}}, {"type": "Feature", "properties": {"name": "Zambia"}, "geometry": {"type": "Polygon", "coordinates": [[[30.35, -8.24], [32.76, -9.23], [33.23, -9.68], [33.49, -10.53], [33.11, -11.61], [33.31, -12.44], [32.99, -12.78], [32.69, -13.71], [33.21, -13.97], [30.18, -14.8], [30.27, -15.51], [29.52, -15.64], [28.95, -16.04], [28.83, -16.39], [28.47, -16.47], [27.04, -17.94], [25.26, -17.74], [24.68, -17.35], [24.03, -17.3], [23.22, -17.52], [21.89, -16.08], [21.93, -12.9], [24.02, -12.91], [23.93, -12.57], [24.08, -12.19], [23.9, -11.72], [24.02, -11.24], [23.91, -10.93], [24.26, -10.95], [24.31, -11.26], [25.42, -11.33], [25.75, -11.78], [26.55, -11.92], [27.16, -11.61], [27.39, -12.13], [28.16, -12.27], [28.93, -13.25], [29.7, -13.26], [29.62, -12.18], [29.34, -12.36], [28.37, -11.79], [28.67, -9.61], [28.45, -9.16], [28.73, -8.53], [29.0, -8.41], [30.35, -8.24]]]}}, {"type": "Feature", "properties": {"name": "Zimbabwe"}, "geometry": {"type": "Polygon", "coordinates": [[[31.19, -22.25], [30.66, -22.15], [30.32, -22.27], [29.43, -22.09], [28.79, -21.64], [28.02, -21.49], [27.73, -20.85], [27.72, -20.5], [27.3, -20.39], [26.16, -19.29], [25.26, -17.74], [27.04, -17.94], [28.47, -16.47], [28.83, -16.39], [28.95, -16.04], [29.52, -15.64], [30.27, -15.51], [30.34, -15.88], [31.17, -15.86], [31.64, -16.07], [31.85, -16.32], [32.33, -16.39], [32.85, -16.71], [32.85, -17.98], [32.61, -19.42], [32.77, -19.72], [32.66, -20.3], [32.51, -20.4], [32.24, -21.12], [31.19, -22.25]]]}}, {"type": "Feature", "properties": {"name": "Algeria"}, "geometry": {"type": "Polygon", "coordinates": [[[-8.68, 27.4], [-8.67, 28.84], [-7.06, 29.58], [-5.24, 30.0], [-4.86, 30.5], [-3.69, 30.9], [-3.65, 31.64], [-3.07, 31.72], [-2.62, 32.09], [-1.31, 32.26], [-1.12, 32.65], [-1.39, 32.86], [-1.73, 33.92], [-1.79, 34.53], [-2.17, 35.17], [-1.21, 35.71], [-0.13, 35.89], [0.5, 36.3], [1.47, 36.61], [4.82, 36.87], [5.32, 36.72], [6.26, 37.11], [7.33, 37.12], [7.74, 36.89], [8.42, 36.95], [8.22, 36.43], [8.38, 35.48], [8.14, 34.66], [7.52, 34.1], [7.61, 33.34], [8.43, 32.75], [8.44, 32.51], [9.06, 32.1], [9.81, 29.42], [9.86, 28.96], [9.63, 27.14], [9.72, 26.51], [9.32, 26.09], [9.91, 25.37], [9.95, 24.94], [10.3, 24.38], [10.77, 24.56], [11.56, 24.1], [12.0, 23.47], [8.57, 21.57], [5.68, 19.6], [4.27, 19.16], [3.16, 19.06], [3.15, 19.69], [2.06, 20.14], [1.82, 20.61], [-8.68, 27.4]]]}}];

const COUNTRY_REGION = {
  "Kenya": "East Africa", "Ethiopia": "East Africa", "Tanzania": "East Africa",
  "Uganda": "East Africa", "Rwanda": "East Africa", "Somalia": "East Africa",
  "Nigeria": "West Africa", "Ghana": "West Africa", "Francophone Africa": "West Africa", "Benin": "West Africa",
  "South Africa": "Southern Africa", "Zimbabwe": "Southern Africa", "Zambia": "Southern Africa",
  "Botswana": "Southern Africa", "Malawi": "Southern Africa",
  "Sudan": "North Africa", "Morocco": "North Africa", "Egypt": "North Africa",
  "Central Africa": "Central Africa", "Multi-country": "Pan-African", "Madagascar": "East Africa",
  "Pan-Africa": "Pan-African", "Global": "Pan-African",
};

const RED = "#AC1212";
const RED_DARK = "#4A0202";
const GOLD = "#DC901E";
const GOLD_LIGHT = "#EEB42C";
const TEAL = "#0D9E75";
const PURPLE = "#8E44AD";
const DARK = "#180404";
const MID = "#5a3a3a";
const LIGHT = "#faf8f7";
const BORDER = "#e8ddd9";
const CARD_BG = "#ffffff";
const MAP_PIN = "#AC1212";
const MAP_PIN_ALT = "#DC901E";

function MapAutoCenter({ selectedRegion }) {
  const map = useMap();
  useEffect(() => {
    const region = REGION_COORDS[selectedRegion] || REGION_COORDS["All Africa"];
    map.setView(region.center, region.zoom);
  }, [selectedRegion, map]);
  return null;
}

function LeafletMap({ selectedRegion, data, onCountryClick }) {
  const region = REGION_COORDS[selectedRegion] || REGION_COORDS["All Africa"];
  const markers = useMemo(() => data.filter(d => d.lat != null && d.lng != null), [data]);
  const summaries = useMemo(() => {
    return markers.reduce((acc, item) => {
      const country = item.country || "Unknown";
      const key = country.trim();
      if (!acc[key]) acc[key] = { country: key, region: item.region || "", count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});
  }, [markers]);

  return (
    <div style={{ borderRadius: 18, overflow: "hidden", background: CARD_BG, boxShadow: "0 18px 28px rgba(0,0,0,0.08)", height: "clamp(420px, 50vh, 560px)", width: "100%" }}>
      <MapContainer center={region.center} zoom={region.zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        {/*
          Esri's World Light Gray Base canvas: free, permanent, no API key or account
          ever required, and (unlike the previous CartoDB tiles, which now sit behind
          an account/API-key wall) it ships with no place-name labels at all, so the
          only text on the map is our own English country tooltips/markers below.
        */}
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <GeoJSON
          data={COUNTRY_BORDER_FEATURES}
          style={() => ({
            color: GOLD_LIGHT,
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0,
            dashArray: "6,6",
          })}
          onEachFeature={(feature, layer) => {
            const name = feature.properties?.name || "Country";
            layer.bindTooltip(name, { sticky: true, direction: "center", opacity: 0.85 });
            layer.on({
              mouseover: (e) => e.target.setStyle({ weight: 3, color: RED, fillOpacity: 0.08 }),
              mouseout: (e) => e.target.setStyle({ weight: 2, color: GOLD_LIGHT, opacity: 0.85, fillOpacity: 0.02 }),
              click: () => onCountryClick && onCountryClick(name),
            });
          }}
        />
        {markers.map((item, index) => {
          const summary = summaries[item.country] || summaries[item.country?.trim()] || { count: 0, region: item.region || "" };
          return (
            <CircleMarker
              key={`${item.__kind || "item"}-${item.id}-${item.country}-${index}`}
              center={[item.lat, item.lng]}
              radius={8}
              pathOptions={{
                color: item.accessible === false ? MAP_PIN_ALT : MAP_PIN,
                fillColor: item.accessible === false ? MAP_PIN_ALT : MAP_PIN,
                fillOpacity: 0.9,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onCountryClick && onCountryClick(item.country),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95} sticky>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.country}</div>
                  <div style={{ fontSize: 12, color: "#0f172a", marginBottom: 4 }}>{summary.region || "Africa"}</div>
                  <div style={{ fontSize: 12, color: "#334155" }}>
                    {summary.count} entr{summary.count !== 1 ? "ies" : "y"}
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name || item.title}</div>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>{item.country}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{item.type || item.product || item.subType}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <MapAutoCenter selectedRegion={selectedRegion} />
      </MapContainer>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1rem 1.25rem", textAlign: "center", boxShadow: "0 10px 22px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: RED_DARK, fontFamily: "Georgia, serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: MID, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function Badge({ text, color = RED }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

function EntryCard({ item, type }) {
  const [open, setOpen] = useState(false);
  const domColor = DOMAIN_COLORS[item.domain] || RED;
  const catColor = CATEGORY_COLORS[item.category] || TEAL;

  const title = type === "publication" ? item.title : item.name;
  const meta =
    type === "dataset" ? `${item.country}${item.org ? ` · ${item.org}` : ""}` :
    type === "venture" ? `${item.country}${item.aiSpecialization ? ` · ${item.aiSpecialization}` : ""}` :
    type === "org" ? `${item.country}${item.subType ? ` · ${item.subType}` : ""}` :
    `${item.authors || ""}${item.venue ? ` · ${item.venue}` : ""}`;

  return (
    <div className="dataset-card" onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            <Badge text={item.region} color={GOLD} />
            {type === "dataset" && <Badge text={item.domain} color={domColor} />}
            {type === "dataset" && item.accessible && <Badge text="Accessible" color={MAP_PIN} />}
            {type === "dataset" && !item.accessible && <Badge text="Restricted" color={MAP_PIN_ALT} />}
            {type === "venture" && item.stage && <Badge text={item.stage} color={TEAL} />}
            {type === "venture" && item.focus && <Badge text={item.focus} color={PURPLE} />}
            {type === "org" && <Badge text={item.category} color={catColor} />}
            {type === "publication" && item.year && <Badge text={String(item.year)} color={TEAL} />}
          </div>
          <div className="dataset-card-title">{title}</div>
          <div className="dataset-card-meta">{meta}</div>
        </div>
        <div style={{ color: "#9ab", fontSize: 18 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 12, overflowY: "auto", minHeight: 0, flex: 1 }}>
          <p style={{ fontSize: 13, color: MID, lineHeight: 1.6, margin: "0 0 10px" }}>{item.desc || item.summary}</p>

          {type === "dataset" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Sign Language", item.signLanguage], ["Year", item.year], ["Type", item.type], ["Size", item.size], ["Design", item.design]].map(([k, v]) => v && (
                <div key={k}><span style={{ fontSize: 11, color: MID, textTransform: "uppercase" }}>{k}</span><div style={{ fontSize: 13, color: DARK, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
          )}
          {type === "dataset" && item.topics && (
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {item.topics.map(t => <Badge key={t} text={t} color={GOLD} />)}
            </div>
          )}
          {type === "dataset" && item.contact && (
            <div style={{ marginTop: 10, fontSize: 12, color: MID }}>📄 {item.contact}</div>
          )}

          {type === "venture" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["AI Specialisation", item.aiSpecialization], ["Product / Solution", item.product], ["Stage", item.stage]].map(([k, v]) => v && (
                <div key={k}><span style={{ fontSize: 11, color: MID, textTransform: "uppercase" }}>{k}</span><div style={{ fontSize: 13, color: DARK, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
          )}
          {type === "venture" && item.notes && (
            <div style={{ marginTop: 10, fontSize: 12, color: MID }}>📄 {item.notes}</div>
          )}
          {type === "venture" && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              {item.website ? (
                <a href={item.website.startsWith("http") ? item.website : `https://${item.website}`} target="_blank" rel="noreferrer" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>Visit website →</a>
              ) : (
                <span style={{ color: MID }}>No public website listed</span>
              )}
            </div>
          )}

          {type === "org" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Category", item.category], ["Sub-Type", item.subType], ["Disability Focus", item.focus]].map(([k, v]) => v && (
                <div key={k}><span style={{ fontSize: 11, color: MID, textTransform: "uppercase" }}>{k}</span><div style={{ fontSize: 13, color: DARK, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
          )}
          {type === "org" && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              {item.website ? (
                <a href={item.website.startsWith("http") ? item.website : `https://${item.website}`} target="_blank" rel="noreferrer" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>Visit website →</a>
              ) : (
                <span style={{ color: MID }}>No public website listed</span>
              )}
            </div>
          )}

          {type === "publication" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Authors", item.authors], ["Year", item.year], ["Venue", item.venue], ["Country / Region Studied", item.country]].map(([k, v]) => v && (
                <div key={k}><span style={{ fontSize: 11, color: MID, textTransform: "uppercase" }}>{k}</span><div style={{ fontSize: 13, color: DARK, marginTop: 2 }}>{v}</div></div>
              ))}
            </div>
          )}
          {type === "publication" && item.link && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <a href={item.link} target="_blank" rel="noreferrer" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>View on Google Scholar \u2192</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryTable({ datasets, ventures, orgs, publications }) {
  const byCountry = useMemo(() => {
    const m = {};
    const bump = (country, region, key) => {
      if (!country) return;
      if (!m[country]) m[country] = { region: region || "", datasets: 0, ventures: 0, orgs: 0, publications: 0 };
      m[country][key] += 1;
      if (!m[country].region && region) m[country].region = region;
    };
    datasets.forEach(d => bump(d.country, d.region, "datasets"));
    ventures.forEach(v => bump(v.country, v.region, "ventures"));
    orgs.forEach(o => bump(o.country, o.region, "orgs"));
    publications.forEach(p => bump(p.country, p.region, "publications"));
    return Object.entries(m).sort((a, b) => {
      const totalA = a[1].datasets + a[1].ventures + a[1].orgs + a[1].publications;
      const totalB = b[1].datasets + b[1].ventures + b[1].orgs + b[1].publications;
      return totalB - totalA;
    });
  }, [datasets, ventures, orgs, publications]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="summary-table">
        <thead>
          <tr style={{ background: LIGHT }}>
            {["Country", "Region", "Datasets", "Innovators & Ventures", "Organisations", "Publications", "Total"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: RED_DARK, borderBottom: `1px solid ${BORDER}`, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {byCountry.map(([country, v], i) => (
            <tr key={country} style={{ background: i % 2 === 0 ? CARD_BG : "#f7f3ef" }}>
              <td style={{ padding: "9px 12px", color: DARK, fontWeight: 500 }}>{country}</td>
              <td style={{ padding: "9px 12px", color: MID }}>{v.region}</td>
              <td style={{ padding: "9px 12px", color: RED_DARK, fontWeight: 600 }}>{v.datasets}</td>
              <td style={{ padding: "9px 12px", color: GOLD, fontWeight: 600 }}>{v.ventures}</td>
              <td style={{ padding: "9px 12px", color: PURPLE, fontWeight: 600 }}>{v.orgs}</td>
              <td style={{ padding: "9px 12px", color: TEAL, fontWeight: 600 }}>{v.publications}</td>
              <td style={{ padding: "9px 12px", color: DARK, fontWeight: 700 }}>{v.datasets + v.ventures + v.orgs + v.publications}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App({ onBack }) {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState("All Africa");
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterAccess, setFilterAccess] = useState("All");
  const [filterType, setFilterType] = useState("all");

  const allDomains = useMemo(() => ["All", ...new Set(DATASETS.map(d => d.domain))], []);

  const filteredDS = useMemo(() => DATASETS.filter(d => {
    const reg = selectedRegion === "All Africa" || selectedRegion === "Pan-African" || d.region === selectedRegion;
    const dom = filterDomain === "All" || d.domain === filterDomain;
    const acc = filterAccess === "All" || (filterAccess === "Accessible" && d.accessible) || (filterAccess === "Restricted" && !d.accessible);
    const s = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase()) || d.org.toLowerCase().includes(search.toLowerCase());
    return reg && dom && acc && s;
  }), [selectedRegion, filterDomain, filterAccess, search]);

  const filteredVentures = useMemo(() => VENTURES.filter(v => {
    const reg = selectedRegion === "All Africa" || selectedRegion === "Pan-African" || v.region === selectedRegion;
    const s = !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.country || "").toLowerCase().includes(search.toLowerCase()) || (v.product || "").toLowerCase().includes(search.toLowerCase()) || (v.focus || "").toLowerCase().includes(search.toLowerCase());
    return reg && s;
  }), [selectedRegion, search]);

  const filteredOrganisations = useMemo(() => ORGANISATIONS.filter(o => {
    const reg = selectedRegion === "All Africa" || selectedRegion === "Pan-African" || o.region === selectedRegion;
    const s = !search || o.name.toLowerCase().includes(search.toLowerCase()) || (o.country || "").toLowerCase().includes(search.toLowerCase()) || (o.subType || "").toLowerCase().includes(search.toLowerCase()) || (o.category || "").toLowerCase().includes(search.toLowerCase());
    return reg && s;
  }), [selectedRegion, search]);

  const filteredPublications = useMemo(() => PUBLICATIONS.filter(p => {
    const reg = selectedRegion === "All Africa" || selectedRegion === "Pan-African" || p.region === selectedRegion;
    const s = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.authors || "").toLowerCase().includes(search.toLowerCase()) || (p.country || "").toLowerCase().includes(search.toLowerCase());
    return reg && s;
  }), [selectedRegion, search]);

  const showDatasets = filterType === "all" || filterType === "datasets";
  const showVentures = filterType === "all" || filterType === "ventures";
  const showOrgs = filterType === "all" || filterType === "orgs";
  const showPublications = filterType === "all" || filterType === "publications";

  const handleCountryClick = (countryName) => {
    const regionName = COUNTRY_REGION[countryName] || "All Africa";
    setSelectedRegion(regionName);
  };

  const totalCountries = useMemo(() => new Set([
    ...DATASETS.map(d => d.country),
    ...VENTURES.map(v => v.country),
    ...ORGANISATIONS.map(o => o.country),
  ]).size, []);

  const tabs = [
    { id: "map", label: "Map View" },
    { id: "grid", label: "Grid View" },
    { id: "list", label: "List View" },
    { id: "summary", label: "Data Summary" },
    { id: "about", label: "About" },
    { id: "faq", label: "FAQs" },
  ];

  const mapData = [
    ...(showDatasets ? filteredDS.map(d => ({ ...d, __kind: "dataset" })) : []),
    ...(showVentures ? filteredVentures.map(v => ({ ...v, __kind: "venture" })) : []),
    ...(showOrgs ? filteredOrganisations.map(o => ({ ...o, __kind: "org" })) : []),
  ];

  return (
    <div className="app-root">
      <style>{appStyles}</style>

      {/* Header */}
      <div className="app-header">
        <div className="app-brand">
          <div className="app-brand-mark">SL</div>
          <div className="app-header-title">
            <div className="app-title-main">African Disability Datasets, Innovations and Hubs</div>
            <div className="app-title-sub">Part of the African Disability Data Network (ADDN) · HAIDI</div>
          </div>
        </div>
        <div className="app-back">
          {onBack ? (
            <button onClick={onBack}>← Back to ADDN</button>
          ) : (
            <a href="https://tourmaline-rolypoly-f9598c.netlify.app/">← Back to ADDN</a>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="app-hero">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: RED_DARK, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>African Disability Data Network · ADDN</div>
          <h1>
            African Innovations,  Hubs , <span style={{ color: GOLD }}>Research &amp; Disability Datasets</span> Platform
          </h1>
          <p>
            Mapping datasets, innovators and ventures, organisations, and publications on disability and AI across all African countries. A discovery and coordination platform — not a data host.
          </p>

          {/* Featured stats card */}
          <div className="featured-card">
            <div className="featured-left">
              <h2>Special Needs AI Research &amp; Data</h2>
              <p>Mapping datasets, innovators and ventures, organisations, and publications across all African countries. A discovery and coordination platform — not a data host.</p>
            </div>
            <div className="featured-stats">
              <div className="featured-stat"><div className="num">{DATASETS.length}</div><div className="lbl">Datasets</div></div>
              <div className="featured-stat"><div className="num">{VENTURES.length}</div><div className="lbl">Innovators &amp; Ventures</div></div>
              <div className="featured-stat"><div className="num">{ORGANISATIONS.length}</div><div className="lbl">Organisations</div></div>
              <div className="featured-stat"><div className="num">{PUBLICATIONS.length}</div><div className="lbl">Publications</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <input id="sl-search" className="filter-input" type="text" placeholder="Search datasets, ventures, organisations, publications…" value={search} onChange={e => setSearch(e.target.value)} />

          <select className="filter-select" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>

          <select className="filter-select" value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
            {allDomains.map(d => <option key={d}>{d}</option>)}
          </select>

          <select className="filter-select" value={filterAccess} onChange={e => setFilterAccess(e.target.value)}>
            {["All", "Accessible", "Restricted"].map(a => <option key={a}>{a}</option>)}
          </select>

          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="datasets">Datasets</option>
            <option value="ventures">Innovators &amp; Ventures</option>
            <option value="orgs">Organisations</option>
            <option value="publications">Publications</option>
          </select>

          <button className="filter-button" onClick={() => { setSearch(""); setFilterDomain("All"); setFilterAccess("All"); setFilterType("all"); setSelectedRegion("All Africa"); }}>
            Clear
          </button>
        </div>
        <div style={{ fontSize: 11, color: MID, marginTop: 8, maxWidth: 1200, margin: "8px auto 0" }}>
          Domain and access filters apply to the Datasets category only.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: LIGHT, borderBottom: `1px solid ${BORDER}` }}>
        <div className="tab-row" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? "active" : ""}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="app-layout">

        {/* MAP VIEW */}
        {activeTab === "map" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div>
              <LeafletMap selectedRegion={selectedRegion} data={mapData} onCountryClick={handleCountryClick} />
              <div style={{ marginTop: 12, fontSize: 12, color: "#6a8aaa" }}>
                Use the region filter above to zoom. Hover markers for a quick country summary, or tap to open details. Publications are not geo-located and appear only in Grid/List/Summary views.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(360px, 100%)", minWidth: 0, height: 560, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                {selectedRegion} — {showDatasets ? filteredDS.length : 0} datasets · {showVentures ? filteredVentures.length : 0} ventures · {showOrgs ? filteredOrganisations.length : 0} orgs
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
                {(showDatasets ? filteredDS.slice(0, 6) : []).map(d => <EntryCard key={`d-${d.id}`} item={d} type="dataset" />)}
                {(showVentures ? filteredVentures.slice(0, 4) : []).map(v => <EntryCard key={`v-${v.id}`} item={v} type="venture" />)}
                {(showOrgs ? filteredOrganisations.slice(0, 4) : []).map(o => <EntryCard key={`o-${o.id}`} item={o} type="org" />)}
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {activeTab === "grid" && (
          <div>
            {showDatasets && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>DATASETS ({filteredDS.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredDS.map(d => <EntryCard key={d.id} item={d} type="dataset" />)}
                  {filteredDS.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No datasets match your filters.</div>}
                </div>
              </>
            )}
            {showVentures && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>INNOVATORS &amp; VENTURES ({filteredVentures.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredVentures.map(v => <EntryCard key={v.id} item={v} type="venture" />)}
                  {filteredVentures.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No ventures match your filters.</div>}
                </div>
              </>
            )}
            {showOrgs && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>ORGANISATIONS ({filteredOrganisations.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredOrganisations.map(o => <EntryCard key={o.id} item={o} type="org" />)}
                  {filteredOrganisations.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No organisations match your filters.</div>}
                </div>
              </>
            )}
            {showPublications && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>PUBLICATIONS ({filteredPublications.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, alignItems: "start" }}>
                  {filteredPublications.map(p => <EntryCard key={p.id} item={p} type="publication" />)}
                  {filteredPublications.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No publications match your filters.</div>}
                </div>
              </>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {activeTab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {showDatasets && filteredDS.map(d => (
              <div key={`d-${d.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{d.name}</div><div style={{ fontSize: 12, color: MID }}>{d.org}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{d.country}</div>
                <Badge text={d.domain} color={DOMAIN_COLORS[d.domain] || TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{d.year}</div>
                <Badge text={d.accessible ? "Open" : "Restricted"} color={d.accessible ? TEAL : "#E67E22"} />
              </div>
            ))}
            {showVentures && filteredVentures.map(v => (
              <div key={`v-${v.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{v.name}</div><div style={{ fontSize: 12, color: MID }}>{v.product}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{v.country}</div>
                <Badge text={v.focus} color={PURPLE} />
                <div style={{ fontSize: 12, color: MID }}>{v.aiSpecialization || "—"}</div>
                <Badge text={v.stage || "—"} color={TEAL} />
              </div>
            ))}
            {showOrgs && filteredOrganisations.map(o => (
              <div key={`o-${o.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{o.name}</div><div style={{ fontSize: 12, color: MID }}>{o.subType}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{o.country}</div>
                <Badge text={o.category} color={CATEGORY_COLORS[o.category] || TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{o.focus}</div>
                <Badge text={o.region} color={GOLD} />
              </div>
            ))}
            {showPublications && filteredPublications.map(p => (
              <div key={`p-${p.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{p.title}</div><div style={{ fontSize: 12, color: MID }}>{p.authors}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{p.country}</div>
                <Badge text={String(p.year)} color={TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{p.venue}</div>
                {p.link ? <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: RED, fontWeight: 600 }}>Scholar \u2192</a> : <span />}
              </div>
            ))}
          </div>
        )}

        {/* SUMMARY */}
        {activeTab === "summary" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "2rem" }}>
              <StatCard value={DATASETS.length} label="Total Datasets" />
              <StatCard value={VENTURES.length} label="Innovators &amp; Ventures" />
              <StatCard value={ORGANISATIONS.length} label="Organisations" />
              <StatCard value={PUBLICATIONS.length} label="Publications" />
              <StatCard value={totalCountries} label="Countries Covered" />
              <StatCard value={DATASETS.filter(d => d.accessible).length} label="Open-Access Datasets" />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Organisations by Category</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
                  const count = ORGANISATIONS.filter(o => o.category === cat).length;
                  const pct = Math.round((count / ORGANISATIONS.length) * 100);
                  return (
                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 160, fontSize: 12, color: "#9ab" }}>{cat}</div>
                      <div style={{ flex: 1, background: "#f0e6df", borderRadius: 4, height: 16, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ width: 30, fontSize: 12, color: DARK, textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Datasets by Domain</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(DOMAIN_COLORS).map(([dom, color]) => {
                  const count = DATASETS.filter(d => d.domain === dom).length;
                  const pct = Math.round((count / DATASETS.length) * 100);
                  return (
                    <div key={dom} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 120, fontSize: 12, color: "#9ab" }}>{dom}</div>
                      <div style={{ flex: 1, background: "#f0e6df", borderRadius: 4, height: 16, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ width: 30, fontSize: 12, color: DARK, textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>By Country / Region</div>
            <SummaryTable datasets={DATASETS} ventures={VENTURES} orgs={ORGANISATIONS} publications={PUBLICATIONS} />
          </div>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <div style={{ maxWidth: 720, lineHeight: 1.7 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: "Georgia, serif", marginBottom: "1rem" }}>About the Africa Disability AI Data Repository</h2>
            <div className="about-card" style={{ border: `1px solid ${TEAL}44`, marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, color: "#000", fontSize: 14 }}>
                This platform is a <strong style={{ color: RED }}>data discovery and coordination tool</strong> — it does not host datasets directly. Each entry links to the original dataset custodian, organisation, or publication. Access conditions vary per entry.
              </p>
            </div>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8 }}>About ADDN</h3>
            <p style={{ color: "#000", fontSize: 14 }}>The African Disability Data Network (ADDN) is a pan-African coordination platform connecting researchers, innovators, OPDs, and policymakers to improve the visibility, discoverability, and ethical governance of disability-related datasets across Africa. ADDN is part of the Hub for AI and Disability Inclusion (HAIDI) and is supported by AI4D, IDRC, and FCDO.</p>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8, marginTop: "1.5rem" }}>About This Repository</h3>
            <p style={{ color: "#000", fontSize: 14 }}>This platform brings together four categories: <strong>Datasets</strong> (sign language and disability AI datasets across African countries), <strong>Innovators &amp; Ventures</strong> (AI startups and innovators working on disability inclusion, sourced from the HAIDI Master Stakeholder Database), <strong>Organisations</strong> (capacity-building institutions and advocacy/NGO bodies, also sourced from the HAIDI Master Stakeholder Database), and <strong>Publications</strong> (peer-reviewed and preprint research on sign language technology across Africa, compiled from a Google Scholar literature search restricted to African countries and regions). Entries are organised by region (East, West, Central, Southern, North Africa, Pan-African) and are searchable by name, country, or keyword.</p>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8, marginTop: "1.5rem" }}>Founding Partners</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[ ["MCAAI \u2013 Maseno University, Kenya", "Applied AI research for KSL"], ["KNUST / AfriSign \u2013 Ghana", "Multilingual African SL translation"], ["AT4D \u2013 Assistive Tech Trust", "Disability inclusion innovation"], ["Next Step Foundation", "Pan-African disability empowerment"] ].map(([n, d]) => (
                <div key={n} className="dark-card" style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#000", marginTop: 2 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: "Georgia, serif", marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
            {[
              ["How do I access a dataset?", "This platform provides availability information only. ADDN does not provide direct access to data. Each dataset has its own access policies. Click on any dataset card to find contact and access details for the dataset custodian."],
              ["What types of entries are included?", "The platform includes four categories: Datasets (sign language and disability AI datasets), Innovators & Ventures (AI startups and innovators working on disability inclusion across Africa), Organisations (capacity-building institutions, plus advocacy bodies and NGOs), and Publications (peer-reviewed and preprint research on African sign language technology, compiled from a Google Scholar search restricted to Africa)."],
              ["Which African countries are covered?", "The platform covers all African regions: East Africa (Kenya, Ethiopia, Tanzania, Uganda, Rwanda, Malawi), West Africa (Nigeria, Ghana, Benin, Francophone Africa), Southern Africa (South Africa, Botswana, Zimbabwe, Zambia), North Africa (Sudan, Morocco, Egypt, Algeria), Central Africa, and pan-African initiatives. Countries with no identified entries are documented as gaps."],
              ["How do I search?", "Use the search bar to search by name, organisation, product, or country. Use the region dropdown or region pills to filter by African sub-region. Use the category pills to switch between Datasets, Innovators & Ventures, Organisations, and Publications. Domain and accessibility filters apply to the Datasets category only."],
              ["Where do the Innovators & Ventures and Organisations entries come from?", "These are sourced directly from the HAIDI Master Stakeholder Database. Innovators & Ventures combines the database's Ventures & Innovators sheet; Organisations combines its Capacity Building and Advocacy & NGOs categories."],
              ["Where do the Publications entries come from?", "The Publications list was compiled from a Google Scholar literature search on sign language research and datasets, restricted to African countries and regions. It is illustrative rather than exhaustive — follow the source link on each entry for the full record."],
              ["How can I add my dataset, venture, or organisation?", "Contact ADDN at info@aphrc.org or visit the ADDN main site to submit an entry for inclusion. We welcome contributions from across the African disability AI ecosystem."],
              ["What does 'Accessible' mean?", "Datasets marked Accessible are publicly available or have a clear open-access pathway. Datasets marked Restricted require an application, agreement, or payment. Some proprietary datasets are noted but not accessible to the public."],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: "1.25rem", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: RED, marginBottom: 6 }}>{i + 1}. {q}</div>
                <div style={{ fontSize: 13, color: "#000", lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer" style={{ marginTop: "2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#180404" }}>Africa Disability AI Data Repository</div>
            <div style={{ fontSize: 12, color: MID }}>Part of ADDN · Hub for AI and Disability Inclusion (HAIDI) · Supported by AI4D · IDRC · FCDO</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="https://tourmaline-rolypoly-f9598c.netlify.app/" style={{ fontSize: 12, color: TEAL, textDecoration: "none" }}>ADDN Home</a>
            <span style={{ fontSize: 12, color: BORDER }}>|</span>
            <span style={{ fontSize: 12, color: MID }}>©  2026 ADDN. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
