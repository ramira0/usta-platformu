// Kategori ve Usta Yetenek Listesi (Eşleştirme bu etiketler üzerinden yapılır)
export const KATEGORILER = [
  "Seramik & Fayans",
  "Boya & Badana",
  "Elektrik Tesisatı",
  "Su Tesisatı",
  "Parke & Laminat",
  "Alçıpan & Sıva"
];

// Bilgisayardan dosya seçmekle uğraşmamak için hazır örnek iş fotoğrafları
export const HAZIR_GORSELLER = [
  {
    id: "gorsel-1",
    baslik: "Banyo / Seramik Tadilatı",
    kategori: "Seramik & Fayans",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gorsel-2",
    baslik: "Salon Boya & Badana",
    kategori: "Boya & Badana",
    url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gorsel-3",
    baslik: "Elektrik & Aydınlatma",
    kategori: "Elektrik Tesisatı",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gorsel-4",
    baslik: "Mutfak / Su Tesisatı",
    kategori: "Su Tesisatı",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gorsel-5",
    baslik: "Zemin Parke Döşeme",
    kategori: "Parke & Laminat",
    url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80"
  }
];

// Uygulama ilk kez açıldığında LocalStorage boşsa yüklenecek örnek iş talepleri
export const VARSAYILAN_TALEPLER = [
  {
    id: "talep-101",
    baslik: "Banyo Zemin ve Duvar Seramik Yenileme",
    aciklama: "Eski banyo fayansları sökülüp yerine 60x120 yeni seramik döşenecek. Derz dolgusu dahil.",
    kategori: "Seramik & Fayans",
    metrekare: 18,
    fotograf: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    durum: "Açık", // "Açık" veya "Teklif Kabul Edildi"
    olusturmaTarihi: "12.11.2026",
    teklifler: [
      {
        id: "teklif-201",
        ustaAdi: "Ahmet Usta",
        fiyat: 14500,
        sure: "3 Gün",
        not: "Malzeme hariç işçilik fiyatıdır, yarın başlayabilirim.",
        kabulEdildi: false
      }
    ]
  },
  {
    id: "talep-102",
    baslik: "3+1 Daire Komple İç Cephe Boyama",
    aciklama: "Daire boş durumda. Duvarlarda ufak alçı tamiratları yapılıp 2 kat silinebilir su bazlı boya vurulacak.",
    kategori: "Boya & Badana",
    metrekare: 110,
    fotograf: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
    durum: "Açık",
    olusturmaTarihi: "12.11.2026",
    teklifler: []
  }
];

// Varsayılan Usta Profili (Usta tarafında yetenek seçimi için)
export const VARSAYILAN_USTA_PROFILI = {
  ustaAdi: "Mehmet Usta",
  yetenekler: ["Seramik & Fayans", "Boya & Badana"]
};