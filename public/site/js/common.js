// Shared helpers, navbar renderer, toast, auth state

function starRow(r){
  const full = Math.floor(r), half = r - full >= 0.5;
  let out = "";
  for(let i=0;i<full;i++) out += "★";
  if(half) out += "☆";
  while(out.length<5) out += "·";
  return `<span class="rating" title="${r}">${out} <span class="text-muted-2">${r.toFixed(1)}</span></span>`;
}

function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
}

function skeletonCard(){
  return `<div class="card-lib book-card"><div class="cover skeleton"></div><div class="body"><div class="skeleton" style="height:14px;width:80%;margin-bottom:8px"></div><div class="skeleton" style="height:12px;width:50%"></div></div></div>`;
}

function skeletonGrid(n=8){
  return Array.from({length:n}).map(()=>`<div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">${skeletonCard()}</div>`).join("");
}

function emptyState(msg, icon="📚"){
  return `<div class="empty"><div class="icon">${icon}</div><div>${msg}</div></div>`;
}

function toast(msg, variant="accent"){
  const el = document.createElement("div");
  el.className = "position-fixed top-0 end-0 m-4 shadow";
  el.style.zIndex = 2000;
  el.innerHTML = `<div class="alert mb-0 d-flex align-items-center gap-2" style="background:${variant==='accent'?'#0f766e':'#1e7a3a'};color:#fff;border:none;border-radius:12px;padding:.9rem 1.25rem;min-width:240px">
      <span>✓</span><span>${msg}</span>
    </div>`;
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.transition="opacity .3s"; el.style.opacity="0"; },2400);
  setTimeout(()=>el.remove(),2800);
}

function bookCard(b){
  return `<div class="card-lib book-card h-100">
    <div class="cover">
      <img src="${b.mainImageUrl}" alt="${b.title}" loading="lazy"/>
      <button class="fav" aria-label="favorite" onclick="event.preventDefault();event.stopPropagation();this.classList.toggle('active')">♥</button>
    </div>
    <a href="/site/book.html?id=${b.id}" class="body" style="color:inherit">
      <div class="title">${b.title}</div>
      <div class="author">${b.authorName}</div>
      <div class="meta">
        ${starRow(b.rating)}
        <span class="avail ${b.inStock?'ok':'no'}">${b.inStock?'Available':'Borrowed'}</span>
      </div>
    </a>
  </div>`;
}

async function renderNavbar(activeKey){
  const user = window.api.currentUser();
  const counts = await window.api.unreadCounts();
  const mount = document.getElementById("navbar-mount");
  if(!mount) return;

  const link = (href,label,key) => `<a class="nav-link ${activeKey===key?'active':''}" href="${href}">${label}</a>`;

  const userSlot = user
    ? `<a class="icon-btn" href="/site/chat.html" title="Chat" aria-label="Chat">
         💬 ${counts.chat?`<span class="badge-dot">${counts.chat}</span>`:""}
       </a>
       <a class="avatar-btn text-decoration-none" href="/site/dashboard.html" title="${user.fullName}">${user.fullName.slice(0,1).toUpperCase()}</a>`
    : `<a href="/site/login.html" class="btn btn-ghost btn-sm">Log in</a>
       <a href="/site/register.html" class="btn btn-accent btn-sm ms-2">Register</a>`;

  mount.innerHTML = `
  <nav class="navbar navbar-lib navbar-expand-lg sticky-top">
    <div class="container">
      <a class="brand navbar-brand" href="/site/index.html">Lumen<span class="dot">.</span>Library</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navOffcanvas" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="navOffcanvas">
        <div class="offcanvas-header">
          <span class="brand">Lumen<span class="dot">.</span>Library</span>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li class="nav-item">${link("/site/index.html","Main","main")}</li>
            <li class="nav-item">${link("/site/books.html","Books","books")}</li>
            <li class="nav-item">${link("/site/gallery.html","Gallery","gallery")}</li>
            <li class="nav-item">${link("/site/rooms.html","Rooms","rooms")}</li>
            <li class="nav-item ms-lg-2">
              <a class="icon-btn" href="/site/announcements.html" title="Announcements" aria-label="Announcements">
                🔔 ${counts.announcements?`<span class="badge-dot">${counts.announcements}</span>`:""}
              </a>
            </li>
            <li class="nav-item d-flex align-items-center gap-2 ms-lg-2 mt-3 mt-lg-0">
              ${userSlot}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>`;
}

function renderFooter(){
  const m = document.getElementById("footer-mount");
  if(!m) return;
  m.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="brand" style="color:#fff;font-size:1.35rem">Lumen<span style="color:#5eead4">.</span>Library</div>
          <p class="mt-3" style="max-width:340px;color:#8fa2a5">A network of neighborhood libraries. Free to join, quiet to read in, generous with books.</p>
        </div>
        <div class="col-6 col-md-2"><h6>Explore</h6>
          <div><a href="/site/books.html">Books</a></div>
          <div><a href="/site/rooms.html">Study Rooms</a></div>
          <div><a href="/site/gallery.html">Gallery</a></div>
          <div><a href="/site/announcements.html">Announcements</a></div>
        </div>
        <div class="col-6 col-md-2"><h6>Account</h6>
          <div><a href="/site/login.html">Log in</a></div>
          <div><a href="/site/register.html">Register</a></div>
        </div>
        <div class="col-md-4"><h6>Visit</h6>
          <div style="color:#8fa2a5">Four branches, seven days a week. Find your nearest on the main page.</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="d-flex flex-wrap justify-content-between small" style="color:#7f9295">
        <div>© ${new Date().getFullYear()} Lumen Library System</div>
        <div>Made with quiet joy.</div>
      </div>
    </div>
  </footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const active = document.body.dataset.nav || "";
  renderNavbar(active);
  renderFooter();
});
