export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const profile = {
  name: "Darren (Sizuo) Liu",
  location: "Atlanta, GA",
  taglines: {
    research: "PhD researcher in Biomedical Informatics, building AI for health.",
    music: "Singer-songwriter & music producer.",
  },
  about: {
    research:
      "I am a PhD student in Computer Science and Informatics at Emory University on the Biomedical Informatics track. I build LLM agents and machine-learning systems for healthcare and nutrition, spanning clinical NLP, multimodal models, and physiological-signal analysis. I like turning messy clinical data into tools that reach real patients and clinicians.",
    music:
      "I write, record, and produce music as Darren Liu, with several albums and singles released across streaming platforms. As a recording engineer and producer at Silence Music in Chengdu I directed vocals, composed, and co-produced other artists. Sound is the other half of how I think.",
  },
  stats: {
    research: [
      { value: 12, suffix: "", label: "Publications" },
      { value: 4, suffix: "", label: "Research themes" },
      { value: 2028, suffix: "", label: "PhD expected" },
    ] as Stat[],
    music: [
      { value: 9, suffix: "", label: "Releases" },
      { value: 2, suffix: "", label: "Albums" },
      { value: 5, suffix: "+", label: "Years producing" },
    ] as Stat[],
  },
  contacts: [
    { label: "Email", href: "mailto:darren.liu@emory.edu" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/darren-sizuo-liu/" },
    { label: "GitHub", href: "https://github.com/ImNotDarren" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=0pURGncAAAAJ&hl=en" },
    { label: "Apple Music", href: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  ] as ContactLink[],
  skills: [
    { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "R", "Java", "C", "C++", "HTML", "CSS"] },
    { label: "Web & Mobile", items: ["React", "React Native", "Node.js", "Express.js", "Spring Boot", "Flask", "MySQL", "SQLite", "MongoDB"] },
    { label: "ML & Data", items: ["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "Hugging Face", "LLM Agents", "Reinforcement Learning"] },
    { label: "Tools & Infra", items: ["Git", "Docker", "Kafka", "REST APIs", "Firebase", "AWS", "Azure"] },
  ] as SkillGroup[],
} as const;
