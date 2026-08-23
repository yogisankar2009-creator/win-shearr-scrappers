import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import "./config.js";

const supabase = createClient(window.WS_SUPABASE_URL, window.WS_SUPABASE_PUBLISHABLE_KEY);
const WA = "919344058526";

function escapeHtml(s=""){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

async function loadParts(){
  const grid = document.getElementById("partsGrid");
  const noResults = document.getElementById("noResults");
  if(!grid) return;

  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .eq("status","available")
    .order("created_at",{ascending:false});

  if(error){
    grid.innerHTML = `<p style="color:#888">Inventory is being connected. Please try again shortly.</p>`;
    console.error(error);
    return;
  }

  window.WS_PARTS = data || [];
  renderParts();
}

function renderParts(){
  const grid = document.getElementById("partsGrid");
  if(!grid) return;

  const query = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const brand = document.getElementById("brandFilter")?.value || "all";

  const parts = (window.WS_PARTS || []).filter(p=>{
    const hay = `${p.brand} ${p.model} ${p.year} ${p.category} ${p.name} ${p.part_number || ""}`.toLowerCase();
    return (!query || hay.includes(query)) && (brand === "all" || p.brand === brand);
  });

  grid.innerHTML = parts.map((p,i)=>{
    const fallback = [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80"
    ][i%2];
    const img = p.image_url || fallback;
    const msg = encodeURIComponent(`Hi Win Shearr Scrappers, I am interested in the ${p.name} for ${p.brand} ${p.model} ${p.year}. Is it available?`);
    return `<article class="part-card">
      <div class="part-image" style="background-image:url('${img}')"><span>${escapeHtml(p.brand.toUpperCase())}</span></div>
      <div class="part-info">
        <div class="part-meta"><span>${escapeHtml(p.brand.toUpperCase())}</span><span>${escapeHtml((p.condition||"USED").toUpperCase())}</span></div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.model)} • ${escapeHtml(p.year)} • ${escapeHtml(p.category)}</p>
        <div class="part-bottom"><strong>${escapeHtml(p.price || "Ask price")}</strong><a target="_blank" href="https://wa.me/${WA}?text=${msg}">Enquire →</a></div>
      </div>
    </article>`;
  }).join("");

  if(noResults) noResults.style.display = parts.length ? "none" : "block";
}

document.addEventListener("DOMContentLoaded",()=>{
  loadParts();
  document.getElementById("searchInput")?.addEventListener("input",renderParts);
  document.getElementById("brandFilter")?.addEventListener("change",renderParts);
  document.querySelectorAll("[data-brand-link]").forEach(link=>{
    link.addEventListener("click",()=>{
      const select=document.getElementById("brandFilter");
      if(select){select.value=link.dataset.brandLink;renderParts();}
    });
  });
});
