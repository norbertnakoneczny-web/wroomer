export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log("Szukam ogloszenia:", id)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
  
  const { data, error } = await supabase
    .from('ogloszenia')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    return <div className="p-6">Błąd Supabase: {error.message} <br/><Link href="/">Wróć</Link></div>
  }
  
  if (!data) {
    return <div className="p-6">Nie ma ogłoszenia {id} - <Link href="/">wróć na główną</Link></div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600">← Wróć</Link>
      <h1 className="text-3xl font-bold mt-4">{data.tytul}</h1>
      <p className="mt-2">{data.opis}</p>
      <p className="mt-4 font-bold text-xl">{data.cena} zł</p>
      <p className="text-sm text-gray-500 mt-2">ID: {data.id}</p>
    </div>
  )
}
