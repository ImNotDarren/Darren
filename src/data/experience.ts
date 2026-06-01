export interface ExperienceEntry {
  role: string;
  org: string;
  location: string;
  period: string;
  start: number; // sort key, year
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "PhD Researcher, Biomedical Informatics",
    org: "Emory University",
    location: "Atlanta, GA",
    period: "Aug 2024 – Present",
    start: 2024,
    points: [
      "LLM agents and machine learning for healthcare and nutrition.",
      "Research spanning clinical NLP, multimodal models, and physiological-signal ML.",
    ],
  },
  {
    role: "Data Scientist Intern",
    org: "Nihon Kohden America",
    location: "Irvine, CA",
    period: "May 2025 – Aug 2025",
    start: 2025,
    points: [
      "Built and deployed a real-time alarm analytics dashboard into the Nihon Kohden Digital Health Platform.",
      "Built a receiver pulling SQL (Bedmaster) data, converting to NKDHP format, and streaming to Kafka.",
    ],
  },
  {
    role: "Information Analyst",
    org: "Emory University",
    location: "Atlanta, GA",
    period: "Mar 2023 – Jun 2024",
    start: 2023,
    points: [
      "Built ModelMeetsData and CRCWeb full-stack platforms.",
      "Led LLM evaluation studies on clinical concept tagging and educational content.",
    ],
  },
  {
    role: "Recording Engineer, Songwriter, Producer",
    org: "Silence Music",
    location: "Chengdu, China",
    period: "Mar 2020 – Aug 2024",
    start: 2020,
    points: [
      "Chorus recording and vocal direction; composing and producing.",
      "Co-produced Yichuan Wang's album \"Stop Daydreaming\"; released albums \"Murderer\" and \"Darren\".",
    ],
  },
  {
    role: "Software Engineer Intern",
    org: "Chinasoft International",
    location: "Chongqing, China",
    period: "Jul 2020 – Aug 2020",
    start: 2019,
    points: ["Full-stack web development; requirement analysis and database design."],
  },
];
