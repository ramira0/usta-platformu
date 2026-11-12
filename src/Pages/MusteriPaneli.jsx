import { useState } from "react";
import { KATEGORILER, HAZIR_GORSELLER } from "../Interfaces/dataModels";

function MusteriPaneli({ talepler, setTalepler }) {
  // Form verilerini tutacağımız State
  const [formVerisi, setFormVerisi] = useState({
    baslik: "",
    aciklama: "",
    kategori: KATEGORILER[0],
    metrekare: "",
    fotograf: HAZIR_GORSELLER[0].url
  });

  // Hangi talebin düzenlendiğini tutan State
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  // AI Öneri Sonucunu ve Yüklenme Durumunu Tutan State'ler
  const [aiOnerisi, setAiOnerisi] = useState(null);
  const [aiYukleniyor, setAiYukleniyor] = useState(false);

  // ✨ AI ANALİZ VE ÖNERİ FONKSİYONU (Akıllı Kural Motoru)
  const aiAnalizEt = () => {
    if (!formVerisi.aciklama.trim()) {
      alert("AI analizi için lütfen önce 'Açıklama' alanına yapılacak işi yazın!");
      return;
    }

    setAiYukleniyor(true);

    // Gerçekçi bir AI analiz hissi için 500ms kısa bekleme
    setTimeout(() => {
      const metin = (formVerisi.baslik + " " + formVerisi.aciklama).toLowerCase();
      const m2 = Number(formVerisi.metrekare) || 20; // m² girilmediyse varsayılan 20 m² baz alır

      let onerilenKategori = "Seramik & Fayans";
      let birimFiyat = 750; // m² başı ortalama işçilik (₺)
      let gunlukM2Hizi = 10; // Ustanın günde bitireceği ortalama m²

      if (
        metin.includes("boya") ||
        metin.includes("badana") ||
        metin.includes("duvar") ||
        metin.includes("tavan") ||
        metin.includes("renk")
      ) {
        onerilenKategori = "Boya & Badana";
        birimFiyat = 180;
        gunlukM2Hizi = 45;
      } else if (
        metin.includes("elektrik") ||
        metin.includes("priz") ||
        metin.includes("kablo") ||
        metin.includes("avize") ||
        metin.includes("sigorta") ||
        metin.includes("aydınlatma")
      ) {
        onerilenKategori = "Elektrik Tesisatı";
        birimFiyat = 320;
        gunlukM2Hizi = 30;
      } else if (
        metin.includes("su") ||
        metin.includes("tesisat") ||
        metin.includes("musluk") ||
        metin.includes("boru") ||
        metin.includes("lavabo") ||
        metin.includes("gider")
      ) {
        onerilenKategori = "Su Tesisatı";
        birimFiyat = 450;
        gunlukM2Hizi = 20;
      } else if (
        metin.includes("parke") ||
        metin.includes("laminat") ||
        metin.includes("zemin") ||
        metin.includes("süpürgelik")
      ) {
        onerilenKategori = "Parke & Laminat";
        birimFiyat = 280;
        gunlukM2Hizi = 35;
      } else if (
        metin.includes("alçı") ||
        metin.includes("alçıpan") ||
        metin.includes("sıva") ||
        metin.includes("asma tavan") ||
        metin.includes("bölme")
      ) {
        onerilenKategori = "Alçıpan & Sıva";
        birimFiyat = 400;
        gunlukM2Hizi = 20;
      } else if (
        metin.includes("seramik") ||
        metin.includes("fayans") ||
        metin.includes("banyo") ||
        metin.includes("derz") ||
        metin.includes("mermer")
      ) {
        onerilenKategori = "Seramik & Fayans";
        birimFiyat = 750;
        gunlukM2Hizi = 10;
      }

      // Tahmini Süre Hesabı
      const tahminiGun = Math.max(1, Math.ceil(m2 / gunlukM2Hizi));
      const tahminiSure =
        tahminiGun === 1 ? "1 - 2 Gün" : `${tahminiGun} - ${tahminiGun + 1} Gün`;

      // Tahmini Fiyat Aralığı Hesabı (Alt ve Üst Bant)
      const bazTutar = m2 * birimFiyat;
      const minFiyat = Math.round((bazTutar * 0.85) / 500) * 500;
      const maxFiyat = Math.round((bazTutar * 1.2) / 500) * 500;

      setAiOnerisi({
        kategori: onerilenKategori,
        tahminiSure,
        fiyatAraligi: `${minFiyat.toLocaleString("tr-TR")} ₺ - ${maxFiyat.toLocaleString("tr-TR")} ₺`,
        gerekliYetenek: onerilenKategori,
        bazAlinanM2: m2
      });

      setAiYukleniyor(false);
    }, 500);
  };

  // AI önerisini tek tıkla forma uygula
  const aiOnerisiniUygula = () => {
    if (!aiOnerisi) return;
    const uygunGorsel = HAZIR_GORSELLER.find(
      (g) => g.kategori === aiOnerisi.kategori
    );

    setFormVerisi({
      ...formVerisi,
      kategori: aiOnerisi.kategori,
      metrekare: formVerisi.metrekare || aiOnerisi.bazAlinanM2,
      fotograf: uygunGorsel ? uygunGorsel.url : formVerisi.fotograf
    });
  };

  // 1. EKLEME VE DÜZENLEME KAYIT İŞLEMİ (Create & Update)
  const formuKaydet = (e) => {
    e.preventDefault();
    if (!formVerisi.baslik || !formVerisi.aciklama || !formVerisi.metrekare) {
      alert("Lütfen başlık, açıklama ve metrekare alanlarını doldurun!");
      return;
    }

    if (duzenlenenId) {
      const guncelListe = talepler.map((talep) =>
        talep.id === duzenlenenId
          ? {
              ...talep,
              baslik: formVerisi.baslik,
              aciklama: formVerisi.aciklama,
              kategori: formVerisi.kategori,
              metrekare: Number(formVerisi.metrekare),
              fotograf: formVerisi.fotograf
            }
          : talep
      );
      setTalepler(guncelListe);
      setDuzenlenenId(null);
    } else {
      const yeniTalep = {
        id: "talep-" + Date.now(),
        baslik: formVerisi.baslik,
        aciklama: formVerisi.aciklama,
        kategori: formVerisi.kategori,
        metrekare: Number(formVerisi.metrekare),
        fotograf: formVerisi.fotograf,
        durum: "Açık",
        olusturmaTarihi: new Date().toLocaleDateString("tr-TR"),
        teklifler: []
      };
      setTalepler([yeniTalep, ...talepler]);
    }

    // Formu ve AI kutusunu sıfırla
    setFormVerisi({
      baslik: "",
      aciklama: "",
      kategori: KATEGORILER[0],
      metrekare: "",
      fotograf: HAZIR_GORSELLER[0].url
    });
    setAiOnerisi(null);
  };

  // Talebi düzenlemek için bilgileri sol forma aktar
  const duzenlemeyeBasla = (talep) => {
    setDuzenlenenId(talep.id);
    setFormVerisi({
      baslik: talep.baslik,
      aciklama: talep.aciklama,
      kategori: talep.kategori,
      metrekare: talep.metrekare,
      fotograf: talep.fotograf
    });
    setAiOnerisi(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2. GÜNCELLEME İŞLEMİ: Gelen Teklifi Kabul Et
  const teklifKabulEt = (talepId, teklifId) => {
    const guncelListe = talepler.map((talep) => {
      if (talep.id === talepId) {
        const guncelTeklifler = talep.teklifler.map((teklif) => ({
          ...teklif,
          kabulEdildi: teklif.id === teklifId
        }));
        return {
          ...talep,
          durum: "Teklif Kabul Edildi",
          teklifler: guncelTeklifler
        };
      }
      return talep;
    });
    setTalepler(guncelListe);
  };

  // 3. SİLME İŞLEMİ (Delete)
  const talepSil = (id) => {
    if (window.confirm("Bu iş talebini silmek istediğinize emin misiniz?")) {
      setTalepler(talepler.filter((talep) => talep.id !== id));
      if (duzenlenenId === id) {
        setDuzenlenenId(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SOL TARAF: Talep Ekleme / Düzenleme Formu */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {duzenlenenId ? "✏️ Talebi Düzenle" : "➕ Yeni İş Talebi Oluştur"}
          </h2>
          {duzenlenenId && (
            <button
              type="button"
              onClick={() => {
                setDuzenlenenId(null);
                setAiOnerisi(null);
                setFormVerisi({
                  baslik: "",
                  aciklama: "",
                  kategori: KATEGORILER[0],
                  metrekare: "",
                  fotograf: HAZIR_GORSELLER[0].url
                });
              }}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              İptal
            </button>
          )}
        </div>

        <form onSubmit={formuKaydet} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              İş Başlığı *
            </label>
            <input
              type="text"
              placeholder="Örn: Salon Duvar Boyama"
              value={formVerisi.baslik}
              onChange={(e) =>
                setFormVerisi({ ...formVerisi, baslik: e.target.value })
              }
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Açıklama *
            </label>
            <textarea
              rows="3"
              placeholder="Örn: 80 m2 dairenin salon ve koridor duvarları silinebilir su bazlı boya ile boyanacak..."
              value={formVerisi.aciklama}
              onChange={(e) =>
                setFormVerisi({ ...formVerisi, aciklama: e.target.value })
              }
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* ✨ AI ANALİZ BUTONU VE ÖNERİ KUTUSU */}
          <div className="my-1">
            <button
              type="button"
              onClick={aiAnalizEt}
              disabled={aiYukleniyor}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {aiYukleniyor
                ? "🤖 AI Açıklamayı Analiz Ediyor..."
                : "✨ AI ile Analiz Et (Kategori, Süre & Fiyat Önerisi)"}
            </button>

            {aiOnerisi && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">
                    🤖 AI Akıllı Tahmin Sonucu ({aiOnerisi.bazAlinanM2} m² için)
                  </span>
                  <button
                    type="button"
                    onClick={() => setAiOnerisi(null)}
                    className="text-purple-400 hover:text-purple-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 bg-white p-2.5 rounded-lg border border-purple-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Önerilen Kategori:
                    </span>
                    <strong className="text-purple-800">
                      {aiOnerisi.kategori}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Tahmini Süre:
                    </span>
                    <strong>⏳ {aiOnerisi.tahminiSure}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 block">
                      Tahmini İşçilik Fiyat Aralığı:
                    </span>
                    <strong className="text-emerald-700 text-sm">
                      💰 {aiOnerisi.fiyatAraligi}
                    </strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 block">
                      Aranan Usta Yeteneği:
                    </span>
                    <span className="inline-block mt-0.5 bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                      🛠️ {aiOnerisi.gerekliYetenek}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={aiOnerisiniUygula}
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  ✓ Önerilen Kategoriyi ve Görseli Forma Uygula
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600">
                Kategori
              </label>
              <select
                value={formVerisi.kategori}
                onChange={(e) =>
                  setFormVerisi({ ...formVerisi, kategori: e.target.value })
                }
                className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm bg-white"
              >
                {KATEGORILER.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="text-xs font-semibold text-slate-600">
                Alan (m²) *
              </label>
              <input
                type="number"
                min="1"
                placeholder="Örn: 25"
                value={formVerisi.metrekare}
                onChange={(e) =>
                  setFormVerisi({ ...formVerisi, metrekare: e.target.value })
                }
                className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Hazır Örnek Görsel Seç
            </label>
            <div className="grid grid-cols-5 gap-2 mt-1.5">
              {HAZIR_GORSELLER.map((gorsel) => (
                <button
                  type="button"
                  key={gorsel.id}
                  onClick={() =>
                    setFormVerisi({ ...formVerisi, fotograf: gorsel.url })
                  }
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    formVerisi.fotograf === gorsel.url
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={gorsel.url}
                    alt={gorsel.baslik}
                    className="w-full h-12 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`mt-2 w-full text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm ${
              duzenlenenId
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {duzenlenenId ? "Değişiklikleri Kaydet" : "Talebi Yayınla"}
          </button>
        </form>
      </div>

      {/* SAĞ TARAF: 4. LİSTELEME İŞLEMİ (Read) ve Teklifler */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800">
          Müşteri İş Taleplerim ({talepler.length})
        </h2>

        {talepler.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              Henüz bir iş talebi oluşturmadınız. Soldaki formdan ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          talepler.map((talep) => (
            <div
              key={talep.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4"
            >
              {/* Üst Kısım: Fotoğraf ve Talep Detayları */}
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={talep.fotograf}
                  alt={talep.baslik}
                  className="w-full sm:w-36 h-36 object-cover rounded-xl"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-base">
                        {talep.baslik}
                      </h3>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          talep.durum === "Açık"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {talep.durum}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      📌 {talep.kategori} • 📐 {talep.metrekare} m² • 📅{" "}
                      {talep.olusturmaTarihi}
                    </p>
                    <p className="text-sm text-slate-600">{talep.aciklama}</p>
                  </div>

                  {/* Düzenle ve Sil Butonları */}
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => duzenlemeyeBasla(talep)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => talepSil(talep.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>

              {/* Alt Kısım: Gelen Usta Teklifleri Listesi */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  💬 Gelen Usta Teklifleri ({talep.teklifler.length})
                </h4>
                {talep.teklifler.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Bu talebe henüz fiyat teklifi verilmedi.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {talep.teklifler.map((teklif) => (
                      <div
                        key={teklif.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          teklif.kabulEdildi
                            ? "bg-green-50 border-green-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">
                              🛠️ {teklif.ustaAdi}
                            </span>
                            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                              {teklif.fiyat.toLocaleString("tr-TR")} ₺
                            </span>
                            <span className="text-xs text-slate-500">
                              • Süre: {teklif.sure}
                            </span>
                          </div>
                          {teklif.not && (
                            <p className="text-xs text-slate-600 mt-1">
                              "{teklif.not}"
                            </p>
                          )}
                        </div>

                        <div>
                          {teklif.kabulEdildi ? (
                            <span className="inline-block text-xs font-bold text-green-700 bg-green-200 px-3 py-1.5 rounded-lg">
                              ✅ Kabul Edildi
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                teklifKabulEt(talep.id, teklif.id)
                              }
                              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Teklifi Kabul Et
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MusteriPaneli;