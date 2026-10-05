export default function Home(){
  const cars = [
    {id:1, brand:'BMW', model:'Seria 5 F10', year:2016, price:'72 900 PLN', km:'145 tys km', fuel:'Diesel', img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600'},
    {id:2, brand:'Audi', model:'A4 B9', year:2018, price:'89 900 PLN', km:'98 tys km', fuel:'Benzyna', img:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600'},
    {id:3, brand:'Mercedes', model:'C-Klasa W205', year:2017, price:'84 500 PLN', km:'132 tys km', fuel:'Diesel', img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600'},
    {id:4, brand:'Volkswagen', model:'Passat B8', year:2019, price:'69 900 PLN', km:'110 tys km', fuel:'Diesel', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600'},
  ]
  return (
    <main>
      <header style={{background:'#0f172a', color:'white', padding:'20px 40px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin:0, fontSize:28}}>wroomer.pl</h1>
        <div style={{background:'#3b82f6', padding:'10px 20px', borderRadius:8}}>Sprzedaj auto +48 123 456 789</div>
      </header>
      <section style={{padding:'60px 40px', textAlign:'center', background:'white'}}>
        <h2 style={{fontSize:42, margin:'0 0 10px'}}>Sprzedaj auto za darmo w 24h</h2>
        <p style={{fontSize:18, color:'#64748b'}}>Wycena w 15 minut • Gotówka od ręki • Odbiór z domu</p>
      </section>
      <section style={{padding:'20px 40px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20, maxWidth:1200, margin:'0 auto'}}>
        {cars.map(c=>(
          <div key={c.id} style={{background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
            <img src={c.img} style={{width:'100%', height:200, objectFit:'cover'}} />
            <div style={{padding:16}}>
              <h3 style={{margin:'0 0 8px'}}>{c.brand} {c.model}</h3>
              <p style={{margin:0, color:'#64748b'}}>{c.year} • {c.km} • {c.fuel}</p>
              <p style={{fontWeight:700, fontSize:20, margin:'12px 0 0'}}>{c.price}</p>
            </div>
          </div>
        ))}
      </section>
      <section style={{padding:'40px', textAlign:'center'}}>
        <a href="/blog/jak-sprzedac-auto-za-darmo.html" style={{color:'#3b82f6'}}>Blog: Jak sprzedać auto za darmo? →</a>
      </section>
      <footer style={{background:'#0f172a', color:'#94a3b8', padding:20, textAlign:'center', marginTop:40}}>© 2026 wroomer.pl - Skup aut</footer>
    </main>
  )
}
