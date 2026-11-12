import { useState } from "react";
import { KATEGORILER } from "../Interfaces/dataModels";

function UstaPaneli({ talepler, setTalepler, ustaProfili, setUstaProfili }) {
  // Hangi talebe teklif yazıldığını ve form bilgilerini tutan State
  const [aktifTalepId, setAktifTalepId] = useState(null);
  const [teklifFormu, setTeklifFormu] = useState({
    fiyat: "",
    sure: "",
    not: ""
  });

  // 1. USTA YETENEK SEÇİMİ (Ekle / Çıkar)
  const yetenekDegistir = (kategori) => {
    const mevcutMu = ustaProfili.yetenekler.includes(kategori);
    const yeniYetenekler = mevcutMu
      ? ustaProfili.yetenekler.filter((y) => y !== kategori)
      : [...ustaProfili.yetenekler, kategori];

    setUstaProfili({
      ...ustaProfili,
      yetenekler: yeniYetenekler
    });
  };

  // 2. KURAL TABANLI EŞLEŞTİRME: Talebin kategorisi ustanın yeteneklerinde varsa göster
  const eslesenTalepler = talepler.filter((talep) =>
    ustaProfili.yetenekler.includes(talep.kategori)
  );

  // Teklif verme veya mevcut teklifi düzenleme formunu açar
  const teklifFormuAc = (talep, mevcutTeklif) => {
    setAktifTalepId(talep.id);
    if (mevcutTeklif) {
      setTeklifFormu({
        fiyat: mevcutTeklif.fiyat,
        sure: mevcutTeklif.sure,
        not: mevcutTeklif.not || ""
      });
    } else {
      setTeklifFormu({ fiyat: "", sure: "", not: "" });
    }
  };

  // 3. TEKLİF VERME VEYA DÜZENLEME (Create & Update)
  const teklifKaydet = (e, talepId) => {
    e.preventDefault();
    if (!teklifFormu.fiyat || !teklifFormu.sure) {
      alert("Lütfen fiyat ve tahmini süre alanlarını doldurun!");
      return;
    }

    const guncelTalepler = talepler.map((talep) => {
      if (talep.id !== talepId) return talep;

      // Bu ustanın bu talepte zaten bir teklifi var mı kontrol et
      const mevcutTeklifVarMi = talep.teklifler.some(
        (t) => t.ustaAdi === ustaProfili.ustaAdi
      );

      let yeniTeklifListesi;
      if (mevcutTeklifVarMi) {
        // Varsa teklifi güncelle
        yeniTeklifListesi = talep.teklifler.map((t) =>
          t.ustaAdi === ustaProfili.ustaAdi
            ? {
                ...t,
                fiyat: Number(teklifFormu.fiyat),
                sure: teklifFormu.sure,
                not: teklifFormu.not
              }
            : t
        );
      } else {
        // Yoksa yeni teklif ekle
        const yeniTeklif = {
          id: "teklif-" + Date.now(),
          ustaAdi: ustaProfili.ustaAdi,
          fiyat: Number(teklifFormu.fiyat),
          sure: teklifFormu.sure,
          not: teklifFormu.not,
          kabulEdildi: false
        };
        yeniTeklifListesi = [...talep.teklifler, yeniTeklif];
      }

      return { ...talep, teklifler: yeniTeklifListesi };
    });

    setTalepler(guncelTalepler);
    setAktifTalepId(null);
    setTeklifFormu({ fiyat: "", sure: "", not: "" });
  };

  // 4. TEKLİFİ GERİ ÇEKME (Delete)
  const teklifGeriCek = (talepId) => {
    if (window.confirm("Teklifinizi geri çekmek istediğinize emin misiniz?")) {
      const guncelTalepler = talepler.map((talep) => {
        if (talep.id !== talepId) return talep;
        return {
          ...talep,
          teklifler: talep.teklifler.filter(
            (t) => t.ustaAdi !== ustaProfili.ustaAdi
          )
        };
      });
      setTalepler(guncelTalepler);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SOL TARAF: Usta Profili ve Yetenek Seçimi */}
      <div className="lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
          🛠️ Usta Profili & Yetenekler
        </span>
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-600">
            Usta Adı / Firma Adı
          </label>
          <input
            type="text"
            value={ustaProfili.ustaAdi}
            onChange={(e) =>
              setUstaProfili({ ...ustaProfili, ustaAdi: e.target.value })
            }
            className="w-full mt-1 p-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">
            Hizmet Verdiğiniz Yetenekleri Seçin ({ustaProfili.yetenekler.length})
          </label>
          <div className="flex flex-col gap-2">
            {KATEGORILER.map((kategori) => {
              const seciliMi = ustaProfili.yetenekler.includes(kategori);
              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => yetenekDegistir(kategori)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-sm font-medium transition-all ${
                    seciliMi
                      ? "bg-amber-50 border-amber-400 text-amber-900"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{kategori}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      seciliMi
                        ? "bg-amber-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {seciliMi ? "✓ Seçili" : "+ Seç"}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            💡 <strong>Eşleştirme Kuralı:</strong> Sağ tarafta yalnızca burada
            seçtiğiniz yeteneklerle eşleşen müşteri iş talepleri listelenir.
          </p>
        </div>
      </div>

      {/* SAĞ TARAF: Yeteneklerle Eşleşen İş Talepleri ve Teklif Verme */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-800">
            Yeteneklerinize Uygun İş Talepleri ({eslesenTalepler.length})
          </h2>
          <span className="text-xs text-slate-500">
            Toplam {talepler.length} talepten {eslesenTalepler.length} tanesi
            eşleşti
          </span>
        </div>

        {ustaProfili.yetenekler.length === 0 ? (
          <div className="bg-amber-50 p-6 text-center rounded-2xl border border-amber-200">
            <p className="text-amber-800 font-semibold text-sm">
              İş taleplerini görebilmek için sol menüden en az 1 yetenek seçin.
            </p>
          </div>
        ) : eslesenTalepler.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              Seçtiğiniz yeteneklere uygun açık bir iş talebi henüz bulunmuyor.
            </p>
          </div>
        ) : (
          eslesenTalepler.map((talep) => {
            // Bu ustanın bu talebe daha önce verdiği teklifi bul
            const benimTeklifim = talep.teklifler.find(
              (t) => t.ustaAdi === ustaProfili.ustaAdi
            );

            return (
              <div
                key={talep.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4"
              >
                {/* Talep Özeti */}
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
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
                          🎯 Yetenek Eşleşti: {talep.kategori}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">
                        📐 {talep.metrekare} m² • 📅 {talep.olusturmaTarihi} •
                        Durum: <strong>{talep.durum}</strong>
                      </p>
                      <p className="text-sm text-slate-600">{talep.aciklama}</p>
                    </div>

                    {/* Teklif Durumu veya Teklif Ver Butonu */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      {benimTeklifim ? (
                        <div className="flex flex-wrap items-center justify-between w-full gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="text-xs">
                            <span className="font-bold text-slate-700">
                              Teklifiniz:{" "}
                            </span>
                            <span className="font-bold text-amber-700">
                              {benimTeklifim.fiyat.toLocaleString("tr-TR")} ₺
                            </span>{" "}
                            ({benimTeklifim.sure})
                            {benimTeklifim.kabulEdildi && (
                              <span className="ml-2 bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">
                                ✅ Müşteri Kabul Etti!
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => teklifFormuAc(talep, benimTeklifim)}
                              className="px-3 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
                            >
                              ✏️ Teklifi Düzenle
                            </button>
                            <button
                              type="button"
                              onClick={() => teklifGeriCek(talep.id)}
                              className="px-3 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                              🗑️ Geri Çek
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => teklifFormuAc(talep, null)}
                          className="ml-auto px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm"
                        >
                          💰 Fiyat Teklifi Ver
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Açılır Teklif Verme / Düzenleme Formu */}
                {aktifTalepId === talep.id && (
                  <form
                    onSubmit={(e) => teklifKaydet(e, talep.id)}
                    className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-amber-900">
                        {benimTeklifim
                          ? "✏️ Teklifinizi Güncelleyin"
                          : "💰 Yeni Fiyat Teklifi Oluşturun"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setAktifTalepId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        Kapat ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">
                          Teklif Fiyatı (₺) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Örn: 12000"
                          value={teklifFormu.fiyat}
                          onChange={(e) =>
                            setTeklifFormu({
                              ...teklifFormu,
                              fiyat: e.target.value
                            })
                          }
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">
                          Tahmini Süre *
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: 2 Gün"
                          value={teklifFormu.sure}
                          onChange={(e) =>
                            setTeklifFormu({
                              ...teklifFormu,
                              sure: e.target.value
                            })
                          }
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        Müşteriye Notunuz (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Malzeme dahil fiyattır, hafta sonu başlayabilirim."
                        value={teklifFormu.not}
                        onChange={(e) =>
                          setTeklifFormu({
                            ...teklifFormu,
                            not: e.target.value
                          })
                        }
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                      >
                        {benimTeklifim ? "Teklifi Güncelle" : "Teklifi Gönder"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UstaPaneli;