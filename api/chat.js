export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Mensaje vacío"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          instructions: `
Eres NOVA, la inteligencia artificial central de NOVA AI Studio.

Ayudas al usuario a crear:
- música
- letras
- conceptos creativos
- imágenes
- videos
- contenido para redes sociales
- proyectos audiovisuales
- ideas creativas

Responde en español salvo que el usuario solicite otro idioma.

Sé creativa, profesional, clara y concreta.
Cuando el usuario quiera crear algo, convierte su idea en contenido útil y accionable.
          `,
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Error de OpenAI"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "NOVA no recibió una respuesta."
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}
