import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import MusteriPaneli from "./Pages/MusteriPaneli";
import UstaPaneli from "./Pages/UstaPaneli";
import {
  VARSAYILAN_TALEPLER,
  VARSAYILAN_USTA_PROFILI
} from "./Interfaces/dataModels";

function App() {
  // 1. Aktif Rol State'i (LocalStorage'dan okur, yoksa 'musteri' başlar)
  const [aktifRol, setAktifRol] = useState(() => {
    return localStorage.getItem("ustabul_aktif_rol") || "musteri";
  });

  // 2. İş Talepleri State'i (LocalStorage'dan okur, yoksa varsayılan talepleri yükler)
  const [talepler, setTalepler] = useState(() => {
    const kayitliTalepler = localStorage.getItem("ustabul_talepler");
    return kayitliTalepler ? JSON.parse(kayitliTalepler) : VARSAYILAN_TALEPLER;
  });

  // 3. Usta Profili ve Yetenekleri State'i (LocalStorage'dan okur)
  const [ustaProfili, setUstaProfili] = useState(() => {
    const kayitliUsta = localStorage.getItem("ustabul_usta_profili");
    return kayitliUsta ? JSON.parse(kayitliUsta) : VARSAYILAN_USTA_PROFILI;
  });

  // Değişiklik oldukça LocalStorage'ı otomatik güncelle
  useEffect(() => {
    localStorage.setItem("ustabul_aktif_rol", aktifRol);
  }, [aktifRol]);

  useEffect(() => {
    localStorage.setItem("ustabul_talepler", JSON.stringify(talepler));
  }, [talepler]);

  useEffect(() => {
    localStorage.setItem("ustabul_usta_profili", JSON.stringify(ustaProfili));
  }, [ustaProfili]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Üst Menü ve Rol Seçici */}
      <Navbar
        aktifRol={aktifRol}
        setAktifRol={setAktifRol}
        talepSayisi={talepler.length}
        ustaYetenekSayisi={ustaProfili.yetenekler.length}
      />

      {/* Ana İçerik Alanı */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {aktifRol === "musteri" ? (
          <MusteriPaneli talepler={talepler} setTalepler={setTalepler} />
        ) : (
          <UstaPaneli
            talepler={talepler}
            setTalepler={setTalepler}
            ustaProfili={ustaProfili}
            setUstaProfili={setUstaProfili}
          />
        )}
      </main>
    </div>
  );
}

export default App;