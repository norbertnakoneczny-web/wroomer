import React, { useState, useMemo } from "react";
const bmw218Img = "/bmw218.jpg";
const bmw5Img = "/bmw5.jpg";

type Car = {
  id: number;
  marka: string;
  model: string;
  rok: number;
  cena: number;
  paliwo: string;
  lokalizacja: string;
  lat: number;
  lng: number;
  przebieg: number;
  opis: string;
  vin: string;
  telefon: string;
  imageType: "bmw218" | "bmw5" | "gradient";
  gradient: string;
};

const GORZYCE = { lat: 50.0, lng: 18.4 };

const CARS: Car[] = [
  {
    id: 1,
    marka: "BMW",
    model: "218",
    rok: 2014,
    cena: 38800,
    paliwo: "Benzyna",
    lokalizacja: "Gorzyce",
    lat: 50.0,
    lng: 18.4,
    przebieg: 145000,
    opis: "BMW 218d Active Tourer, zadbany, serwisowany w ASO do 2023. Bezwypadkowy, 2 właścicieli, klimatronik dwustrefowy, nawigacja Professional, czujniki parkowania, tempomat. Idealny rodzinny kompakt z dieslem 2.0 150KM - niskie spalanie 5.2l. Do obejrzenia w Gorzycach.",
    vin: "WBA2A31000V123001",
    telefon: "501705817",
    imageType: "bmw218",
    gradient: "from-zinc-800 to-zinc-600",
  },
  {
    id: 2,
    marka: "BMW",
    model: "Series 5",
    rok: 2005,
    cena: 17500,
    paliwo: "Diesel",
    lokalizacja: "Gorzyce",
    lat: 49.99,
    lng: 18.39,
    przebieg: 289000,
    opis: "BMW E60 530d, 218KM, automat. Mocny diesel, dynamiczny, zadbany. Skóry, nawigacja, nagłośnienie HiFi. Inwestycje na bieżąco - nowe tarcze, klocki, olej.",
    vin: "WBA2A31000V123002",
    telefon: "501705817",
    imageType: "bmw5",
    gradient: "from-slate-800 to-slate-600",
  },
  {
    id: 3,
    marka: "Fiat",
    model: "Stilo",
    rok: 2006,
    cena: 4000,
    paliwo: "LPG",
    lokalizacja: "Gorzyce",
    lat: 49.98,
    lng: 18.41,
    przebieg: 198000,
    opis: "Fiat Stilo 1.4 + LPG. Tani w eksploatacji, instalacja gazowa z 2021, butla ważna do 2031. Klima sprawna, el. szyby, centralny. Idealny na dojazdy.",
    vin: "ZFA19200000123003",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-orange-400 via-amber-300 to-yellow-200",
  },
  {
    id: 4,
    marka: "Audi",
    model: "A4",
    rok: 2018,
    cena: 65000,
    paliwo: "Diesel",
    lokalizacja: "Wodzisław Śląski",
    lat: 50.02,
    lng: 18.46,
    przebieg: 119000,
    opis: "Audi A4 B9 2.0 TDI 190KM S-tronic. Virtual cockpit, Matrix LED, skóry sportowe. Bezwypadkowe, krajowe, serwis ASO. Faktura VAT.",
    vin: "WAUZZZF4VJA123004",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-slate-900 via-slate-700 to-zinc-500",
  },
  {
    id: 5,
    marka: "Volvo",
    model: "XC60",
    rok: 2019,
    cena: 89000,
    paliwo: "Diesel",
    lokalizacja: "Rybnik",
    lat: 50.09,
    lng: 18.54,
    przebieg: 98000,
    opis: "Volvo XC60 D4 AWD Inscription. Najbogatsza wersja, masaże, wentylowane fotele, Bowers & Wilkins, Pilot Assist. Jeden właściciel.",
    vin: "YV1UZA8CMK123005",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-blue-900 via-indigo-800 to-slate-700",
  },
  {
    id: 6,
    marka: "Fiat",
    model: "500",
    rok: 2020,
    cena: 32000,
    paliwo: "Benzyna",
    lokalizacja: "Racibórz",
    lat: 50.09,
    lng: 18.22,
    przebieg: 45000,
    opis: "Fiat 500 1.0 Hybrid Dolcevita. Mały przebieg, garażowany, panormaiczny dach, CarPlay. Idealny do miasta, spalanie 4.1l.",
    vin: "ZFA31200000123006",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-rose-300 via-pink-200 to-orange-100",
  },
  {
    id: 7,
    marka: "BMW",
    model: "320d",
    rok: 2016,
    cena: 54000,
    paliwo: "Diesel",
    lokalizacja: "Żory",
    lat: 50.04,
    lng: 18.7,
    przebieg: 165000,
    opis: "BMW F30 320d xDrive 190KM. M-pakiet, shadow line, Harman Kardon, Head-Up. Bardzo dynamiczne, napęd 4x4.",
    vin: "WBA8E31000V123007",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-zinc-900 to-zinc-700",
  },
  {
    id: 8,
    marka: "Toyota",
    model: "Corolla",
    rok: 2017,
    cena: 48000,
    paliwo: "Benzyna",
    lokalizacja: "Jastrzębie",
    lat: 49.95,
    lng: 18.58,
    przebieg: 89000,
    opis: "Toyota Corolla 1.6 Valvematic, bezwypadkowa, serwisowana w ASO Toyota. Niezawodna, niskie koszty. Gwarancja do 2026.",
    vin: "NMTBZ3BE00R123008",
    telefon: "501705817",
    imageType: "gradient",
    gradient: "from-red-600 via-red-400 to-orange-300",
  },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  const [draft, setDraft] = useState({
    marka: "Wszystkie marki",
    model: "Wszystkie modele",
    cenaOd: "",
    cenaDo: "",
    rokOd: "",
    rokDo: "",
    paliwo: "Wszystkie",
    lokalizacja: "",
    promien: "Dowolny",
    sortOdleglosci: false,
    sort: "Najnowsze" as "Najnowsze" | "Najtańsze" | "Najdroższe" | "Najbliższe",
  });

  const [active, setActive] = useState(draft);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [upped, setUpped] = useState<Record<number, number>>({});
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const brands = ["Wszystkie marki", "Fiat", "Volvo", "Audi", "BMW", "Toyota"];
  const modelsByBrand: Record<string, string[]> = {
    "Wszystkie marki": ["Wszystkie modele"],
    Fiat: ["Wszystkie modele", "Stilo", "500"],
    Volvo: ["Wszystkie modele", "XC60"],
    Audi: ["Wszystkie modele", "A4"],
    BMW: ["Wszystkie modele", "218", "Series 5", "320d"],
    Toyota: ["Wszystkie modele", "Corolla"],
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocError("Geolokalizacja nie jest wspierana");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocError(err.message || "Nie udało się pobrać lokalizacji");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePodbij = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUpped((prev) => ({ ...prev, [id]: Date.now() }));
  };

  const filtered = useMemo(() => {
    let center: { lat: number; lng: number } | null = null;
    if (userLocation) center = userLocation;
    else if (active.lokalizacja.toLowerCase().includes("gorzyce")) center = GORZYCE;

    let result = CARS.filter((car) => {
      if (active.marka !== "Wszystkie marki" && car.marka !== active.marka) return false;
      if (active.model !== "Wszystkie modele" && car.model !== active.model) return false;
      if (active.paliwo !== "Wszystkie" && car.paliwo !== active.paliwo) return false;
      if (active.cenaOd && car.cena < Number(active.cenaOd)) return false;
      if (active.cenaDo && car.cena > Number(active.cenaDo)) return false;
      if (active.rokOd && car.rok < Number(active.rokOd)) return false;
      if (active.rokDo && car.rok > Number(active.rokDo)) return false;
      if (active.lokalizacja && !car.lokalizacja.toLowerCase().includes(active.lokalizacja.toLowerCase())) {
        // allow Gorzyce trick, but still filter text if not matching
        if (active.lokalizacja.toLowerCase().trim() !== "gorzyce" || center === null) {
          // if searching Gorzyce we already have center logic, but text filter still applies unless it's Gorzyce itself? Actually keep includes logic
          if (!car.lokalizacja.toLowerCase().includes(active.lokalizacja.toLowerCase())) return false;
        }
      }
      if (active.promien !== "Dowolny" && center) {
        const d = haversine(center.lat, center.lng, car.lat, car.lng);
        if (d > Number(active.promien)) return false;
      }
      return true;
    });

    result = result.sort((a, b) => {
      const aUpped = upped[a.id];
      const bUpped = upped[b.id];
      if (aUpped && bUpped) return bUpped - aUpped;
      if (aUpped) return -1;
      if (bUpped) return 1;

      const needDistSort = active.sortOdleglosci || active.sort === "Najbliższe";
      if (needDistSort && center) {
        const da = haversine(center.lat, center.lng, a.lat, a.lng);
        const db = haversine(center.lat, center.lng, b.lat, b.lng);
        if (da !== db) return da - db;
      }

      if (active.sort === "Najtańsze") return a.cena - b.cena;
      if (active.sort === "Najdroższe") return b.cena - a.cena;
      if (active.sort === "Najnowsze") return b.id - a.id;
      return 0;
    });

    return result;
  }, [active, upped, userLocation]);

  const distanceForCar = (car: Car) => {
    if (userLocation) return haversine(userLocation.lat, userLocation.lng, car.lat, car.lng);
    if (active.lokalizacja.toLowerCase().includes("gorzyce")) return haversine(GORZYCE.lat, GORZYCE.lng, car.lat, car.lng);
    if (active.sortOdleglosci || active.sort === "Najbliższe") {
      // if we have no center but sorting wants distance, return null
      return null;
    }
    return null;
  };

  const distanceFromGorzyceToUser = userLocation ? haversine(GORZYCE.lat, GORZYCE.lng, userLocation.lat, userLocation.lng) : null;

  const applySearch = () => setActive(draft);
  const clearAll = () => {
    const empty = {
      marka: "Wszystkie marki",
      model: "Wszystkie modele",
      cenaOd: "",
      cenaDo: "",
      rokOd: "",
      rokDo: "",
      paliwo: "Wszystkie",
      lokalizacja: "",
      promien: "Dowolny",
      sortOdleglosci: false,
      sort: "Najnowsze" as const,
    };
    setDraft(empty);
    setActive(empty);
    setUserLocation(null);
    setLocError(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#0F172A] selection:bg-[#FFDE59]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
        :root {
          --bg: #F6F7F9;
          --card: #FFFFFF;
          --text: #0F172A;
          --muted: #64748B;
          --border: #E2E8F0;
          --accent: #FFD400;
          --accent-hover: #FACC15;
          --green: #16A34A;
        }
        * { font-family: "Manrope", system-ui, -apple-system, sans-serif; }
        h1,h2,.brand-font { font-family: "Space Grotesk", "Manrope", sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 999px; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-font font-[800] text-[24px] tracking-[-0.02em]">WROOMER.PL</div>
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#0F172A] text-white text-[10px] font-bold tracking-widest">v12 PREMIUM + PROMIEŃ FIXED</span>
              <span className="px-2 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[10px] font-bold">8 KAFELI FIXED</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={() => showToast("Logowanie – wersja demo v12")} className="hidden md:block px-4 py-2 rounded-full border border-[#E2E8F0] text-sm font-semibold hover:bg-[#F8FAFC] transition">Zaloguj</button>
            <button onClick={() => showToast("Dodawanie ogłoszenia – moduł premium wkrótce")} className="px-4 md:px-5 py-2.5 rounded-full bg-[#FFD400] hover:bg-[#FACC15] text-[#0F172A] text-sm font-extrabold shadow-sm transition">+ Dodaj ogłoszenie</button>
          </div>
        </div>
        {/* brand pills */}
        <div className="border-t border-[#F1F5F9] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-[52px] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold tracking-widest text-[#94A3B8] mr-2 shrink-0">MARKI:</span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setDraft((d) => ({ ...d, marka: b, model: "Wszystkie modele" }));
                  setActive((a) => ({ ...a, marka: b, model: "Wszystkie modele" }));
                  showToast(`Filtr marki: ${b} – ${b === "Wszystkie marki" ? 8 : CARS.filter(c=>c.marka===b).length} ogłoszeń`);
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition ${
                  active.marka === b ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white border-[#E2E8F0] text-[#334155] hover:border-[#0F172A]"
                }`}
              >
                {b}
              </button>
            ))}
            <div className="ml-auto hidden md:flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <span>📍 Gorzyce 50.0N 18.4E</span>
              <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span>{filtered.length} wyników</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT FILTERS */}
        <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-[128px]">
          <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F1F5F9] overflow-hidden">
            <div className="p-6 pb-4 border-b border-[#F8FAFC]">
              <h2 className="font-bold text-[15px] tracking-tight">Filtry premium</h2>
              <p className="text-[12px] text-[#94A3B8] mt-1">Promień + UPS działa jak wcześniej</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Lokalizacja */}
              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">LOKALIZACJA I PROMIEŃ</label>
                <div className="relative">
                  <input
                    value={draft.lokalizacja}
                    onChange={(e) => setDraft({ ...draft, lokalizacja: e.target.value })}
                    placeholder="Gorzyce, Wodzisław..."
                    className="w-full h-[44px] px-4 pr-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium outline-none focus:border-[#0F172A] focus:bg-white transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">📍</span>
                </div>

                <button
                  onClick={handleLocate}
                  disabled={locating}
                  className="w-full h-[42px] rounded-xl bg-[#0F172A] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-black transition disabled:opacity-60"
                >
                  {locating ? "⏳ Lokalizowanie..." : "📍 Zlokalizuj mnie"}
                </button>

                {userLocation && (
                  <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-[12px] leading-5">
                    <div className="font-bold text-[#166534]">Twoja lokalizacja aktywna</div>
                    <div className="text-[#15803D]">
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} <br />
                      {distanceFromGorzyceToUser !== null && (
                        <span>📍 {distanceFromGorzyceToUser.toFixed(1)} km od Gorzyc</span>
                      )}
                    </div>
                  </div>
                )}
                {locError && (
                  <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3 text-[12px] text-[#991B1B]">{locError}</div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-[#94A3B8] mb-1.5">PROMIEŃ (KM)</div>
                    <select
                      value={draft.promien}
                      onChange={(e) => setDraft({ ...draft, promien: e.target.value })}
                      className="w-full h-[40px] px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] font-semibold outline-none focus:border-[#0F172A]"
                    >
                      <option>Dowolny</option>
                      <option>5</option>
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-[#94A3B8] mb-1.5">SORT PO ODLEGŁOŚCI</div>
                    <select
                      value={draft.sortOdleglosci ? "Tak" : "Nie"}
                      onChange={(e) => setDraft({ ...draft, sortOdleglosci: e.target.value === "Tak" })}
                      className="w-full h-[40px] px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] font-semibold outline-none focus:border-[#0F172A]"
                    >
                      <option>Nie</option>
                      <option>Tak</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#F1F5F9]" />

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">MARKA / MODEL</label>
                <select
                  value={draft.marka}
                  onChange={(e) => setDraft({ ...draft, marka: e.target.value, model: "Wszystkie modele" })}
                  className="w-full h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-semibold outline-none"
                >
                  {brands.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <select
                  value={draft.model}
                  onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                  className="w-full h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-semibold outline-none"
                >
                  {(modelsByBrand[draft.marka] || ["Wszystkie modele"]).map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">CENA (PLN)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Od"
                    value={draft.cenaOd}
                    onChange={(e) => setDraft({ ...draft, cenaOd: e.target.value })}
                    className="h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium outline-none focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    value={draft.cenaDo}
                    onChange={(e) => setDraft({ ...draft, cenaDo: e.target.value })}
                    className="h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">ROCZNIK</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Od"
                    value={draft.rokOd}
                    onChange={(e) => setDraft({ ...draft, rokOd: e.target.value })}
                    className="h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Do"
                    value={draft.rokDo}
                    onChange={(e) => setDraft({ ...draft, rokDo: e.target.value })}
                    className="h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">PALIWO</label>
                <select
                  value={draft.paliwo}
                  onChange={(e) => setDraft({ ...draft, paliwo: e.target.value })}
                  className="w-full h-[44px] px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-semibold outline-none"
                >
                  <option>Wszystkie</option>
                  <option>Diesel</option>
                  <option>Benzyna</option>
                  <option>LPG</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-extrabold tracking-widest text-[#64748B]">SORTOWANIE</label>
                <select
                  value={draft.sort}
                  onChange={(e) => setDraft({ ...draft, sort: e.target.value as any })}
                  className="w-full h-[44px] px-4 rounded-xl bg-white border border-[#0F172A] text-[14px] font-bold outline-none shadow-sm"
                >
                  <option>Najnowsze</option>
                  <option>Najtańsze</option>
                  <option>Najdroższe</option>
                  <option>Najbliższe</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={applySearch}
                  className="flex-1 h-[46px] rounded-full bg-[#FFD400] hover:bg-[#FACC15] text-[#0F172A] text-[14px] font-extrabold shadow-[0_2px_8px_rgba(255,212,0,0.35)] transition"
                >
                  Szukaj
                </button>
                <button
                  onClick={clearAll}
                  className="h-[46px] px-5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-[14px] font-bold transition"
                >
                  Wyczyść
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-[12px]">
                <span className="text-[#94A3B8] font-medium">Liczba ogłoszeń</span>
                <span className="px-2.5 py-1 rounded-full bg-[#0F172A] text-white font-bold text-[12px]">{filtered.length} / 8 ogłoszeń</span>
              </div>

              <div className="rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] p-3 text-[11px] leading-[1.5] text-[#92400E]">
                <span className="font-extrabold">ℹ️ TIP:</span> Wpisz „Gorzyce” w lokalizację, aby włączyć tryb promienia bez GPS. UPS przenosi ogłoszenie na górę listy na 24h (lokalnie).
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT GRID */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 px-1">
            <h1 className="text-[18px] md:text-[22px] font-bold tracking-tight">Ogłoszenia w okolicy Gorzyc • v12 PREMIUM + PROMIEŃ FIXED</h1>
            <div className="hidden md:flex items-center gap-2 text-[12px] text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live filtr • haversine() • 8 kafelek
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((car) => {
              const dist = distanceForCar(car);
              const isUpped = !!upped[car.id];
              return (
                <article
                  key={car.id}
                  onClick={() => {
                    setSelectedCar(car);
                    setSliderIdx(0);
                  }}
                  className="group bg-white rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F1F5F9] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F8FAFC]">
                    {car.imageType === "bmw218" ? (
                      <img src={bmw218Img} alt={`${car.marka} ${car.model}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
                    ) : car.imageType === "bmw5" ? (
                      <img src={bmw5Img} alt={`${car.marka} ${car.model}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${car.gradient} flex items-center justify-center`}>
                        <div className="text-white/90 font-extrabold tracking-[-0.02em] text-[22px] drop-shadow">
                          {car.marka} {car.model}
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      {isUpped && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FFD400] text-[#0F172A] text-[11px] font-extrabold shadow">⬆️ UPS</span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[#0F172A] text-[11px] font-bold shadow-sm">{car.rok}</span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handlePodbij(car.id, e)}
                        className="px-2.5 py-1 rounded-full bg-[#0F172A] text-white text-[11px] font-bold hover:bg-black transition shadow"
                      >
                        ⬆️ Podbij (UPS)
                      </button>
                    </div>

                    {dist !== null && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#0F172A]/90 text-white text-[11px] font-bold backdrop-blur">
                        📍 {dist.toFixed(1)} km od Ciebie
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-extrabold text-[18px] tracking-tight">
                          {car.marka} {car.model} • {car.rok}
                        </div>
                        <div className="text-[12px] text-[#64748B] font-medium mt-0.5 flex items-center gap-2">
                          <span>📍 {car.lokalizacja}</span>
                          <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                          <span>{car.przebieg.toLocaleString("pl-PL")} km</span>
                          <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
                          <span>{car.paliwo}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[18px] tracking-tight">{car.cena.toLocaleString("pl-PL")} PLN</div>
                        <div className="text-[11px] text-[#94A3B8] font-bold">{(car.cena / 1.23).toFixed(0)} € netto</div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#F1F5F9] text-[11px] font-semibold text-[#475569]">{car.paliwo}</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#F1F5F9] text-[11px] font-semibold text-[#475569]">{car.rok}</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#F1F5F9] text-[11px] font-semibold text-[#475569]">{car.lokalizacja}</span>
                    </div>

                    <p className="mt-3 text-[13px] leading-[1.5] text-[#475569] line-clamp-2">{car.opis}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 bg-white rounded-[20px] border border-[#F1F5F9] p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="text-[40px] mb-3">🔍</div>
              <div className="font-bold text-[16px]">Brak wyników w tym promieniu</div>
              <div className="text-[13px] text-[#64748B] mt-2 max-w-[360px] mx-auto">
                Zwiększ promień do 50 km lub wyczyść filtry. Jeśli nie masz GPS, wpisz „Gorzyce” aby użyć centrum 50.0N, 18.4E.
              </div>
              <button onClick={clearAll} className="mt-5 px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-[13px] font-bold">Wyczyść filtry</button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
            <span>© WROOMER.PL v12</span>
            <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
            <span>8 ogłoszeń • haversine() • Gorzyce 50.0, 18.4 • premium jasny design</span>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-4 py-2.5 rounded-full bg-[#0F172A] text-white text-[13px] font-bold shadow-[0_8px_24px_rgba(0,0,0,0.2)] border border-white/10 animate-[in_0.2s_ease]">
          {toast}
        </div>
      )}

      {/* MODAL */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-6 bg-[#0F172A]/60 backdrop-blur-[6px] overflow-y-auto">
          <div className="bg-white w-full md:max-w-[1100px] rounded-none md:rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.25)] my-0 md:my-6 animate-[in_0.25s_ease]">
            <style>{`@keyframes in { from { transform: translateY(12px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>

            <div className="flex items-center justify-between px-6 h-[64px] border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-[14px]">W</div>
                <div>
                  <div className="font-extrabold text-[15px] leading-none">
                    {selectedCar.marka} {selectedCar.model} {selectedCar.rok}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-medium mt-1">
                    📍 {selectedCar.lokalizacja} • {selectedCar.lat}, {selectedCar.lng} • VIN {selectedCar.vin.slice(0, 8)}...
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePodbij(selectedCar.id)}
                  className="hidden md:inline-flex h-9 px-3 rounded-full bg-[#FFD400] text-[#0F172A] text-[12px] font-extrabold"
                >
                  ⬆️ Podbij (UPS)
                </button>
                <button
                  onClick={() => setSelectedCar(null)}
                  className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F1F5F9]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-0">
              {/* slider */}
              <div className="p-4 md:p-6 bg-[#FCFDFF]">
                <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden bg-[#F1F5F9] border border-[#F1F5F9]">
                  {selectedCar.imageType === "bmw218" ? (
                    <img src={bmw218Img} alt="BMW 218" className="w-full h-full object-cover" />
                  ) : selectedCar.imageType === "bmw5" ? (
                    <img src={bmw5Img} alt="BMW 5" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedCar.gradient}`} />
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold">
                      {sliderIdx + 1} / 10
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSliderIdx((s) => (s - 1 + 10) % 10)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-bold"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setSliderIdx((s) => (s + 1) % 10)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-bold"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                  {upped[selectedCar.id] && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFD400] text-[12px] font-extrabold shadow">⬆️ UPS PODBITE</div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-10 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSliderIdx(i)}
                      className={`aspect-square rounded-[10px] overflow-hidden border-2 transition ${
                        i === sliderIdx ? "border-[#0F172A]" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {selectedCar.imageType !== "gradient" ? (
                        <img
                          src={selectedCar.imageType === "bmw218" ? bmw218Img : bmw5Img}
                          alt={`thumb ${i}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${selectedCar.gradient}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* mini map */}
                <div className="mt-6 rounded-[16px] border border-[#E2E8F0] overflow-hidden bg-white">
                  <div className="px-4 h-[44px] flex items-center justify-between border-b border-[#F1F5F9]">
                    <span className="text-[12px] font-extrabold tracking-widest">MAPA • {selectedCar.lokalizacja}</span>
                    {distanceForCar(selectedCar) !== null && (
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#0F172A] text-white">
                        📍 {distanceForCar(selectedCar)!.toFixed(1)} km od Ciebie
                      </span>
                    )}
                  </div>
                  <div className="relative h-[160px] bg-[#F8FAFC] overflow-hidden">
                    {/* fake map grid */}
                    <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-3 h-3 rounded-full bg-[#0F172A] shadow-[0_0_0_6px_rgba(15,23,42,0.15)]" />
                      <div className="mt-2 px-2 py-1 rounded-full bg-[#0F172A] text-white text-[10px] font-bold whitespace-nowrap">
                        {selectedCar.marka} {selectedCar.model}
                      </div>
                    </div>
                    {userLocation && (
                      <div className="absolute left-[30%] top-[30%]">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.2)] animate-pulse" />
                        <div className="mt-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">TY</div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-[#94A3B8] font-medium">
                      <span>50.0N, 18.4E Gorzyce centrum</span>
                      <span>{selectedCar.lat.toFixed(3)}, {selectedCar.lng.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* specs */}
              <div className="p-6 border-t md:border-t-0 md:border-l border-[#F1F5F9] flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold tracking-widest text-[#94A3B8]">CENA</div>
                    <div className="text-[28px] font-extrabold tracking-tight leading-none mt-1">{selectedCar.cena.toLocaleString("pl-PL")} PLN</div>
                    <div className="text-[12px] text-[#64748B] font-medium mt-1">Do negocjacji • Faktura VAT • {selectedCar.przebieg.toLocaleString("pl-PL")} km</div>
                  </div>
                  <button
                    onClick={() => handlePodbij(selectedCar.id)}
                    className="md:hidden px-3 py-2 rounded-full bg-[#FFD400] text-[12px] font-extrabold"
                  >
                    ⬆️ UPS
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Marka", selectedCar.marka],
                    ["Model", selectedCar.model],
                    ["Rok", String(selectedCar.rok)],
                    ["Przebieg", `${selectedCar.przebieg.toLocaleString("pl-PL")} km`],
                    ["Paliwo", selectedCar.paliwo],
                    ["Lokalizacja", selectedCar.lokalizacja],
                    ["VIN", selectedCar.vin],
                    ["Dystans", distanceForCar(selectedCar) !== null ? `${distanceForCar(selectedCar)!.toFixed(1)} km` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[12px] bg-[#F8FAFC] border border-[#F1F5F9] p-3">
                      <div className="text-[10px] font-bold tracking-widest text-[#94A3B8]">{k}</div>
                      <div className="text-[13px] font-bold mt-1 truncate">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="text-[11px] font-extrabold tracking-widest text-[#64748B] mb-2">OPIS</div>
                  <p className="text-[13px] leading-[1.6] text-[#334155] bg-[#FFFEF5] border border-[#FEF3C7] rounded-[12px] p-4">{selectedCar.opis}</p>
                </div>

                <div className="mt-auto pt-6 space-y-3">
                  <a
                    href={`tel:${selectedCar.telefon}`}
                    className="w-full h-[52px] rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(22,163,74,0.3)] transition"
                  >
                    📞 Zadzwoń {selectedCar.telefon}
                  </a>
                  <div className="flex gap-2">
                    <button className="flex-1 h-[44px] rounded-full bg-[#0F172A] text-white text-[13px] font-bold">💬 Napisz wiadomość</button>
                    <button className="h-[44px] px-4 rounded-full border border-[#E2E8F0] text-[13px] font-bold bg-white">🔗 Udostępnij</button>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] text-center">Bezpieczny kontakt • Sprzedawca zweryfikowany • Gorzyce 50.0, 18.4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
