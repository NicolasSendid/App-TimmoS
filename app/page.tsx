import Map from "../components/Map";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-80 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Immo App</h1>

        <ul className="space-y-3">
          <li>📊 Estimations</li>
          <li>📍 DVF</li>
          <li>🏢 DPE</li>
          <li>🗺️ Cadastre</li>
          <li>🏠 Annonces</li>
        </ul>
      </div>

      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}
