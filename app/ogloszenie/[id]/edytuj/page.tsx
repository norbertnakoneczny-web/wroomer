import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

const ADMIN_EMAIL = 'aaa@o2.pl'

export default async function EdytujPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  const { data: ogloszenie } = await supabase.from('ogloszenia').select('*').eq('id', id).single()
  if (!ogloszenie) return notFound()

  const isOwner = ogloszenie.user_id === user.id
  const isAdmin = user.email === ADMIN_EMAIL

  if (!isOwner && !isAdmin) return notFound()

  async function save(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return
    redirect(`/ogloszenie/${id}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-yellow-100 p-2 rounded text-sm mb-4">
        Zalogowany: <b>{user.email}</b> {isAdmin && '(ADMIN)'}<br/>
        Właściciel ogłoszenia: <b>{ogloszenie.user_id}</b> {isOwner && '(TY)'}
      </div>
      <h1 className="text-2xl font-bold mb-4">Edytuj ogłoszenie</h1>
      <form action={save} className="space-y-4">
        <input name="tytul" defaultValue={ogloszenie.tytul} className="w-full border p-2 rounded" />
        <textarea name="opis" defaultValue={ogloszenie.opis} className="w-full border p-2 rounded h-32" />
        <input name="cena" defaultValue={ogloszenie.cena} className="w-full border p-2 rounded" />
        <button className="w-full bg-black text-white py-3 rounded-xl">Zapisz</button>
      </form>
    </div>
  )
}
