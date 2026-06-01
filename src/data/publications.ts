export type PubType = "journal" | "conference" | "preprint";

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  type: PubType;
  url: string;
}

export const publications: Publication[] = [
  {
    title:
      "NutriOrion: A Hierarchical Multi-Agent Framework for Personalized Nutrition Intervention Grounded in Clinical Guidelines",
    authors: "Wu J, Yan R, Luo H, Liu D, Wang M, Townsend K, Hartwig L, Milketinas D, Hu X, Yang C",
    venue: "In Review (arXiv)",
    year: 2026,
    date: "Feb 2026",
    type: "preprint",
    url: "https://arxiv.org/pdf/2602.18650",
  },
  {
    title:
      "DietAI24 As A Framework for Comprehensive Nutrition Estimation Using Multimodal Large Language Models",
    authors: "Yan R, Luo H, Lu J, Liu D, Posluszny H, Dhaliwal M, MacLeod J, Qin Y, Yang C, Hartman T, Hu X",
    venue: "Nature Communications Medicine",
    year: 2025,
    date: "Nov 2025",
    type: "journal",
    url: "https://www.nature.com/articles/s43856-025-01159-0",
  },
  {
    title:
      "Leveraging Artificial Intelligence for Digital Symptom Management in Oncology: The Development of CRCWeb",
    authors: "Liu D, Lin Y, Yan R, Wang Z, Bold D, Hu X",
    venue: "JMIR Cancer",
    year: 2025,
    date: "Jul 2025",
    type: "journal",
    url: "https://cancer.jmir.org/2025/1/e68516",
  },
  {
    title:
      "Prediction of cardiac arrest in the pediatric cardiac intensive care unit: A time-series machine learning approach",
    authors: "Lu J, Brown S, Wu Y, Dong K, Bold D, Liu D, Grunwell J, Hu X",
    venue: "Journal of Critical Care (ScienceDirect)",
    year: 2025,
    date: "Apr 2025",
    type: "journal",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0883944124004453",
  },
  {
    title:
      "Evaluation of Large Language Models in Tailoring Educational Content for Cancer Survivors and Their Caregivers: Quality Analysis",
    authors: "Liu D, Hu X, Xiao C, Bai J, Lee S, ..., Lin Y",
    venue: "JMIR Cancer",
    year: 2025,
    date: "Feb 2025",
    type: "journal",
    url: "https://cancer.jmir.org/2025/1/e67914",
  },
  {
    title:
      "1444: Using Machine Learning to Predict Cardiac Arrest in the Pediatric Cardiac Intensive Care Unit",
    authors: "Brown S, Grunwell J, Wu Y, Dong K, Bold D, Liu D, Fundora M, Hu X, Lu J",
    venue: "Critical Care Medicine",
    year: 2025,
    date: "Jan 2025",
    type: "journal",
    url: "https://journals.lww.com/ccmjournal/",
  },
  {
    title:
      "Perceptions and Needs for A Technology-Based Dyadic Intervention on Symptom Management Among Patients with Colorectal Cancer and Their Caregivers: A Qualitative Study",
    authors: "Epari A, Kim K, Xiao C, Porter LS, Alese OB, Northouse L, Liu D, Bold D, Graetz I, Lin Y",
    venue: "Cancer Nursing",
    year: 2024,
    date: "Sep 2024",
    type: "journal",
    url: "https://journals.lww.com/cancernursingonline/",
  },
  {
    title:
      "Evaluation of General Large Language Models in Understanding Clinical Concepts Extracted from Adult Critical Care Electronic Health Record Notes",
    authors: "Liu D, Ding C, Bold D, Bouvier M, Lu J, Jabaley CS, ..., Hu X",
    venue: "arXiv",
    year: 2024,
    date: "Jan 2024",
    type: "preprint",
    url: "https://arxiv.org/abs/2401.13588",
  },
  {
    title:
      "Enabling Scalable Predictive Monitoring and Alarm Analytics via a Real-Time Platform for Processing Continuous Cardiorespiratory Monitoring Data",
    authors: "Liu D, et al.",
    venue: "AMIA Annual Symposium",
    year: 2025,
    date: "Nov 2025",
    type: "conference",
    url: "https://amia.secure-platform.com/symposium/gallery/rounds/82021/details/20357",
  },
  {
    title: "Enabling Scalable Live Alarm Analytics: AlarmX",
    authors: "Liu D, et al.",
    venue: "IEEE BHI",
    year: 2025,
    date: "Oct 2025",
    type: "conference",
    url: "https://bhi.embs.org/2025/",
  },
  {
    title: "DietAI24: A Novel LLM-Based Dietary Assessment Software From Food Images",
    authors: "Yan R, Liu D, et al.",
    venue: "Nutrition (ASN)",
    year: 2025,
    date: "May 2025",
    type: "conference",
    url: "https://cdn.nutrition.org/article/S2475-2991(25)02366-2/fulltext",
  },
  {
    title: "Using Large Language Models to Tag Clinical Concepts Extracted from Nursing Notes",
    authors: "Liu D, et al.",
    venue: "IEEE BHI",
    year: 2023,
    date: "Oct 2023",
    type: "conference",
    url: "https://bhi.embs.org/2023/",
  },
];
