// Agent "règles + intentions" (pas de clé API, fonctionne offline)
// Idées couvertes: intents simples, logique d'affaires, formatage réponse

export interface AgentReply {
  text: string
  citations?: string[]
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

function detectIntent(input: string): { intent: string; entities?: Record<string, string> } {
  const q = input.toLowerCase().trim()
  if (/bonjour|salut|bonsoir/.test(q)) return { intent: 'greet' }
  if (/horaire|heure|ouvert|open/.test(q)) return { intent: 'hours' }
  if (/prix|coût|tarif/.test(q)) return { intent: 'pricing' }
  if (/aide|support|contact/.test(q)) return { intent: 'support' }
  if (/botpress|agent ia|chatbot|llm/.test(q)) return { intent: 'botpress' }
  // Q&R générique
  return { intent: 'fallback' }
}

export async function runAgent(input: string): Promise<AgentReply> {
  const { intent } = detectIntent(input)
  await delay(300) // simuler latence réseau/LLM

  switch (intent) {
    case 'greet':
      return { text: "Bonjour! Je suis un mini agent de démonstration. Comment puis‑je aider?" }
    case 'hours':
      return { text: "Notre support est disponible du lundi au vendredi, 9h–17h (heure de l'Est)." }
    case 'pricing':
      return { text: "La version démo est gratuite. Pour un plan pro, contactez‑nous pour un devis adapté." }
    case 'support':
      return { text: "Écrivez‑nous à support@example.com ou ouvrez un ticket depuis votre espace client." }
    case 'botpress':
      return { text: "Les agents IA permettent d'orchestrer une logique métier autour d'un modèle de langage. Ce mini‑projet montre l'architecture (UI React + moteur d'intentions + analytics)." }
    default:
      return { text: "Je n'ai pas bien compris. Pouvez‑vous reformuler ou préciser votre besoin?" }
  }
}