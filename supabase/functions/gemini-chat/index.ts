import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      console.error("Missing or invalid messages array:", body);
      return new Response(
        JSON.stringify({ error: "Messages array is required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    
    if (!GOOGLE_GEMINI_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    console.log("Calling Google Gemini API with messages:", messages);

    // Préparer le contenu pour Gemini
    const contents = messages.map((msg: any) => {
      if (typeof msg.content === 'string') {
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        };
      } else {
        // Gérer les messages avec images
        const parts = msg.content.map((c: any) => {
          if (c.type === 'text') {
            return { text: c.text };
          } else if (c.type === 'image_url') {
            // Extraire les données base64
            const base64Data = c.image_url.url.split(',')[1];
            const mimeType = c.image_url.url.split(';')[0].split(':')[1];
            return {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            };
          }
        });
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts
        };
      }
    });

    // Ajouter le prompt système au premier message
    const systemPrompt = `Tu es un professeur de mathématiques pédagogue et bienveillant. 

RÈGLES IMPORTANTES :
1. Tu ne réponds QU'AUX QUESTIONS DE MATHÉMATIQUES
2. Pour toute question non-mathématique, réponds poliment que tu ne peux traiter que les questions de mathématiques
3. Détecte automatiquement la langue de la question de l'utilisateur et réponds dans cette MÊME langue
4. Si la question est en arabe, réponds en arabe
5. Si la question est en français, réponds en français
6. Si la question est en anglais, réponds en anglais
7. Adapte-toi à n'importe quelle langue utilisée par l'étudiant
8. Tu peux analyser des images, PDF et documents contenant des équations mathématiques ou des exercices
9. Lorsqu'une image est fournie, analyse-la pour identifier les questions ou équations mathématiques et réponds-y
10. CRITIQUE : N'utilise JAMAIS de syntaxe LaTeX (comme $, $$, \\boxed, \\frac, etc.). Écris TOUTES les équations et formules mathématiques en texte clair. Exemples : écris "x^2 + 2x + 1" au lieu de "$x^2 + 2x + 1$", écris "racine carrée de x" au lieu de "√x"

STRUCTURE DE RÉPONSE pour les questions mathématiques :
1. Reformule la question pour confirmer ta compréhension
2. Explique les concepts clés nécessaires
3. Détaille la résolution étape par étape
4. Donne la réponse finale claire
5. Propose un exercice similaire pour s'entraîner

EXEMPLES DE REFUS (adapte selon la langue détectée) :
- Français : "Je suis désolé, mais je suis spécialisé uniquement dans l'enseignement des mathématiques. Pourriez-vous me poser une question mathématique ?"
- Arabe : "عذراً، أنا متخصص فقط في تدريس الرياضيات. هل يمكنك طرح سؤال رياضي؟"
- Anglais : "I'm sorry, but I specialize only in teaching mathematics. Could you ask me a math question?"

Sois encourageant et patient dans tes explications.`;

    if (contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts.unshift({ text: systemPrompt });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GOOGLE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes dépassée, veuillez réessayer plus tard." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erreur de l'API Gemini" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transformer le streaming Gemini en format SSE compatible avec le client
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim().startsWith('data: ')) {
                const jsonStr = line.trim().substring(6);
                try {
                  const data = JSON.parse(jsonStr);
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  
                  if (text) {
                    // Format compatible avec OpenAI pour le client
                    const sseData = {
                      choices: [{
                        delta: {
                          content: text
                        }
                      }]
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`));
                  }
                } catch (e) {
                  console.error("Error parsing Gemini response:", e);
                }
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
