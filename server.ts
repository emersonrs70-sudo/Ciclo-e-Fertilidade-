import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Interactive Health & Fertility Q&A Assistant Endpoint
app.post('/api/qa', async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Pergunta não fornecida.' });
    }

    // If Gemini client is available, generate an informed, empathetic, biologically rigorous response
    if (ai && process.env.GEMINI_API_KEY) {
      const systemInstruction = `Você é uma especialista em saúde reprodutiva, ginecologia preventiva e métodos de planejamento reprodutivo natural (Método Sintotérmico, Billings e Ogino-Knaus).
Sua missão é responder perguntas com rigor biológico, empatia, clareza e responsabilidade médica.
Diretrizes fundamentais:
1. NUNCA prometa "risco zero absoluto" com métodos naturais ou de calendário. Explique sempre em termos de probabilidades biológicas (alta, média e baixa probabilidade) e margens de segurança.
2. Explique a lógica biológica subjacente (sobrevida dos espermatozoides de até 5 dias no muco fértil, vida do óvulo de 12 a 24 horas, papel da progesterona na fase lútea).
3. Lembre sempre que preservativos são os únicos métodos contraceptivos que também protegem contra ISTs (Infecções Sexualmente Transmissíveis).
4. Se o usuário mencionar relação desprotegida recente na janela fértil, oriente com urgência sobre a pílula do dia seguinte (preferencialmente dentro das primeiras 24h a 72h).
5. Responda em Português do Brasil com linguagem acolhedora, parágrafos bem estruturados e tópicos fáceis de ler.`;

      const prompt = `Pergunta da usuária: "${question}"
Contexto atual da usuária:
- Duração do ciclo: ${context?.cycleLength || 28} dias
- Fase aproximada: ${context?.currentPhase || 'Não especificada'}
- Objetivo: ${context?.userGoal === 'conceive' ? 'Engravidar' : 'Evitar gravidez'}

Por favor, forneça uma resposta completa, educativa, biológica e tranquilizadora.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const answer = response.text || 'Não foi possível gerar uma resposta detalhada no momento.';
      return res.json({
        answer,
        source: 'gemini',
        model: 'gemini-3.8-flash',
      });
    }

    // Fallback response with curated medical knowledge when no API key is provided
    const qLower = question.toLowerCase();
    let fallbackAnswer = 'Compreendemos sua dúvida. Em termos de saúde reprodutiva, o ciclo menstrual é regulado por variações hormonais de estrogênio e progesterona. O período de menor risco para gravidez ocorre na fase lútea (pós-ovulatória confirmada), enquanto a janela de maior fertilidade compreende os 5 dias que antecedem a ovulação e o próprio dia da ovulação. Para dúvidas específicas ou uso de medicação de emergência, consulte sempre uma ginecologista ou a UBS mais próxima.';

    if (qLower.includes('menstruad') || qLower.includes('sangr')) {
      fallbackAnswer = 'Gravidez durante a menstruação é improvável, mas biologicamente possível em mulheres com ciclos curtos (menores que 25 dias). Nesses ciclos, o recrutamento folicular e a secreção de muco fértil começam precocemente, e espermatozoides podem sobreviver até o momento da ovulação.';
    } else if (qLower.includes('pílula') || qLower.includes('dia seguinte') || qLower.includes('emergência')) {
      fallbackAnswer = 'A pílula do dia seguinte atua principalmente adiando ou inibindo a ovulação. Deve ser tomada o mais rápido possível após a relação desprotegida (preferencialmente nas primeiras 24h, com eficácia decrescente até 72h). Caso a ovulação já tenha ocorrido, ela não tem ação abortiva.';
    } else if (qLower.includes('muco') || qLower.includes('clara de ovo')) {
      fallbackAnswer = 'O muco cervical com aspecto de clara de ovo crua (elástico, fluido e transparente) é o principal bioindicador de alta fertilidade. Ele sinaliza pico de estrogênio que prepara o colo uterino para a entrada e sobrevida dos espermatozoides.';
    } else if (qLower.includes('temperatura') || qLower.includes('basal') || qLower.includes('tcb')) {
      fallbackAnswer = 'A Temperatura Corporal Basal (TCB) deve ser aferida logo ao acordar, com termômetro de 2 casas decimais. A subida de 0,2°C a 0,5°C sustentada por 3 dias consecutivos indica que a ovulação já aconteceu e a fase lútea infértil foi iniciada.';
    } else if (qLower.includes('coito') || qLower.includes('tirar antes')) {
      fallbackAnswer = 'O coito interrompido não é considerado um método seguro, pois apresenta taxa de falha de cerca de 20% no uso comum. O líquido pré-ejaculatório pode carregar espermatozoides viáveis e o método não oferece proteção contra ISTs.';
    }

    return res.json({
      answer: fallbackAnswer,
      source: 'knowledge_base',
      note: 'Dica: Conecte sua chave GEMINI_API_KEY no menu de configurações para respostas personalizadas por IA.',
    });
  } catch (error: any) {
    console.error('Error in /api/qa:', error);
    return res.status(500).json({
      error: 'Erro ao processar sua pergunta. Tente novamente em instantes.',
      fallbackAnswer: 'Houve uma instabilidade temporária. Relembre que o período mais seguro biológico é a fase lútea pós-ovulação confirmada, e em qualquer relação desprotegida na janela fértil a avaliação médica é recomendada.',
    });
  }
});

// Vite Integration
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
