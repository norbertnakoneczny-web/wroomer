import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

export default async function EdytujPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: ogloszenie } = await supabase.from('ogloszenia').select('*').eq('id', params.id).single()

  if (!ogloszenie || !user || ogloszenie.user_id !== user.id) return notFound()

  async function save(formData: FormData) {
    "use server"
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('ogloszenia').update({
      tytul: formData.get('tytul'),
      opis: formData.get('opis'),
      cena: formData.get('cena'),
    }).eq('id', params.id).eq('user_id', user?.id)

    redirect(`/ogloszenie/${params.id}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edytuj ogłoszenie</h1>
      <form action={save} className="space-y-4">
        <input name="tytul" defaultValue={ogloszenie.tytul} className="w-full border p-2 rounded" />
        <textarea name="opis" defaultValue={ogloszenie.opis} className="w-full border p-2 rounded h-32" />
        <input name="cena" defaultValue={ogloszenie.cena} className="w-full border p-2 rounded" />
        <button className="w-full bg-black text-white py-3 rounded-xl">Zapisz zmiany</button>
      </form>
    </div>
  )
}
