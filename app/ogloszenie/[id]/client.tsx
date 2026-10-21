
"use client"
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

export default function OgłoszenieClient({ data }: { data: any }) {
  const supabase = createClient()
  const counted = useRef(false)

  useEffect(() => {
    // Zabezpieczenie: tylko raz na sesję i tylko raz na mount
    if (counted.current) return
    const key = `viewed_${data.id}`
    if (sessionStorage.getItem(key)) return
    
    counted.current = true
    sessionStorage.setItem(key, '1')

    // Użyj RPC zamiast UPDATE - omija RLS
    supabase.rpc('increment_view', { ad_id: data.id }).then(({ error }) => {
      if (error) console.warn('increment_view error:', error.message)
    })
  }, [data.id])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{data.tytul || data.title}</h1>
      <p className="text-gray-500 mt-2">ID: {data.id} • Wyświetlenia: {data.views}</p>
      <div className="mt-6">
        <p>{data.opis || data.description}</p>
        <p className="mt-4 font-bold text-xl">{data.cena ? `${data.cena} zł` : ''}</p>
      </div>
      <a href="/" className="mt-8 inline-block bg-black text-white px-4 py-2 rounded">Wróć</a>
    </div>
  )
}
