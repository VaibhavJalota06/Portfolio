// Basic UI interactions + small particle background & reveal animation
const root = document.documentElement
const themeToggle = document.getElementById('themeToggle')
let light = false
themeToggle?.addEventListener('click', ()=>{
  light = !light
  if(light){ root.classList.add('light'); themeToggle.textContent = 'Light' }
  else{ root.classList.remove('light'); themeToggle.textContent = 'Dark' }
})

// Modal gallery behavior
const modal = document.getElementById('modal')
const modalImg = document.getElementById('modalImg')
const modalClose = document.getElementById('modalClose')
const thumbs = Array.from(document.querySelectorAll('.thumb'))
thumbs.forEach((t, i)=>{
  // stagger delay via inline style for CSS transition
  t.style.transitionDelay = `${i * 70}ms`
  t.addEventListener('click', ()=>{
    const src = t.dataset.src || t.querySelector('img')?.src
    modalImg.src = src
    modal.setAttribute('aria-hidden','false')
  })
})
modalClose?.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); modalImg.src = '' })
modal.addEventListener('click', (e)=>{ if(e.target===modal) { modal.setAttribute('aria-hidden','true'); modalImg.src = '' } })

// Copy Discord tag
const copyBtn = document.getElementById('copyDiscord')
copyBtn?.addEventListener('click', async ()=>{
  const el = document.getElementById('discordTag')
  const tag = el?.textContent?.replace(/Copy|Copied/,'').trim() ?? ''
  try{ await navigator.clipboard.writeText(tag); copyBtn.textContent = 'Copied' ; setTimeout(()=>copyBtn.textContent='Copy',1200)}catch(e){alert('Copy failed')}
})

// Stagger reveal on load
function revealThumbs(){
  thumbs.forEach((t, i)=>{
    setTimeout(()=> t.classList.add('revealed'), i * 80)
  })
}
document.addEventListener('DOMContentLoaded', ()=>{
  revealThumbs()
  initParticles()
})

/* Small particle background (canvas) */
function initParticles(){
  const canvas = document.createElement('canvas')
  canvas.className = 'bg-canvas'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  let w = canvas.width = innerWidth
  let h = canvas.height = innerHeight
  const particles = []
  const count = Math.max(12, Math.floor((w*h)/90000))

  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight })

  function rand(min, max){ return Math.random()*(max-min)+min }
  for(let i=0;i<count;i++){
    particles.push({x:rand(0,w), y:rand(0,h), r:rand(0.6,2.6), vx:rand(-0.2,0.2), vy:rand(-0.1,0.1), hue:rand(170,260)})
  }

  function draw(){
    ctx.clearRect(0,0,w,h)
    for(const p of particles){
      p.x += p.vx
      p.y += p.vy
      if(p.x < -10) p.x = w + 10
      if(p.x > w + 10) p.x = -10
      if(p.y < -10) p.y = h + 10
      if(p.y > h + 10) p.y = -10
      ctx.beginPath()
      const g = ctx.createRadialGradient(p.x,p.y,p.r*0.1,p.x,p.y,p.r*6)
      g.addColorStop(0, `hsla(${p.hue},80%,60%,0.12)`)
      g.addColorStop(1, `hsla(${p.hue},80%,60%,0)`)
      ctx.fillStyle = g
      ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2)
      ctx.fill()
    }
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}

  // Live countdown
  function getNextStreamFromElement(){
    const el = document.getElementById('liveCountdown')
    if(!el) return null
    const ds = el.dataset.next // expect ISO string if provided
    if(ds){
      const d = new Date(ds)
      if(!isNaN(d)) return d
    }
    // default: next occurrence at 19:00 local time (7 PM)
    const now = new Date()
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0, 0)
    if(candidate > now) return candidate
    // tomorrow 19:00
    return new Date(candidate.getTime() + 1*60*60*1000)
  }

  function startLiveCountdown(){
    const label = document.getElementById('liveLabel')
    const display = document.getElementById('liveCountdown')
    const dot = document.querySelector('.live-dot')
    if(!display || !label) return
    let next = getNextStreamFromElement()

    function update(){
      const now = new Date()
      const diff = next - now
      if(diff <= 0){
        label.textContent = 'LIVE NOW'
        display.textContent = ''
        dot.classList.add('live')
        // when live, keep checking and schedule next default after 2 hours
        next = new Date(now.getTime() + 2*60*60*1000)
        return
      }
      const days = Math.floor(diff / (24*60*60*1000))
      const hrs = Math.floor((diff % (24*60*60*1000)) / (60*60*1000))
      const mins = Math.floor((diff % (60*60*1000)) / (60*1000))
      const secs = Math.floor((diff % (60*1000)) / 1000)
      const parts = []
      if(days>0) parts.push(days + 'd')
      parts.push(String(hrs).padStart(2,'0'))
      parts.push(String(mins).padStart(2,'0'))
      parts.push(String(secs).padStart(2,'0'))
      display.textContent = parts.join(':')
      dot.classList.remove('live')
    }

    update()
    setInterval(update, 1000)
  }

  // start countdown after DOM ready
  document.addEventListener('DOMContentLoaded', ()=>{
    startLiveCountdown()
  })
