
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase'
import OgłoszenieClient from './client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('ogloszenia')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Błąd ogłoszenia:', error)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Nie znaleziono ogłoszenia</h1>
        <p>ID: {id}</p>
        <p className="text-sm text-gray-500 mt-2">{error?.message}</p>
        <a href="/" className="mt-4 inline-block underline">Wróć na główną</a>
      </div>
    )
  }

  return <OgłoszenieClient data={data} />
}
