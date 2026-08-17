const audio=document.getElementById("ambience"), btn=document.getElementById("soundBtn"), glow=document.querySelector(".cursor-glow");
let soundOn=false;
btn.addEventListener("click",async()=>{
  if(!audio.querySelector("source")?.getAttribute("src")) return;
  try{
    if(soundOn){audio.pause();soundOn=false;btn.classList.remove("on");btn.innerHTML='<span class="dot"></span> SOUND OFF';}
    else{await audio.play();soundOn=true;btn.classList.add("on");btn.innerHTML='<span class="dot"></span> SOUND ON';}
  }catch(e){btn.innerHTML='<span class="dot"></span> ADD AUDIO';}
});
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
document.querySelectorAll("[data-tilt]").forEach(card=>{
 card.addEventListener("pointermove",e=>{
   if(innerWidth<800)return;
   const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
   card.style.transform=`perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`;
 });
 card.addEventListener("pointerleave",()=>card.style.transform="");
});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("seen")}),{threshold:.1});
document.querySelectorAll(".section,.manifesto,.terminal").forEach(x=>observer.observe(x));
