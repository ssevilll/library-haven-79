// SuperAdmin panel controller — mock API driven
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const state = {
  sort: {}, // per-pane { key, dir }
  search: {},
  libraries: [], authors: [], genres: [], languages: [],
};

// ---------- helpers ----------
function pill(text, kind="muted"){ return `<span class="pill pill-${kind}">${text}</span>`; }
function statusPill(s){
  const map = { Pending:"warn", Confirmed:"ok", Approved:"ok", Cancelled:"danger",
                Returned:"info", Overdue:"danger", Paid:"ok", "Pending Approval":"warn" };
  return pill(s, map[s]||"muted");
}
function fmtMoney(n){ return `$${(n||0).toFixed(2)}`; }
function tableShell(cols, rows, opts={}){
  const {pane, actions=true} = opts;
  const head = cols.map(c => `<th data-key="${c.key}">${c.label}${c.sortable!==false?' <span class="text-muted-2">⇅</span>':''}</th>`).join("");
  const body = rows.length
    ? rows.map(r => `<tr>${cols.map(c=>`<td>${c.render?c.render(r):r[c.key]??''}</td>`).join("")}${actions?`<td class="row-actions">${r.__actions||''}</td>`:''}</tr>`).join("")
    : `<tr><td colspan="${cols.length+(actions?1:0)}" class="text-center text-muted-2 py-4">No records found.</td></tr>`;
  return `<div class="table-responsive"><table class="table admin-table align-middle">
    <thead><tr>${head}${actions?'<th class="text-end">Actions</th>':''}</tr></thead>
    <tbody data-pane="${pane||''}">${body}</tbody></table></div>`;
}
function sortRows(rows, pane, defaultKey){
  const s = state.sort[pane] || { key: defaultKey, dir: 1 };
  const k = s.key, dir = s.dir;
  return [...rows].sort((a,b)=>{
    const av=a[k], bv=b[k];
    if(av==null) return 1; if(bv==null) return -1;
    if(typeof av==="number") return (av-bv)*dir;
    return String(av).localeCompare(String(bv))*dir;
  });
}
function filterRows(rows, pane, fields){
  const q = (state.search[pane]||"").trim().toLowerCase();
  if(!q) return rows;
  return rows.filter(r => fields.some(f => String(r[f]??"").toLowerCase().includes(q)));
}
function wireSort(pane, defaultKey, rerender){
  $$(`table.admin-table thead th[data-key]`).forEach(th=>{
    th.addEventListener("click", ()=>{
      const key = th.dataset.key; if(!key) return;
      const cur = state.sort[pane] || { key:defaultKey, dir:1 };
      state.sort[pane] = { key, dir: cur.key===key ? -cur.dir : 1 };
      rerender();
    });
  });
}
function toolbar(pane, addLabel, onAdd){
  return `<div class="admin-toolbar">
    <input class="form-control form-control-sm" placeholder="Search…" value="${state.search[pane]||''}" id="tb-search-${pane}"/>
    ${addLabel?`<button class="btn btn-accent btn-sm" id="tb-add-${pane}">+ ${addLabel}</button>`:''}
  </div>`;
}
function wireToolbar(pane, rerender, onAdd){
  const s = $(`#tb-search-${pane}`); if(s) s.addEventListener("input", e=>{ state.search[pane]=e.target.value; rerender(); });
  const a = $(`#tb-add-${pane}`); if(a && onAdd) a.addEventListener("click", onAdd);
}
function paneHeader(title, sub, right=""){
  return `<div class="admin-header">
    <div><h1>${title}</h1><div class="sub">${sub}</div></div>
    <div>${right}</div>
  </div>`;
}
function openForm(title, bodyHtml, onSave){
  $("#formModalTitle").textContent = title;
  $("#formModalBody").innerHTML = bodyHtml;
  const m = bootstrap.Modal.getOrCreateInstance("#formModal");
  const btn = $("#formModalSave");
  const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", async ()=>{ if(await onSave()!==false) m.hide(); });
  m.show();
}
function openConfirm(msg, onYes){
  $("#confirmMsg").textContent = msg;
  const m = bootstrap.Modal.getOrCreateInstance("#confirmModal");
  const btn = $("#confirmYes");
  const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", async ()=>{ await onYes(); m.hide(); });
  m.show();
}
function field(label, input){ return `<div class="mb-3"><label class="form-label small fw-semibold">${label}</label>${input}</div>`; }
function libSelect(name, val=""){
  return `<select class="form-select" name="${name}">${state.libraries.map(l=>`<option value="${l.id}" ${l.id===val?'selected':''}>${l.name}</option>`).join("")}</select>`;
}

// ---------- OVERVIEW ----------
async function paneOverview(){
  const [s] = await Promise.all([window.api.getAdminStats()]);
  const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];
  const max = Math.max(...s.monthly);
  const bars = s.monthly.map((v,i)=>`<div class="bar" style="height:${(v/max)*100}%"><span>${v}</span></div>`).join("");
  const lbls = months.map(m=>`<div>${m}</div>`).join("");
  return paneHeader("Overview", "Platform-wide activity and health")
    + `<div class="row g-3 mb-4">
        ${[
          ["Books reserved", s.totalReservations, "+12 this week"],
          ["Most reserved genre", s.mostReservedGenre, "Trending"],
          ["Payments collected", fmtMoney(s.totalPayments), "+$820 this month"],
          ["Active libraries", s.activeLibraries, "All operational"],
          ["Active members", s.activeMembers, "+18 new"],
          ["Books in catalog", s.totalBooks, "24 new arrivals"],
          ["Pending borrows", s.pendingBorrows, "Needs review"],
          ["Overdue", s.overdueBorrows, "Follow up"],
        ].map(([l,v,d])=>`<div class="col-6 col-md-4 col-xl-3"><div class="stat-tile"><div class="label">${l}</div><div class="value">${v}</div><div class="delta">${d}</div></div></div>`).join("")}
      </div>
      <div class="admin-card"><div class="head"><h5>Monthly reservations</h5><span class="text-muted-2 small">Last 12 months</span></div>
        <div class="p-4"><div class="mini-bar">${bars}</div><div class="mini-bar-labels">${lbls}</div></div>
      </div>`;
}

// ---------- LIBRARIES ----------
async function paneLibraries(){
  const rows = await window.api.getLibraries();
  const filtered = filterRows(rows, "libraries", ["name","location","email"]);
  const sorted = sortRows(filtered, "libraries", "name");
  sorted.forEach(r => r.__actions = `
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [
    {key:"name", label:"Name"},
    {key:"location", label:"Location"},
    {key:"phoneNumber", label:"Phone"},
    {key:"email", label:"Email"},
  ];
  const html = paneHeader("Libraries", "Manage all branches", toolbar("libraries","Add Library"))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"libraries"})}</div>`;

  const rerender = ()=>mount(html.replace(/./,"")).then(()=>renderPane("libraries"));
  setTimeout(()=>{
    wireToolbar("libraries", ()=>renderPane("libraries"), ()=>editLibrary(null));
    wireSort("libraries", "name", ()=>renderPane("libraries"));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editLibrary(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r = rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete library "${r.name}"?`, async()=>{ await window.api.deleteLibrary(r.id); toast("Library deleted"); renderPane("libraries"); });
    }));
  },0);
  return html;
}
function editLibrary(rec){
  const r = rec || { id:"", name:"", location:"", phoneNumber:"", email:"" };
  const body = field("Name",`<input class="form-control" name="name" value="${r.name}"/>`)
    + field("Location",`<input class="form-control" name="location" value="${r.location}"/>`)
    + field("Phone",`<input class="form-control" name="phoneNumber" value="${r.phoneNumber}"/>`)
    + field("Email",`<input class="form-control" name="email" value="${r.email}"/>`);
  openForm(rec?"Edit Library":"Add Library", body, async()=>{
    const data = Object.fromEntries(new FormData($("#formModalBody").closest(".modal-content").querySelector("form")||formToObj()));
    const obj = formToObj();
    await window.api.saveLibrary({ id:r.id, ...obj });
    toast(rec?"Library updated":"Library added");
    renderPane("libraries");
  });
}
function formToObj(){
  const inputs = $$("#formModalBody [name]");
  const o = {}; inputs.forEach(i=>{
    if(i.type==="checkbox") o[i.name] = i.checked;
    else if(i.type==="number") o[i.name] = Number(i.value)||0;
    else if(i.multiple){ o[i.name] = Array.from(i.selectedOptions).map(x=>x.value); }
    else o[i.name] = i.value;
  });
  return o;
}

// ---------- LIBRARIANS ----------
async function paneLibrarians(){
  const rows = await window.api.getLibrarians();
  const libs = state.libraries;
  rows.forEach(r => r.libraryName = libs.find(l=>l.id===r.libraryId)?.name || "—");
  const filtered = filterRows(rows, "librarians", ["name","email","libraryName","salaryStatus"]);
  const sorted = sortRows(filtered, "librarians", "name");
  sorted.forEach(r => r.__actions = `
    ${r.salaryStatus==="Pending Approval" ? `<button class="btn btn-accent btn-sm" data-approve="${r.id}">Approve Payout</button>`:""}
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [
    {key:"name", label:"Name"},
    {key:"email", label:"Email"},
    {key:"libraryName", label:"Library"},
    {key:"salary", label:"Salary", render:r=>fmtMoney(r.salary)},
    {key:"salaryStatus", label:"Payout", render:r=>statusPill(r.salaryStatus)},
    {key:"isActive", label:"Status", render:r=> r.isBlocked ? pill("Blocked","danger") : (r.isActive?pill("Active","ok"):pill("Inactive","muted"))},
  ];
  const html = paneHeader("Librarians", "Manage staff and salary approvals", toolbar("librarians","Add Librarian"))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"librarians"})}</div>`;
  setTimeout(()=>{
    wireToolbar("librarians", ()=>renderPane("librarians"), ()=>editLibrarian(null));
    wireSort("librarians", "name", ()=>renderPane("librarians"));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editLibrarian(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r=rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete librarian "${r.name}"?`, async()=>{ await window.api.deleteLibrarian(r.id); toast("Deleted"); renderPane("librarians"); });
    }));
    $$("[data-approve]").forEach(b=>b.addEventListener("click", async()=>{
      await window.api.approveLibrarianPayout(b.dataset.approve); toast("Payout approved"); renderPane("librarians");
    }));
  },0);
  return html;
}
function editLibrarian(rec){
  const r = rec || { id:"", name:"", email:"", phoneNumber:"", isBlocked:false, isActive:true, libraryId:state.libraries[0]?.id, salary:3000, salaryStatus:"Pending Approval" };
  const body = field("Name",`<input class="form-control" name="name" value="${r.name}"/>`)
    + field("Email",`<input class="form-control" name="email" value="${r.email}"/>`)
    + field("Phone",`<input class="form-control" name="phoneNumber" value="${r.phoneNumber}"/>`)
    + field("Library", libSelect("libraryId", r.libraryId))
    + field("Salary",`<input type="number" class="form-control" name="salary" value="${r.salary}"/>`)
    + field("Payout status",`<select class="form-select" name="salaryStatus">${["Pending Approval","Approved","Paid"].map(o=>`<option ${o===r.salaryStatus?'selected':''}>${o}</option>`).join("")}</select>`)
    + `<div class="row"><div class="col-6">${field("",`<div class="form-check"><input type="checkbox" class="form-check-input" name="isActive" ${r.isActive?'checked':''}/><label class="form-check-label">Active</label></div>`)}</div>
       <div class="col-6">${field("",`<div class="form-check"><input type="checkbox" class="form-check-input" name="isBlocked" ${r.isBlocked?'checked':''}/><label class="form-check-label">Blocked</label></div>`)}</div></div>`;
  openForm(rec?"Edit Librarian":"Add Librarian", body, async()=>{
    const obj = formToObj();
    await window.api.saveLibrarian({ id:r.id, ...obj });
    toast(rec?"Updated":"Added"); renderPane("librarians");
  });
}

// ---------- MEMBERS ----------
async function paneMembers(){
  const rows = await window.api.getMembers();
  rows.forEach(r => r.libraryName = state.libraries.find(l=>l.id===r.libraryId)?.name || "—");
  const filtered = filterRows(rows, "members", ["fullName","email","libraryName"]);
  const sorted = sortRows(filtered, "members", "fullName");
  sorted.forEach(r => r.__actions = `<button class="btn btn-outline-accent btn-sm" disabled>View</button>`);
  const cols = [
    {key:"fullName", label:"Name"},
    {key:"email", label:"Email"},
    {key:"libraryName", label:"Library"},
    {key:"loan", label:"Loans"},
    {key:"balance", label:"Balance", render:r=>fmtMoney(r.balance)},
    {key:"isSubscribed", label:"Newsletter", render:r=>r.isSubscribed?pill("Yes","ok"):pill("No","muted")},
  ];
  const html = paneHeader("Members", "Registered library members", toolbar("members",""))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"members"})}</div>`;
  setTimeout(()=>{ wireToolbar("members", ()=>renderPane("members")); wireSort("members","fullName",()=>renderPane("members")); },0);
  return html;
}

// ---------- BOOKS ----------
async function paneBooks(){
  const rows = await window.api.getBooks();
  const filtered = filterRows(rows, "books", ["title","authorName","libraryName","language"]);
  const sorted = sortRows(filtered, "books", "title");
  sorted.forEach(r => r.__actions = `
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [
    {key:"title", label:"Title", render:r=>`<div class="d-flex align-items-center gap-2"><img src="${r.mainImageUrl}" width="34" height="46" style="object-fit:cover;border-radius:4px"/><div><div class="fw-semibold">${r.title}</div><div class="small text-muted-2">${r.language}</div></div></div>`},
    {key:"authorName", label:"Author"},
    {key:"libraryName", label:"Library"},
    {key:"pageCount", label:"Pages"},
    {key:"rating", label:"Rating"},
    {key:"inStock", label:"Stock", render:r=>r.inStock?pill("In stock","ok"):pill("Out","danger")},
  ];
  const html = paneHeader("Books", "Catalog across all libraries", toolbar("books","Add Book"))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"books"})}</div>`;
  setTimeout(()=>{
    wireToolbar("books", ()=>renderPane("books"), ()=>editBook(null));
    wireSort("books","title",()=>renderPane("books"));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editBook(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r=rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete "${r.title}"?`, async()=>{ await window.api.deleteBook(r.id); toast("Deleted"); renderPane("books"); });
    }));
  },0);
  return html;
}
function editBook(rec){
  const r = rec || { id:"", title:"", description:"", publishedDate:"2026-01-01", mainImageUrl:"", pageCount:200, authorId:state.authors[0]?.id, genreIds:[], libraryId:state.libraries[0]?.id, language:state.languages[0]?.name };
  const authors = state.authors.map(a=>`<option value="${a.id}" ${a.id===r.authorId?'selected':''}>${a.name}</option>`).join("");
  const genres = state.genres.map(g=>`<option value="${g.id}" ${(r.genreIds||[]).includes(g.id)?'selected':''}>${g.name}</option>`).join("");
  const langs = state.languages.map(l=>`<option ${l.name===r.language?'selected':''}>${l.name}</option>`).join("");
  const body = field("Title",`<input class="form-control" name="title" value="${r.title}"/>`)
    + field("Description",`<textarea class="form-control" name="description" rows="3">${r.description||""}</textarea>`)
    + `<div class="row"><div class="col-md-6">${field("Published",`<input type="date" class="form-control" name="publishedDate" value="${r.publishedDate}"/>`)}</div>
       <div class="col-md-6">${field("Pages",`<input type="number" class="form-control" name="pageCount" value="${r.pageCount}"/>`)}</div></div>`
    + field("Cover Image URL",`<input class="form-control" name="mainImageUrl" value="${r.mainImageUrl}"/>`)
    + `<div class="row"><div class="col-md-6">${field("Author",`<select class="form-select" name="authorId">${authors}</select>`)}</div>
       <div class="col-md-6">${field("Library", libSelect("libraryId", r.libraryId))}</div></div>`
    + `<div class="row"><div class="col-md-6">${field("Genres (hold ⌘/Ctrl)",`<select class="form-select" name="genreIds" multiple size="4">${genres}</select>`)}</div>
       <div class="col-md-6">${field("Language",`<select class="form-select" name="language">${langs}</select>`)}</div></div>`;
  openForm(rec?"Edit Book":"Add Book", body, async()=>{
    const obj = formToObj();
    obj.authorName = state.authors.find(a=>a.id===obj.authorId)?.name;
    obj.libraryName = state.libraries.find(l=>l.id===obj.libraryId)?.name;
    obj.genreNames = (obj.genreIds||[]).map(id=>state.genres.find(g=>g.id===id)?.name).filter(Boolean);
    await window.api.saveBook({ id:r.id, ...obj });
    toast(rec?"Book updated":"Book added"); renderPane("books");
  });
}

// ---------- Simple entity panes: authors/genres/languages ----------
async function paneSimple(pane, title, sub, api, saveFn, delFn){
  const rows = await api();
  const filtered = filterRows(rows, pane, ["name"]);
  const sorted = sortRows(filtered, pane, "name");
  sorted.forEach(r => r.__actions = `
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [{key:"id",label:"ID"},{key:"name",label:"Name"}];
  const html = paneHeader(title, sub, toolbar(pane,"Add "+title.replace(/s$/,"")))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane})}</div>`;
  const editOne = (rec)=>{
    const r = rec || {id:"",name:""};
    openForm((rec?"Edit ":"Add ")+title.replace(/s$/,""),
      field("Name",`<input class="form-control" name="name" value="${r.name}"/>`),
      async()=>{ const obj=formToObj(); await saveFn({id:r.id,...obj}); toast("Saved"); renderPane(pane); });
  };
  setTimeout(()=>{
    wireToolbar(pane, ()=>renderPane(pane), ()=>editOne(null));
    wireSort(pane,"name",()=>renderPane(pane));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editOne(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r=rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete "${r.name}"?`, async()=>{ await delFn(r.id); toast("Deleted"); renderPane(pane); });
    }));
  },0);
  return html;
}

// ---------- ROOMS ----------
async function paneRooms(){
  const rows = await window.api.getRooms();
  const filtered = filterRows(rows, "rooms", ["name","libraryName"]);
  const sorted = sortRows(filtered, "rooms", "name");
  sorted.forEach(r => r.__actions = `
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [
    {key:"name", label:"Name"},
    {key:"libraryName", label:"Library"},
    {key:"capacity", label:"Capacity"},
    {key:"amenities", label:"Amenities", render:r=>(r.amenities||[]).map(a=>pill(a,"info")).join(" ")},
    {key:"isAvailable", label:"Available", render:r=>r.isAvailable?pill("Yes","ok"):pill("No","muted")},
  ];
  const html = paneHeader("Study Rooms","Bookable rooms across libraries", toolbar("rooms","Add Room"))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"rooms"})}</div>`;
  const editOne = (rec)=>{
    const r = rec || {id:"",name:"",capacity:4,isAvailable:true,libraryId:state.libraries[0]?.id,amenities:[]};
    const body = field("Name",`<input class="form-control" name="name" value="${r.name}"/>`)
      + `<div class="row"><div class="col-md-6">${field("Capacity",`<input type="number" class="form-control" name="capacity" value="${r.capacity}"/>`)}</div>
         <div class="col-md-6">${field("Library", libSelect("libraryId", r.libraryId))}</div></div>`
      + field("Amenities (comma-separated)",`<input class="form-control" name="amenitiesRaw" value="${(r.amenities||[]).join(', ')}"/>`)
      + field("",`<div class="form-check"><input type="checkbox" class="form-check-input" name="isAvailable" ${r.isAvailable?'checked':''}/><label class="form-check-label">Available for booking</label></div>`);
    openForm(rec?"Edit Room":"Add Room", body, async()=>{
      const obj = formToObj();
      obj.amenities = (obj.amenitiesRaw||"").split(",").map(s=>s.trim()).filter(Boolean);
      obj.libraryName = state.libraries.find(l=>l.id===obj.libraryId)?.name;
      delete obj.amenitiesRaw;
      await window.api.saveRoom({id:r.id,...obj}); toast("Saved"); renderPane("rooms");
    });
  };
  setTimeout(()=>{
    wireToolbar("rooms",()=>renderPane("rooms"),()=>editOne(null));
    wireSort("rooms","name",()=>renderPane("rooms"));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editOne(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r=rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete room "${r.name}"?`, async()=>{ await window.api.deleteRoom(r.id); toast("Deleted"); renderPane("rooms"); });
    }));
  },0);
  return html;
}

// ---------- ROOM RESERVATIONS ----------
async function paneReservations(){
  const rows = await window.api.getAllRoomReservations();
  const filtered = filterRows(rows, "reservations", ["roomName","userName","libraryName","status"]);
  const sorted = sortRows(filtered, "reservations", "reservationDate");
  const statusSelect = (r)=>`<select class="form-select form-select-sm" data-set-status="${r.id}" style="min-width:130px">${["Pending","Confirmed","Cancelled"].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join("")}</select>`;
  sorted.forEach(r => r.__actions = statusSelect(r));
  const cols = [
    {key:"roomName", label:"Room"},
    {key:"libraryName", label:"Library"},
    {key:"userName", label:"Member"},
    {key:"reservationDate", label:"Date"},
    {key:"startTime", label:"Start"},
    {key:"endTime", label:"End"},
    {key:"status", label:"Status", render:r=>statusPill(r.status)},
  ];
  const html = paneHeader("Room Reservations","Approve or cancel bookings", toolbar("reservations",""))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"reservations"})}</div>`;
  setTimeout(()=>{
    wireToolbar("reservations",()=>renderPane("reservations"));
    wireSort("reservations","reservationDate",()=>renderPane("reservations"));
    $$("[data-set-status]").forEach(s=>s.addEventListener("change", async e=>{
      await window.api.setRoomReservationStatus(s.dataset.setStatus, e.target.value);
      toast("Status updated"); renderPane("reservations");
    }));
  },0);
  return html;
}

// ---------- BORROWINGS ----------
async function paneBorrowings(){
  const rows = await window.api.getAllBorrowings();
  const filtered = filterRows(rows, "borrowings", ["bookTitle","userName","libraryName","status"]);
  const sorted = sortRows(filtered, "borrowings", "borrowedDate");
  const statusSelect = (r)=>`<select class="form-select form-select-sm" data-set-status="${r.id}" style="min-width:130px">${["Pending","Approved","Returned","Overdue"].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join("")}</select>`;
  sorted.forEach(r => r.__actions = statusSelect(r));
  const cols = [
    {key:"bookTitle", label:"Book"},
    {key:"userName", label:"Member"},
    {key:"libraryName", label:"Library"},
    {key:"borrowedDate", label:"Borrowed"},
    {key:"dueDate", label:"Due"},
    {key:"returnedDate", label:"Returned", render:r=>r.returnedDate||"—"},
    {key:"fineAmount", label:"Fine", render:r=>r.fineAmount?fmtMoney(r.fineAmount):"—"},
    {key:"status", label:"Status", render:r=>statusPill(r.status)},
  ];
  const html = paneHeader("Book Borrowing","Approve pending, mark returned, track overdue", toolbar("borrowings",""))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"borrowings"})}</div>`;
  setTimeout(()=>{
    wireToolbar("borrowings",()=>renderPane("borrowings"));
    wireSort("borrowings","borrowedDate",()=>renderPane("borrowings"));
    $$("[data-set-status]").forEach(s=>s.addEventListener("change", async e=>{
      await window.api.setBorrowingStatus(s.dataset.setStatus, e.target.value);
      toast("Status updated"); renderPane("borrowings");
    }));
  },0);
  return html;
}

// ---------- LIBRARIAN PAYMENTS ----------
async function panePayments(){
  const rows = await window.api.getSalaryPayments();
  const filtered = filterRows(rows, "payments", ["librarianName","method","status"]);
  const sorted = sortRows(filtered, "payments", "date");
  sorted.forEach(r=> r.__actions = pill(r.status,"ok"));
  const cols = [
    {key:"librarianName", label:"Librarian"},
    {key:"date", label:"Date"},
    {key:"amount", label:"Amount", render:r=>fmtMoney(r.amount)},
    {key:"method", label:"Method"},
    {key:"status", label:"Status", render:r=>statusPill(r.status)},
  ];
  const html = paneHeader("Librarian Payments","Salary payout history",
    `<div class="admin-toolbar">
       <input class="form-control form-control-sm" placeholder="Filter by librarian…" value="${state.search.payments||''}" id="tb-search-payments"/>
     </div>`)
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"payments"})}</div>`;
  setTimeout(()=>{
    const s = $("#tb-search-payments"); s.addEventListener("input", e=>{ state.search.payments=e.target.value; renderPane("payments"); });
    wireSort("payments","date",()=>renderPane("payments"));
  },0);
  return html;
}

// ---------- ANNOUNCEMENTS ----------
async function paneAnnouncements(){
  const rows = await window.api.getAnnouncements();
  const filtered = filterRows(rows, "announcements", ["title","publisher"]);
  const sorted = sortRows(filtered, "announcements", "announceDate");
  sorted.forEach(r=> r.__actions = `
    <button class="btn btn-outline-accent btn-sm" data-edit="${r.id}">Edit</button>
    <button class="btn btn-outline-danger btn-sm" data-del="${r.id}">Delete</button>`);
  const cols = [
    {key:"title", label:"Title"},
    {key:"publisher", label:"Publisher"},
    {key:"announceDate", label:"Date"},
    {key:"isImportant", label:"Priority", render:r=>r.isImportant?pill("Important","danger"):pill("Normal","muted")},
  ];
  const html = paneHeader("Announcements","Post news for members", toolbar("announcements","Add Announcement"))
    + `<div class="admin-card">${tableShell(cols, sorted, {pane:"announcements"})}</div>`;
  const editOne = (rec)=>{
    const r = rec || {id:"",title:"",content:"",announceDate:new Date().toISOString().slice(0,10),publisher:"Admin",isImportant:false};
    const body = field("Title",`<input class="form-control" name="title" value="${r.title}"/>`)
      + field("Content",`<textarea class="form-control" name="content" rows="4">${r.content}</textarea>`)
      + `<div class="row"><div class="col-md-6">${field("Date",`<input type="date" class="form-control" name="announceDate" value="${r.announceDate}"/>`)}</div>
         <div class="col-md-6">${field("Publisher",`<input class="form-control" name="publisher" value="${r.publisher}"/>`)}</div></div>`
      + field("",`<div class="form-check"><input type="checkbox" class="form-check-input" name="isImportant" ${r.isImportant?'checked':''}/><label class="form-check-label">Mark as important</label></div>`);
    openForm(rec?"Edit Announcement":"Add Announcement", body, async()=>{
      const obj = formToObj(); await window.api.saveAnnouncement({id:r.id,...obj}); toast("Saved"); renderPane("announcements");
    });
  };
  setTimeout(()=>{
    wireToolbar("announcements",()=>renderPane("announcements"),()=>editOne(null));
    wireSort("announcements","announceDate",()=>renderPane("announcements"));
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>editOne(rows.find(x=>x.id===b.dataset.edit))));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      const r=rows.find(x=>x.id===b.dataset.del);
      openConfirm(`Delete "${r.title}"?`, async()=>{ await window.api.deleteAnnouncement(r.id); toast("Deleted"); renderPane("announcements"); });
    }));
  },0);
  return html;
}

// ---------- GALLERY ----------
async function paneGallery(){
  const rows = await window.api.getGalleryItems();
  const html = paneHeader("Gallery","Photos featured across the site",
    `<button class="btn btn-accent btn-sm" id="galAdd">+ Add Image</button>`)
    + `<div class="admin-card p-3"><div class="row g-3">${
       rows.length ? rows.map(g=>`
        <div class="col-6 col-md-4 col-lg-3"><div class="card-lib overflow-hidden">
          <img src="${g.url}" style="width:100%;height:160px;object-fit:cover"/>
          <div class="p-2 d-flex justify-content-between align-items-center">
            <span class="small text-muted-2">${g.id}</span>
            <button class="btn btn-outline-danger btn-sm" data-del="${g.id}">Delete</button>
          </div>
        </div></div>`).join("")
       : `<div class="col-12">${emptyState("No gallery items yet.","🖼")}</div>`
    }</div></div>`;
  setTimeout(()=>{
    $("#galAdd").addEventListener("click", ()=>{
      openForm("Add Gallery Image", field("Image URL",`<input class="form-control" name="url" placeholder="https://…"/>`),
        async()=>{ const o=formToObj(); if(!o.url) return false; await window.api.saveGalleryItem(o); toast("Added"); renderPane("gallery"); });
    });
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      openConfirm("Delete this image?", async()=>{ await window.api.deleteGalleryItem(b.dataset.del); toast("Deleted"); renderPane("gallery"); });
    }));
  },0);
  return html;
}

// ---------- Router ----------
const PANES = {
  overview: paneOverview,
  libraries: paneLibraries,
  librarians: paneLibrarians,
  members: paneMembers,
  books: paneBooks,
  authors: ()=>paneSimple("authors","Authors","Manage authors",window.api.getAuthors, window.api.saveAuthor.bind(window.api), window.api.deleteAuthor.bind(window.api)),
  genres:  ()=>paneSimple("genres","Genres","Manage genres",window.api.getGenres, window.api.saveGenre.bind(window.api), window.api.deleteGenre.bind(window.api)),
  languages:()=>paneSimple("languages","Languages","Manage languages",window.api.getLanguages, window.api.saveLanguage.bind(window.api), window.api.deleteLanguage.bind(window.api)),
  rooms: paneRooms,
  reservations: paneReservations,
  borrowings: paneBorrowings,
  payments: panePayments,
  announcements: paneAnnouncements,
  gallery: paneGallery,
};

async function mount(html){ $("#paneMount").innerHTML = html; }

async function renderPane(name){
  $$(".admin-sidebar .side-link").forEach(a=>a.classList.toggle("active", a.dataset.pane===name));
  $("#paneMount").innerHTML = `<div class="admin-header"><div><h1>Loading…</h1><div class="sub">Fetching data</div></div></div>
    <div class="admin-card p-4"><div class="skeleton" style="height:20px;width:40%;margin-bottom:10px"></div>
    <div class="skeleton" style="height:14px;width:70%;margin-bottom:8px"></div>
    <div class="skeleton" style="height:14px;width:55%"></div></div>`;
  const fn = PANES[name] || PANES.overview;
  const html = await fn();
  $("#paneMount").innerHTML = html;
  // rewire is done inside each pane's setTimeout callbacks
  history.replaceState(null,"",`#${name}`);
  if(window.innerWidth < 992) $("#sidebar").classList.remove("open");
}

function currentPane(){ return (location.hash||"#overview").slice(1); }

document.addEventListener("DOMContentLoaded", async ()=>{
  // preload reference lists
  [state.libraries, state.authors, state.genres, state.languages] = await Promise.all([
    window.api.getLibraries(), window.api.getAuthors(), window.api.getGenres(), window.api.getLanguages()
  ]);
  $$(".admin-sidebar .side-link[data-pane]").forEach(a=>a.addEventListener("click", e=>{
    e.preventDefault(); renderPane(a.dataset.pane);
  }));
  $("#sideToggle")?.addEventListener("click", ()=>{ $("#sidebar").classList.toggle("open"); $("#scrim").classList.toggle("show"); });
  $("#scrim")?.addEventListener("click", ()=>{ $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); });
  $("#logoutBtn")?.addEventListener("click", async e=>{ e.preventDefault(); await window.api.logout(); location.href="/site/index.html"; });
  window.addEventListener("hashchange", ()=>renderPane(currentPane()));
  renderPane(currentPane());
});
