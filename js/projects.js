/* ================= Projects ================= */

// Dati dei progetti (id usati per le modali)
const projectsData = {
  p1: {
    title: "Medico Sereno",
    description: "Gestionale medico: pazienti, visite, cartelle e fatturazione. Da desktop (Tkinter) a web app.",
    tags: ["Python", "Flask", "SQLite/PostgreSQL", "UI/UX"],
    image: "assets/img/medico-sereno.png",
    live: "#"
  },
  p2: {
    title: "Askhole",
    description: "App mobile di chat AI dal tono brillante e sarcastico. Freemium, backend Flask.",
    tags: ["Flutter", "Flask", "OpenAI API", "Firebase"],
    image: "assets/img/ask-hole.png",
    live: "#"
  },
  p3: {
    title: "Programma Ricami",
    description: "Gestione lotti di lavoro, taglie e PDF di produzione con UI semplificata.",
    tags: ["Web App", "Node/Express", "React", "PDF"],
    image: "assets/img/ricamo.png",
    live: "#"
  }
};

export function getProjectsData() {
  return projectsData;
}
