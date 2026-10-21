export const dynamic = 'force-dynamic'
export const revalidate = 0
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data } = await supabase.from('ogloszenia').select('*').eq('status','active').eq('is_banned', false).order('created_at', {ascending:false})
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-yellow-400 text-2xl font-bold mb-6">WROOMER.PL - {data?.length} aut</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.map((o:any)=>(
          <Link key={o.id} href={`/ogloszenie/${o.id}`} className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <h2 className="font-bold">{o.title}</h2>
            <p className="text-sm text-gray-400">{o.brand} {o.model}</p>
            <p className="text-yellow-400 font-bold">{o.price} zł</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
