
'use client'
import { useState, useMemo } from 'react'

const CARS = [
  {id:1, title:'BMW X1 2013', price:32900, loc:'Gorzyce', year:2013, fuel:'Diesel', km:180, img:'gradient-1'},
  {id:2, title:'BMW 218 2014', price:38800, loc:'Gorzyce', year:2014, fuel:'Diesel', km:219, img:'gradient-2'},
  {id:3, title:'Opel Insignia 2021 kombi', price:62500, loc:'Gorzyce', year:2021, fuel:'Diesel', km:95, img:'gradient-3'},
  {id:4, title:'2005 BMW Series 5', price:17500, loc:'Gorzyce', year:2005, fuel:'Benzyna', km:289, img:'gradient-4'},
  {id:5, title:'2005 BMW Series 5', price:17500, loc:'Gorzyce', year:2005, fuel:'Diesel', km:289, img:'gradient-5'},
  {id:6, title:'Volvo V50', price:8500, loc:'Klonowa 3', year:2006, fuel:'Diesel', km:220, img:'gradient-6'},
  {id:7, title:'Peugeot 508 2.0 hdi', price:3500, loc:'Gorzyce', year:2006, fuel:'Diesel', km:250, img:'gradient-7'},
  {id:8, title:'Fiat Stilo 1.4 LPG 2006', price:4000, loc:'Gorzyce', year:2006, fuel:'LPG', km:198, img:'gradient-8'},
]

const BRANDS = ['Wszystkie marki','Abarth','Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Cadillac','Chevrolet','Chrysler','Citroen','Cupra','Dacia','Daewoo','Dodge','DS','Ferrari','Fiat','Ford','Honda','Hyundai','Jaguar','Jeep','Kia','Lamborghini','Lancia','Land Rover','Lexus','Maserati','Mazda','Mercedes-Benz','Mini','Mitsubishi','Nissan','Opel','Peugeot','Porsche','Renault','Saab','Seat','Skoda','Subaru','Suzuki','Tesla','Toyota','Volkswagen','Volvo','inne']

const GRADIENTS: Record<string,string> = {
  'gradient-1':'from-zinc-800 to-zinc-600',
  'gradient-2':'from-slate-900 to-slate-700',
  'gradient-3':'from-blue-900 to-indigo-800',
  'gradient-4':'from-zinc-900 to-zinc-700',
  'gradient-5':'from-orange-900 to-amber-800',
  'gradient-6':'from-slate-800 to-slate-600',
  'gradient-7':'from-gray-800 to-gray-600',
  'gradient-8':'from-yellow-900 to-orange-800',
}

export default function Page(){
  const [brand,setBrand] = useState('Wszystkie marki')
  const [loc,setLoc] = useState('Gorzyce')
  const filtered = useMemo(()=> CARS.filter(c=>{
    if(brand!=='Wszystkie marki' && !c.title.toLowerCase().includes(brand.toLowerCase())) return false
    if(loc && !c.loc.toLowerCase().includes(loc.toLowerCase())) return false
    return true
  }),[brand,loc])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <header className="h-[56px] border-b border-[#1E1E20] flex items-center px-4 justify-between">
        <div className="font-black text-[20px] tracking-tight">WROOMER.PL <span className="ml-2 text-[10px] bg-[#1E1E20] px-2 py-1 rounded-full text-[#9AA0A6]">v11.10 FINAL FIXED</span></div>
        <div className="flex gap-2"><div className="px-4 py-2 rounded-full bg-[#1E1E20] text-[13px]">Zaloguj</div><div className="px-4 py-2 rounded-full bg-[#FFD400] text-black text-[13px] font-bold">+ Dodaj</div></div>
      </header>
      <div className="flex">
        <aside className="w-[280px] min-h-[calc(100vh-56px)] border-r border-[#1E1E20] p-4 space-y-5">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">SZUKAJ W PROMIENIU</div>
            <button className="w-full h-[44px] rounded-[12px] bg-[#1E2A4A] text-[#5B8DEF] font-bold text-[13px]">📍 Zlokalizuj mnie</button>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div><div className="text-[10px] text-[#9AA0A6] mb-1">PROMIEŃ (KM)</div><select className="w-full h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] text-[12px] px-2"><option>Dowolny</option><option>5</option><option>10</option><option>25</option><option>50</option><option>100</option></select></div>
              <div><div className="text-[10px] text-[#9AA0A6] mb-1">SORT PO ODLEGŁOŚCI</div><select className="w-full h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] text-[12px] px-2"><option>Nie</option><option>Tak</option></select></div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">MARKA / MODELE (60/300+)</div>
            <select value={brand} onChange={e=>setBrand(e.target.value)} className="w-full h-[40px] rounded-[10px] bg-[#141416] border border-[#232326] text-[13px] px-3">
              {BRANDS.map(b=><option key={b}>{b}</option>)}
            </select>
            <select className="w-full h-[40px] mt-2 rounded-[10px] bg-[#141416] border border-[#232326] text-[13px] px-3"><option>Wszystkie modele</option><option>Series 3</option><option>X1</option><option>A4</option><option>500</option></select>
          </div>
          <div className="space-y-3">
            <div><div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">CENA</div><div className="grid grid-cols-2 gap-2"><input placeholder="OD" className="h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"/><input placeholder="DO" className="h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"/></div></div>
            <div><div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">ROK</div><div className="grid grid-cols-2 gap-2"><input placeholder="OD" className="h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"/><input placeholder="DO" className="h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"/></div></div>
            <div><div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">PALIWO</div><select className="w-full h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"><option>Wszystkie</option><option>Benzyna</option><option>Diesel</option><option>LPG</option></select></div>
            <div><div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">LOKALIZACJA (tekst)</div><input value={loc} onChange={e=>setLoc(e.target.value)} className="w-full h-[40px] rounded-[10px] bg-[#141416] border border-[#232326] px-3 text-[13px]"/></div>
            <div><div className="text-[11px] font-bold tracking-widest text-[#FFD400] mb-2">SORT</div><select className="w-full h-[36px] rounded-[8px] bg-[#141416] border border-[#232326] px-3 text-[13px]"><option>Najnowsze</option><option>Najtańsze</option><option>Najdroższe</option></select></div>
          </div>
          <div className="space-y-2">
            <button className="w-full h-[48px] rounded-full bg-[#FFD400] text-black font-extrabold text-[14px]">Szukaj</button>
            <button onClick={()=>{setBrand('Wszystkie marki');setLoc('')}} className="w-full h-[44px] rounded-full bg-[#1A1A1D] border border-[#232326] font-bold text-[13px]">Wyczyść</button>
          </div>
          <div className="text-[12px] text-[#9AA0A6] bg-[#141416] rounded-[8px] p-3 border border-[#232326]">{filtered.length} ogłoszeń • kafelki 250px (było 360px)</div>
        </aside>
        <main className="flex-1 p-4">
          <div className="grid grid-cols-4 gap-[12px]">
            {filtered.map(car=>(
              <div key={car.id} className="rounded-[14px] bg-[#141416] border border-[#232326] overflow-hidden group hover:border-[#3A3A3E] transition">
                <div className={`h-[160px] bg-gradient-to-br ${GRADIENTS[car.img]} relative`}>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-[10px] font-bold">📷 10</div>
                </div>
                <div className="p-[10px] h-[85px] flex flex-col justify-between">
                  <div className="text-[13px] font-bold leading-[1.2] truncate">{car.title}</div>
                  <div className="text-[11px] text-[#9AA0A6] truncate">📍 {car.loc} • {car.year} • {car.km}k km • {car.fuel}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-extrabold text-[#FFD400]">{car.price.toLocaleString('pl-PL')} PLN</div>
                    <div className="text-[10px] text-[#5A5A5E]">2.3 km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-[#1E1E20] pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-black text-[14px] tracking-widest">BLOG <span className="text-[#FFD400]">WROOMER</span> • PORADNIK KIEROWCY</div>
              <div className="text-[12px] px-3 py-1 rounded-full border border-[#232326]">Zobacz wszystkie →</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                ['Najmniejsze spalanie auta benzynowe 2026','from-zinc-800 to-zinc-600'],
                ['Samochody do 20 tysięcy dla rodziny','from-red-900 to-orange-800'],
                ['Jak nie kupić auta z cofniętym licznikiem','from-zinc-900 to-zinc-700'],
                ['Ile kosztuje przerejestrowanie auta 2026','from-slate-800 to-slate-600']
              ].map(([t,g])=>(
                <div key={t} className="rounded-[12px] bg-[#141416] border border-[#232326] overflow-hidden">
                  <div className={`h-[140px] bg-gradient-to-br ${g}`}></div>
                  <div className="p-3 text-[13px] font-bold leading-[1.3]">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
