function Navbar({ aktifRol, setAktifRol, talepSayisi, ustaYetenekSayisi }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Sol Kısım: Logo ve Proje Başlığı */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-bold text-lg w-10 h-10 rounded-xl flex items-center justify-center shadow">
            U&M
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              UstaBul MVP
            </h1>
            <p className="text-xs text-slate-500">
              İş Talebi & Usta Eşleştirme Platformu
            </p>
          </div>
        </div>

        {/* Orta Kısım: Kısa Durum Bilgisi */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>
            Toplam Talep: <strong className="text-slate-800">{talepSayisi}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Usta Yetenekleri: <strong className="text-slate-800">{ustaYetenekSayisi} seçili</strong>
          </span>
        </div>

        {/* Sağ Kısım: Müşteri / Usta Rol Seçimi Butonları */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setAktifRol("musteri")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              aktifRol === "musteri"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👤 Müşteri Görünümü
          </button>
          <button
            type="button"
            onClick={() => setAktifRol("usta")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              aktifRol === "usta"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛠️ Usta Görünümü
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;