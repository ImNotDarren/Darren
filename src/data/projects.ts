export interface Project {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  url?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    name: "NutriCamp",
    tagline: "AI Diet Management Application",
    description:
      "Full-stack diet app with an embedded multimodal LLM agent that extracts micronutrient information directly from food images, removing manual logging and generating personalized dietary suggestions.",
    tags: ["LLM Agents", "Multimodal", "React", "Production"],
    url: "https://nutricamp.ai",
  },
  {
    name: "CanBeWell",
    tagline: "Mobile Health Intervention Platform",
    description:
      "A no-code platform letting clinicians design and deploy personalized activity and nutrition interventions in real time, with camera-based meal analysis and aggregated Fitbit, EMA, and sensor data.",
    tags: ["React Native", "Digital Health", "Wearables"],
    url: "https://canbewell.help",
  },
  {
    name: "ModelMeetsData",
    tagline: "ML Benchmarking Platform",
    description:
      "Full-stack React platform that hosts machine-learning models so users can benchmark them on their own datasets and owners can track performance across datasets.",
    tags: ["React", "ML Ops", "Full-stack"],
  },
  {
    name: "CRCWeb",
    tagline: "Colorectal Cancer Symptom Management",
    description:
      "React Native app delivering educational materials to colorectal cancer patients for managing psychoneurological symptoms, collecting phone sensor data to recommend daily routines.",
    tags: ["React Native", "Oncology", "Sensors"],
    repo: "https://github.com/ImNotDarren/CRCWeb",
  },
  {
    name: "AlarmX",
    tagline: "Real-Time Alarm Analytics",
    description:
      "Web-based real-time alarm analytics dashboard integrated into the Nihon Kohden Digital Health Platform, with a receiver pulling SQL data, converting to NKDHP format, and streaming to Kafka.",
    tags: ["Kafka", "Real-time", "SQL", "Dashboard"],
  },
];
