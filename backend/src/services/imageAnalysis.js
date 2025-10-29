import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const STABLE_DIFFUSION_URL = "http://stable-diffusion.42malaga.com:7860/interrogator/analyze";

export const analyzeImage = async (imagePath) => {
  try {
    console.log("🤖 Analyzing image with Stable Diffusion:", imagePath);

    // Leer la imagen como buffer
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Preparar los datos según el formato que espera la API
    const payload = {
      image: `data:image/jpeg;base64,${base64Image}`,
      // O si prefiere solo el base64:
      // image: base64Image
    };

    console.log("📤 Sending image to Stable Diffusion API...");

    // Enviar a Stable Diffusion
    const response = await axios.post(STABLE_DIFFUSION_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000, // 60 segundos timeout (el análisis puede tardar)
    });

    console.log("✅ Image analysis complete:", response.data);

    // Extraer información relevante de la respuesta
    const analysis = {
      description: response.data.caption || response.data.description || response.data.prompt || "",
      labels: response.data.tags || response.data.labels || [],
      confidence: response.data.confidence || 0,
      rawResponse: response.data,
    };

    return analysis;
  } catch (err) {
    console.error("❌ Error analyzing image:", err.response?.data || err.message);
    
    // Si falla, devolver análisis vacío con más info del error
    return {
      description: "Analysis failed",
      labels: [],
      confidence: 0,
      error: err.response?.data?.detail || err.message,
    };
  }
};