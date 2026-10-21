export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data, error } = await supabase
    .from('ogloszenia')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return <div className="p-6 bg-black text-white">Błąd: {error.message} <Link href="/" className="text-yellow-400"> Wróć</Link></div>
  if (!data) return <div className="p-6 bg-black text-white">Nie ma ogłoszenia {id} <Link href="/" className="text-yellow-400"> Wróć</Link></div>

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-yellow-400 font-bold">← WROOMER.PL</Link>
      <h1 className="text-3xl font-bold mt-4">{data.title}</h1>
      <p className="mt-2 text-gray-300">{data.brand} {data.model} - {data.location}</p>
      <p className="mt-4">{data.description}</p>
      <p className="mt-6 text-2xl font-bold text-yellow-400">{data.price} zł</p>
      {data.image_url && <img src={data.image_url} alt={data.title} className="mt-6 rounded-lg max-w-full" />}
    </div>
  )
}
