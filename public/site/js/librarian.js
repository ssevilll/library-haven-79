// Librarian panel — scoped to current librarian's library
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const state = {
  sort:{}, search:{},
  me:null, libraryId:null, libraryName:"",
  libraries:[],
};

// ---- shared helpers (mirror admin.js style) ----
function pill(t, k="muted"){ return `<span class="pill pill-${k}">${t}</span>`; }
function statusPill(s){
  const m={Pending:"warn",Confirmed:"ok",Approved:"ok",Cancelled:"danger",Returned:"info",Overdue:"danger",Paid:"ok","Pending Approval":"warn"};
  return pill(s, m[s]||"muted");
}
function fmtMoney(n){ return `$${(n||0).toFixed(2)}`; }
function tableShell(cols, rows, opts={}){
  const {pane, actions=true} = opts;
  const head = cols.map(c=>`<th data-key="${c.key}">${c.label} <span class="text-muted-2">⇅</span></th>`).join("");
  const body = rows.length
    ? rows.map(r=>`<tr>${cols.map(c=>`<td>${c.render?c.render(r):r[c.key]??''}</td>`).join("")}${actions?`<td class="row-actions">${r.__actions||''}</td>`:''}</tr>`).join("")
    : `<tr><td colspan="${cols.length+(actions?1:0)}" class="text-center text-muted-2 py-4">No records found.</td></tr>`;
  return `<div class="table-responsive"><table class="table admin-table align-middle">
    <thead><tr>${head}${actions?'<th class="text-end">Actions</th>':''}</tr></thead>
    <tbody data-pane="${pane||''}">${body}</tbody></table></div>`;
}
function sortRows(rows, pane, defKey){
  const s = state.sort[pane] || {key:defKey,dir:1};
  return [...rows].sort((a,b)=>{
    const av=a[s.key], bv=b[s.key];
    if(av==null) return 1; if(bv==null) return -1;
    if(typeof av==="number") return (av-bv)*s.dir;
    return String(av).localeCompare(String(bv))*s.dir;
  });
}
function filterRows(rows, pane, fields){
  const q=(state.search[pane]||"").trim().toLowerCase(); if(!q) return rows;
  return rows.filter(r=>fields.some(f=>String(r[f]??"").toLowerCase().includes(q)));
}
function wireSort(pane, defKey){
  $$(`table.admin-table thead th[data-key]`).forEach(th=>{
    th.addEventListener("click", ()=>{
      const k = th.dataset.key; if(!k) return;
      const cur = state.sort[pane] || {key:defKey,dir:1};
      state.sort[pane] = {key:k, dir: cur.key===k ? -cur.dir : 1};
      renderPane(pane);
    });
  });
}
function toolbar(pane, extra=""){
  return `<div class="admin-toolbar">
    <input class="form-control form-control-sm" placeholder="Search…" value="${state.search[pane]||''}" id="tb-search-${pane}"/>
    ${extra}
  </div>`;
}
function wireToolbar(pane){
  const s=$(`#tb-search-${pane}`); if(s) s.addEventListener("input", e=>{ state.search[pane]=e.target.value; renderPane(pane); });
}
function paneHeader(title, sub, right=""){
  return `<div class="admin-header"><div><h1>${title}</h1><div class="sub">${sub}</div></div><div>${right}</div></div>`;
}
function field(label, input){ return `<div class="mb-3"><label class="form-label small fw-semibold">${label}</label>${input}</div>`; }
function openForm(title, body, onSave){
  $("#formModalTitle").textContent = title;
  $("#formModalBody").innerHTML = body;
  const m = bootstrap.Modal.getOrCreateInstance("#formModal");
  const btn = $("#formModalSave");
  const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", async()=>{ if(await onSave()!==false) m.hide(); });
  m.show();
}
function openConfirm(msg, onYes){
  $("#confirmMsg").textContent = msg;
  const m = bootstrap.Modal.getOrCreateInstance("#confirmModal");
  const btn = $("#confirmYes");
  const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", async()=>{ await onYes(); m.hide(); });
  m.show();
}
function formToObj(){
  const o={}; $$("#formModalBody [name]").forEach(i=>{
    if(i.type==="checkbox") o[i.name]=i.checked;
    else if(i.type==="number") o[i.name]=Number(i.value)||0;
    else o[i.name]=i.value;
  }); return o;
}

// ---- OVERVIEW (analytics) ----
async function paneOverview(){
  const s = await window.api.getLibrarianStats(state.libraryId);
  const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];
  const max = Math.max(...s.monthly,1);
  const bars = s.monthly.map(v=>`<div class="bar" style="height:${(v/max)*100}%"><span>${v}</span></div>`).join("");
  const lbls = months.map(m=>`<div>${m}</div>`).join("");

  const genreMax = Math.max(...s.byGenre.map(g=>g.count),1);
  const genreBars = s.byGenre.length
    ? s.byGenre.slice(0,8).map(g=>`
        <div class="genre-bar"><div class="nm">${g.name}</div>
          <div class="track"><div class="fill" style="width:${(g.count/genreMax)*100}%"></div></div>
          <div class="n">${g.count}</div></div>`).join("")
    : `<div class="text-muted-2 small">No borrowing data yet.</div>`;

  const sb = s.statusBreakdown;
  const sbTotal = Math.max(sb.Pending+sb.Approved+sb.Returned+sb.Overdue,1);
  const sbBar = (label, val, cls)=>`
    <div class="d-flex align-items-center gap-3 mb-2">
      <div style="width:90px" class="small">${label}</div>
      <div class="flex-fill" style="height:14px;background:#efece4;border-radius:6px;overflow:hidden">
        <div style="height:100%;width:${(val/sbTotal)*100}%;background:${cls}"></div>
      </div>
      <div class="small text-muted-2" style="width:30px;text-align:right">${val}</div>
    </div>`;

  return paneHeader(`${state.libraryName} — Overview`, "Analytics for your branch")
    + `<div class="row g-3 mb-4">
        ${[
          ["Books in branch", s.totalBooks],
          ["Members", s.totalMembers],
          ["Pending borrows", s.pendingBorrows, "Needs review"],
          ["Overdue", s.overdueBorrows, "Follow up"],
          ["Pending reservations", s.pendingReservations],
          ["Total reservations", s.totalReservations],
          ["Borrows on record", s.totalBorrows],
          ["Fines outstanding", fmtMoney(s.finesCollected)],
        ].map(([l,v,d])=>`<div class="col-6 col-md-4 col-xl-3"><div class="stat-tile"><div class="label">${l}</div><div class="value">${v}</div>${d?`<div class="delta">${d}</div>`:''}</div></div>`).join("")}
      </div>
      <div class="row g-3">
        <div class="col-lg-7"><div class="admin-card"><div class="head"><h5>Monthly reservations</h5><span class="text-muted-2 small">Last 12 months</span></div>
          <div class="p-4"><div class="mini-bar">${bars}</div><div class="mini-bar-labels">${lbls}</div></div></div></div>
        <div class="col-lg-5"><div class="admin-card"><div class="head"><h5>Borrowings by status</h5></div>
          <div class="p-4">
            ${sbBar("Pending", sb.Pending, "var(--warn)")}
            ${sbBar("Approved", sb.Approved, "var(--accent)")}
            ${sbBar("Returned", sb.Returned, "#0c5060")}
            ${sbBar("Overdue", sb.Overdue, "var(--danger)")}
          </div></div></div>
        <div class="col-12"><div class="admin-card"><div class="head"><h5>Top genres borrowed</h5></div>
          <div class="p-4">${genreBars}</div></div></div>
      </div>`;
}

// ---- BOOKS (read-only) ----
async function paneBooks(){
  const rows = await window.api.getLibrarianBooks(state.libraryId);
  const filtered = filterRows(rows,"books",["title","authorName","language"]);
  const sorted = sortRows(filtered,"books","title");
  sorted.forEach(r=> r.__actions = `<a class="btn btn-outline-accent btn-sm" href="/site/book.html?id=${r.id}" target="_blank">View</a>`);
  const cols = [
    {key:"title",label:"Title",render:r=>`<div class="d-flex align-items-center gap-2"><img src="${r.mainImageUrl}" width="34" height="46" style="object-fit:cover;border-radius:4px"/><div><div class="fw-semibold">${r.title}</div><div class="small text-muted-2">${r.language}</div></div></div>`},
    {key:"authorName",label:"Author"},
    {key:"pageCount",label:"Pages"},
    {key:"rating",label:"Rating"},
    {key:"inStock",label:"Stock",render:r=>r.inStock?pill("In stock","ok"):pill("Out","danger")},
  ];
  const html = paneHeader("Books","Read-only catalog for your branch", toolbar("books"))
    + `<div class="admin-card">${tableShell(cols,sorted,{pane:"books"})}</div>`;
  setTimeout(()=>{ wireToolbar("books"); wireSort("books","title"); },0);
  return html;
}

// ---- MEMBERS (read-only) ----
async function paneMembers(){
  const rows = await window.api.getLibrarianMembers(state.libraryId);
  const filtered = filterRows(rows,"members",["fullName","email"]);
  const sorted = sortRows(filtered,"members","fullName");
  sorted.forEach(r=> r.__actions = `<span class="text-muted-2 small">Read only</span>`);
  const cols = [
    {key:"fullName",label:"Name"},
    {key:"email",label:"Email"},
    {key:"phoneNumber",label:"Phone"},
    {key:"loan",label:"Loans"},
    {key:"balance",label:"Balance",render:r=>fmtMoney(r.balance)},
    {key:"isSubscribed",label:"Newsletter",render:r=>r.isSubscribed?pill("Yes","ok"):pill("No","muted")},
  ];
  const html = paneHeader("Members","Members registered at your branch", toolbar("members"))
    + `<div class="admin-card">${tableShell(cols,sorted,{pane:"members"})}</div>`;
  setTimeout(()=>{ wireToolbar("members"); wireSort("members","fullName"); },0);
  return html;
}

// ---- ROOMS (read-only) ----
async function paneRooms(){
  const rows = await window.api.getLibrarianRooms(state.libraryId);
  const filtered = filterRows(rows,"rooms",["name"]);
  const sorted = sortRows(filtered,"rooms","name");
  sorted.forEach(r=> r.__actions = `<span class="text-muted-2 small">Read only</span>`);
  const cols = [
    {key:"name",label:"Room"},
    {key:"capacity",label:"Capacity"},
    {key:"amenities",label:"Amenities",render:r=>(r.amenities||[]).map(a=>pill(a,"info")).join(" ")},
    {key:"isAvailable",label:"Available",render:r=>r.isAvailable?pill("Yes","ok"):pill("No","muted")},
  ];
  const html = paneHeader("Rooms","Bookable rooms at your branch", toolbar("rooms"))
    + `<div class="admin-card">${tableShell(cols,sorted,{pane:"rooms"})}</div>`;
  setTimeout(()=>{ wireToolbar("rooms"); wireSort("rooms","name"); },0);
  return html;
}

// ---- BORROWINGS (status updates via modal) ----
async function paneBorrowings(){
  const rows = await window.api.getLibrarianBorrowings(state.libraryId);
  const filtered = filterRows(rows,"borrowings",["bookTitle","userName","status"]);
  const sorted = sortRows(filtered,"borrowings","borrowedDate");
  sorted.forEach(r=> r.__actions = `<button class="btn btn-outline-accent btn-sm" data-edit-bor="${r.id}">Edit</button>`);
  const cols = [
    {key:"bookTitle",label:"Book"},
    {key:"userName",label:"Member"},
    {key:"borrowedDate",label:"Borrowed"},
    {key:"dueDate",label:"Due"},
    {key:"returnedDate",label:"Returned",render:r=>r.returnedDate||"—"},
    {key:"fineAmount",label:"Fine",render:r=>r.fineAmount?fmtMoney(r.fineAmount):"—"},
    {key:"status",label:"Status",render:r=>statusPill(r.status)},
  ];
  const html = paneHeader("Borrowings","Approve pending, mark returned, track overdue", toolbar("borrowings"))
    + `<div class="admin-card">${tableShell(cols,sorted,{pane:"borrowings"})}</div>`;
  setTimeout(()=>{
    wireToolbar("borrowings"); wireSort("borrowings","borrowedDate");
    $$("[data-edit-bor]").forEach(b=>b.addEventListener("click",()=>{
      const r = rows.find(x=>x.id===b.dataset.editBor);
      openStatusEditor(`Borrowing — ${r.bookTitle}`, r.status, ["Pending","Approved","Returned","Overdue"], async(v)=>{
        await window.api.setBorrowingStatus(r.id, v); toast("Status updated"); renderPane("borrowings");
      });
    }));
  },0);
  return html;
}
function openStatusEditor(title, current, options, onSave){
  const body = field("Status",`<select class="form-select" name="status">${options.map(o=>`<option ${o===current?'selected':''}>${o}</option>`).join("")}</select>`);
  openForm(title, body, async()=>{ const o=formToObj(); await onSave(o.status); });
}

// ---- RESERVATIONS (status updates, no status column) ----
async function paneReservations(){
  const rows = await window.api.getLibrarianReservations(state.libraryId);
  const filtered = filterRows(rows,"reservations",["roomName","userName","status"]);
  const sorted = sortRows(filtered,"reservations","reservationDate");
  const statusSel = r=>`<select class="form-select form-select-sm" data-set-status="${r.id}" style="min-width:130px">${["Pending","Confirmed","Cancelled"].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join("")}</select>`;
  sorted.forEach(r=> r.__actions = statusSel(r));
  const cols = [
    {key:"roomName",label:"Room"},
    {key:"userName",label:"Member"},
    {key:"reservationDate",label:"Date"},
    {key:"startTime",label:"Start"},
    {key:"endTime",label:"End"},
  ];
  const html = paneHeader("Room Reservations","Approve or cancel bookings at your branch", toolbar("reservations"))
    + `<div class="admin-card">${tableShell(cols,sorted,{pane:"reservations"})}</div>`;
  setTimeout(()=>{
    wireToolbar("reservations"); wireSort("reservations","reservationDate");
    $$("[data-set-status]").forEach(s=>s.addEventListener("change", async e=>{
      await window.api.setRoomReservationStatus(s.dataset.setStatus, e.target.value);
      toast("Status updated"); renderPane("reservations");
    }));
  },0);
  return html;
}

// ---- SALARY (checkout) ----
async function paneSalary(){
  const info = await window.api.getMySalaryInfo(state.me.id);
  const l = info.librarian;
  const canCheckout = l.salaryStatus === "Approved";
  const statusDelta = l.salaryStatus === "Paid" ? "You're all paid up."
                    : l.salaryStatus === "Approved" ? "Ready to check out."
                    : "Awaiting SuperAdmin approval.";
  const btn = canCheckout
    ? `<button class="btn btn-accent" id="btnCheckout">Checkout Salary</button>`
    : `<button class="btn btn-accent" disabled>Checkout Salary</button>`;

  const rows = info.history.length
    ? info.history.map(p=>`<tr>
        <td>${p.date}</td>
        <td>${fmtMoney(p.amount)}</td>
        <td>${p.method}</td>
        <td>${statusPill(p.status)}</td></tr>`).join("")
    : `<tr><td colspan="4" class="text-center text-muted-2 py-4">No salary payments yet.</td></tr>`;

  const html = paneHeader("My Salary","View your payout history and check out approved pay")
    + `<div class="balance-hero mb-4">
        <div>
          <div class="lbl">Current salary</div>
          <div class="amt">${fmtMoney(l.salary)}</div>
          <div class="small mt-2">${statusPill(l.salaryStatus)} <span class="ms-2 opacity-75">${statusDelta}</span></div>
        </div>
        <div>${btn}</div>
      </div>
      <div class="admin-card"><div class="head"><h5>Payout history</h5></div>
        <div class="table-responsive"><table class="table admin-table align-middle mb-0">
          <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
      </div>`;
  setTimeout(()=>{
    $("#btnCheckout")?.addEventListener("click", ()=>{
      const body = field("Amount",`<input class="form-control" value="${fmtMoney(l.salary)}" disabled/>`)
        + field("Cardholder name",`<input class="form-control" name="cardName" placeholder="Name on card" value="${l.name}"/>`)
        + field("Card number",`<input class="form-control" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19"/>`)
        + `<div class="row"><div class="col-6">${field("Expiry",`<input class="form-control" name="cardExp" placeholder="MM/YY" maxlength="5"/>`)}</div>
           <div class="col-6">${field("CVV",`<input class="form-control" name="cardCvv" placeholder="123" maxlength="4"/>`)}</div></div>`;
      openForm("Checkout salary — enter card details", body, async()=>{
        const o = formToObj();
        if(!o.cardNumber || !o.cardExp || !o.cardCvv){ toast("Please fill in card details"); return false; }
        const last4 = o.cardNumber.replace(/\D/g,"").slice(-4) || "0000";
        const res = await window.api.checkoutSalary(state.me.id, { method:`Visa ****${last4}` });
        if(res.ok){ toast(`Paid ${fmtMoney(res.payment.amount)} to your card`); renderPane("salary"); }
      });
    });
  },0);
  return html;
}

// ---- Router ----
const PANES = {
  overview: paneOverview,
  books: paneBooks,
  members: paneMembers,
  rooms: paneRooms,
  borrowings: paneBorrowings,
  reservations: paneReservations,
  salary: paneSalary,
};

async function renderPane(name){
  if(!PANES[name]) name = "overview";
  $$(".admin-sidebar .side-link").forEach(a=>a.classList.toggle("active", a.dataset.pane===name));
  $("#paneMount").innerHTML = `<div class="admin-header"><div><h1>Loading…</h1><div class="sub">Fetching data</div></div></div>
    <div class="admin-card p-4">
      <div class="skeleton" style="height:20px;width:40%;margin-bottom:10px"></div>
      <div class="skeleton" style="height:14px;width:70%;margin-bottom:8px"></div>
      <div class="skeleton" style="height:14px;width:55%"></div></div>`;
  try {
    const html = await PANES[name]();
    $("#paneMount").innerHTML = html;
  } catch(err){
    console.error(err);
    $("#paneMount").innerHTML = `<div class="admin-card p-4 text-danger">Something went wrong. ${err.message||err}</div>`;
  }
  history.replaceState(null,"",`#${name}`);
  if(window.innerWidth < 992) $("#sidebar").classList.remove("open");
}
function currentPane(){ return (location.hash||"#overview").slice(1); }

document.addEventListener("DOMContentLoaded", async ()=>{
  state.me = window.api.currentLibrarian();
  state.libraryId = state.me.libraryId;
  state.libraries = await window.api.getLibraries();
  state.libraryName = state.libraries.find(l=>l.id===state.libraryId)?.name || "My Branch";
  $("#branchLabel").innerHTML = `<span class="d-block fw-semibold" style="color:#fff">${state.me.name}</span>${state.libraryName}`;

  $$(".admin-sidebar .side-link[data-pane]").forEach(a=>a.addEventListener("click", e=>{
    e.preventDefault(); renderPane(a.dataset.pane);
  }));
  $("#sideToggle")?.addEventListener("click", ()=>{ $("#sidebar").classList.toggle("open"); $("#scrim").classList.toggle("show"); });
  $("#scrim")?.addEventListener("click", ()=>{ $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); });
  $("#logoutBtn")?.addEventListener("click", async e=>{
    e.preventDefault();
    localStorage.removeItem("lumen_librarian");
    await window.api.logout();
    location.href = "/site/index.html";
  });
  window.addEventListener("hashchange", ()=>renderPane(currentPane()));
  renderPane(currentPane());
});
