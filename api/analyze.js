export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Testo troppo corto' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Sei un esperto italiano di diritto, medicina e burocrazia. Analizza questo documento e rispondi ESATTAMENTE in questo formato, senza aggiungere nient'altro:

COSA DICE
[Spiega in 2-3 righe semplici cosa dice il documento, come se lo spiegassi a un amico]

COSA DEVI FARE
[Descrivi l'azione concreta che deve fare il lettore. Se non deve fare niente scrivi "Nessuna azione necessaria"]

ENTRO QUANDO
[Indica la scadenza se presente. Se non c'è scrivi "Nessuna scadenza indicata"]

COSA RISCHI
[Spiega cosa succede se non si agisce. Se non c'è rischio scrivi "Nessun rischio immediato"]

FRASE PIÙ IMPORTANTE
[Copia la frase più importante o pericolosa del documento, tra virgolette]

Documento da analizzare:
${text}`
        }]
      })
    });

    const data = await response.json();
    const result = data.content[0].text;
    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({ error: 'Errore durante l\'analisi' });
  }
}
