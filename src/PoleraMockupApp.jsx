import React, { useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";

export default function PoleraMockupApp() {
  const [image, setImage] = useState(null);
  const [model, setModel] = useState("woman");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [imageDescription, setImageDescription] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMockup = async () => {
    if (!image) return;

    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer TU_API_KEY_AQUÍ`, // 🔐 Reemplaza esto con tu clave
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Una persona modelo ${model === "woman" ? "mujer" : "hombre"} usando una polera blanca con el siguiente diseño en el centro: un diseño gráfico estilo ${imageDescription || "moderno y colorido"}. Fondo blanco, estilo publicitario.`,
          n: 1,
          size: "1024x1024"
        }),
      });

      const data = await response.json();
      setResult(data.data[0].url);
    } catch (error) {
      console.error("Error generando mockup:", error);
      alert("Ocurrió un error. Revisa tu API Key o conexión.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generador de Mockups de Poleras</h1>

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm"
        />

        <input
          type="text"
          placeholder="¿Qué diseño estás usando? (Ej: Goku, Frase, Anime...)"
          value={imageDescription}
          onChange={(e) => setImageDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="woman">Modelo Mujer</option>
          <option value="man">Modelo Hombre</option>
        </select>

        <button
          onClick={generateMockup}
          disabled={!image || isLoading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin inline-block mr-2" /> Generando...
            </>
          ) : (
            <>
              <ImageIcon className="inline-block mr-2" /> Generar Mockup
            </>
          )}
        </button>

        {result && (
          <div className="mt-6 border rounded p-4">
            <img src={result} alt="Resultado del mockup" className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
