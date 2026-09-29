
let memory = [];
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method==='GET') return res.status(200).json(memory);
  if(req.method==='POST'){
    try{
      let b=req.body; if(typeof b==='string') b=JSON.parse(b);
      const list=b.ads||b;
      if(Array.isArray(list)) memory=list;
    }catch(e){}
    return res.status(200).json({ok:true,count:memory.length});
  }
  return res.status(405).end();
}
