export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export const profile = {
  name: "Darren (Sizuo) Liu",
  location: "Atlanta, GA",
  taglines: {
    researcher: "PhD researcher in Biomedical Informatics, building AI for health.",
    musician: "Singer-songwriter & music producer.",
    blended: "Biomedical Informatics PhD researcher & music producer.",
  },
  about:
    "I am a PhD student in Computer Science and Informatics at Emory University on the Biomedical Informatics track, where I build LLM agents and machine-learning systems for healthcare and nutrition. Outside the lab I write, record, and produce music, and have released several albums as Darren Liu. I move between data and sound, and I like building things that reach real people in both worlds.",
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
