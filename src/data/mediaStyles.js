// `name` = clé interne (ne pas modifier : utilisée dans MEDIA_RANGES et p.media)
// `label` = affichage FR avec accents
export const MEDIA_STYLES = [
  { name: "Evasif",        label: "Évasif",        grade: "S", color: "#e8b84b", guarantees: ["Pro 15+", "Pression 15+"],     desc: "Le meilleur style. Garantit Pro ET Pression 15+. Transforme n'importe quelle personnalité." },
  { name: "Imperturbable", label: "Imperturbable", grade: "A", color: "#3fb950", guarantees: ["Pression 15+", "Tem 15+"],     desc: "Excellent. Garantit Pression 15+. Combiné avec une perso à Pro garanti = S-tier." },
  { name: "Reserve",       label: "Réservé",       grade: "A", color: "#58a6ff", guarantees: ["Pro 15+"],                     desc: "Très bon. Garantit Pro 15+. Pression limitée à 14 max." },
  { name: "Confrontant",   label: "Confrontant",   grade: "B", color: "#8b5cf6", guarantees: ["Pro 13+", "Loyauté 11+"],      desc: "Correct. Pro 13+ garanti. Tempérament fixé à 7." },
  { name: "Pose",          label: "Posé",          grade: "C", color: "#7d8590", guarantees: ["Tem 7+", "Loyauté 11+"],       desc: "Loterie. Tempérament et loyauté corrects. Pro et Pression aléatoires." },
  { name: "Amical",        label: "Amical",        grade: "C", color: "#f97316", guarantees: ["Tem 7+"],                      desc: "Loterie. Rien d'important garanti." },
  { name: "Direct",        label: "Direct",        grade: "D", color: "#f85149", guarantees: ["Pression basse", "Controverses élevées"], desc: "Dangereux. Pression et Gros Matchs très bas garantis." },
  { name: "Volatile",      label: "Volatile",      grade: "D", color: "#f85149", guarantees: ["Tem 3-6"],                     desc: "Mauvais. Tempérament bas garanti." },
  { name: "Court-feu",     label: "Court-feu",     grade: "D", color: "#f85149", guarantees: ["Tem 1-2"],                     desc: "Terrible. Tempérament minimal garanti." },
]

export const mediaLabel = (name) => MEDIA_STYLES.find(m => m.name === name)?.label ?? name
