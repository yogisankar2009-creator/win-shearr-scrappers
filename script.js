import{createClient}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./config.js";
const db=createClient(window.WS_CONFIG.supabaseUrl,window.WS_CONFIG.supabaseKey);
const nav=document.getElementById("nav"),progress=document.getElementById("progress");
addEventListener("scroll",()=>{nav.classList.toggle("scrolled",scrollY>30);progress.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+"%"});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector(".menu")?.classList.remove("open")));
const form=document.getElementById("quoteForm"),msg=document.getElementById("formMessage");
form?.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="Submitting your enquiry...";const d=new FormData(form);
const record={customer_name:d.get("customer_name"),phone:d.get("phone"),vehicle_type:d.get("vehicle_type"),brand:d.get("brand")||"",model:d.get("model")||"",year:d.get("year")?Number(d.get("year")):null,registration_number:"",location:d.get("location"),condition:d.get("condition")||"",details:d.get("details")||"",status:"new"};
const r=await db.from("vehicle_enquiries").insert(record).select("id").single();if(r.error){console.error(r.error);msg.textContent="Could not submit. Please call 93440 58526.";return}
for(const f of Array.from(d.getAll("photos")).filter(x=>x instanceof File&&x.size)){const path=`${r.data.id}/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;const up=await db.storage.from("vehicle-photos").upload(path,f);if(!up.error){const ins=await db.from("vehicle_enquiry_photos").insert({enquiry_id:r.data.id,file_path:path});if(ins.error)console.warn(ins.error)}}msg.textContent="Enquiry received ✓ We will contact you soon.";form.reset()});
