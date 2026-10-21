export const dynamic = 'force-dynamic'
export const revalidate = 0
import { createClient } from '@supabase/supabase-js'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  
  const { data } = await supabase.from('ogloszenia').select('*').eq('id', id).single()
  
  if (!data) return <div>Nie ma ogłoszenia {id} - <a href="/">wróć</a></div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{data.tytul}</h1>
      <p>{data.opis}</p>
      <p className="mt-4 font-bold">{data.cena} zł</p>
    </div>
  )
}
