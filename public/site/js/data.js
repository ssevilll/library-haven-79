/* Mock data + typed shapes (via JSDoc). Each list is wrapped in an async
 * "api" function so a real fetch call can replace it later with 1-line change.
 *
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} publishedDate
 * @property {string} mainImageUrl
 * @property {string[]} additionalImageUrls
 * @property {number} pageCount
 * @property {number} rating
 * @property {boolean} isNew
 * @property {boolean} inStock
 * @property {string} authorId
 * @property {string} authorName
 * @property {string[]} genreIds
 * @property {string[]} genreNames
 * @property {string} libraryId
 * @property {string} libraryName
 * @property {string} language
 */

const COVERS = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531072901881-d644216d4bf9?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop"
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
  "https://images.unsplash.com/photo-1568667256549-094345857637?w=800",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
  "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
  "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
  "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=800"
];

const LIBRARIES = [
  { id:"lib-1", name:"Central Library", location:"221 Rowan Street, Downtown", phoneNumber:"+1 (415) 555-0110", email:"central@lumen.lib" },
  { id:"lib-2", name:"Harborview Branch", location:"48 Pier Ave, Harborview", phoneNumber:"+1 (415) 555-0128", email:"harbor@lumen.lib" },
  { id:"lib-3", name:"Ashgrove Community", location:"9 Elm Circle, Ashgrove", phoneNumber:"+1 (415) 555-0134", email:"ashgrove@lumen.lib" },
  { id:"lib-4", name:"Northfield Reading Hall", location:"12 Cedar Way, Northfield", phoneNumber:"+1 (415) 555-0177", email:"north@lumen.lib" },
];

const AUTHORS = [
  { id:"a1", name:"Maya Okafor" },{ id:"a2", name:"Jules Ferrand" },
  { id:"a3", name:"Ren Iwasaki" },{ id:"a4", name:"Priya Mahal" },
  { id:"a5", name:"Tomas Novak" },{ id:"a6", name:"Elena Ríos" },
  { id:"a7", name:"Ada Whitfield" },{ id:"a8", name:"Kofi Mensah" },
];

const GENRES = [
  { id:"g1", name:"Fiction" },{ id:"g2", name:"Mystery" },{ id:"g3", name:"Sci-Fi" },
  { id:"g4", name:"Fantasy" },{ id:"g5", name:"Biography" },{ id:"g6", name:"History" },
  { id:"g7", name:"Poetry" },{ id:"g8", name:"Non-fiction" },{ id:"g9", name:"Romance" },
  { id:"g10", name:"Philosophy" },
];

const LANGUAGES = [
  { id:"l1", name:"English" },{ id:"l2", name:"Spanish" },
  { id:"l3", name:"French" },{ id:"l4", name:"Japanese" },{ id:"l5", name:"Arabic" },
];

const BOOK_TITLES = [
  ["The Cartographer's Daughter","g1","g4"],
  ["Salt & Silver","g2","g1"],
  ["Echoes from Orion","g3"],
  ["A Quiet Astronomy","g7","g1"],
  ["The Ledger of Rain","g1","g10"],
  ["Nightmarket","g2"],
  ["Iron Season","g4"],
  ["Small Constellations","g7"],
  ["The Kindly Machines","g3","g10"],
  ["Homecoming Radio","g1"],
  ["Fieldnotes from Nowhere","g8","g5"],
  ["The Auburn Room","g2","g1"],
  ["When the Sea Remembers","g4","g9"],
  ["Cartilage and Bone","g8","g6"],
  ["Bright, Sudden Country","g1","g7"],
  ["Threadbare Kingdoms","g4","g6"],
  ["A Short History of Silence","g6","g10"],
  ["The Glass Botanist","g5","g8"],
  ["Concerning Distances","g10","g7"],
  ["A Museum of Small Things","g1"],
  ["Under the Weathered Sun","g9","g1"],
  ["Ledger of Vanishings","g2","g4"],
  ["The Last Cartographer","g3","g4"],
  ["Vermilion Notes","g7","g10"],
];

function makeBooks(){
  const books = [];
  BOOK_TITLES.forEach((entry,i)=>{
    const [title,...gids] = entry;
    const author = AUTHORS[i % AUTHORS.length];
    const lib = LIBRARIES[i % LIBRARIES.length];
    const gNames = gids.map(id => GENRES.find(g=>g.id===id)?.name).filter(Boolean);
    books.push({
      id:`b${i+1}`,
      title,
      description:`${title} is a stirring, quietly virtuosic ${gNames[0]?.toLowerCase()||"fiction"} work that lingers well past the last page. A luminous read for anyone who loves ${gNames.slice(0,2).join(" and ").toLowerCase()||"good storytelling"}.`,
      publishedDate:`${2015 + (i % 10)}-0${(i%9)+1}-14`,
      mainImageUrl: COVERS[i % COVERS.length],
      additionalImageUrls: [COVERS[(i+1)%COVERS.length], COVERS[(i+2)%COVERS.length], COVERS[(i+3)%COVERS.length]],
      pageCount: 180 + (i*17) % 380,
      rating: Math.round((3.5 + ((i*13)%15)/10)*10)/10,
      isNew: i < 4,
      inStock: (i % 5) !== 0,
      authorId: author.id, authorName: author.name,
      genreIds: gids, genreNames: gNames,
      libraryId: lib.id, libraryName: lib.name,
      language: LANGUAGES[i % LANGUAGES.length].name,
    });
  });
  return books;
}
const BOOKS = makeBooks();

const ROOMS = LIBRARIES.flatMap((lib, li) => [
  { id:`r-${li}-1`, name:`Quiet Study ${li+1}A`, capacity:4, isAvailable:true, libraryId:lib.id, libraryName:lib.name, amenities:["Whiteboard","Wi-Fi","Power"] },
  { id:`r-${li}-2`, name:`Group Room ${li+1}B`, capacity:8, isAvailable:li%2===0, libraryId:lib.id, libraryName:lib.name, amenities:["TV Screen","Whiteboard","Wi-Fi"] },
  { id:`r-${li}-3`, name:`Media Lab ${li+1}C`, capacity:6, isAvailable:true, libraryId:lib.id, libraryName:lib.name, amenities:["Recording","Wi-Fi","Power"] },
]);

const ANNOUNCEMENTS = [
  { id:"an1", title:"Extended Hours This Weekend", content:"To support finals week, all branches will remain open until 11pm Friday and Saturday. Quiet zones will be strictly enforced after 7pm.", announceDate:"2026-06-28", publisher:"Isabelle Chen — Central Librarian", isImportant:true },
  { id:"an2", title:"New Arrivals: Summer Collection", content:"Over 200 new titles have arrived across our fiction and non-fiction shelves this week. Stop by the front desk to see the featured picks.", announceDate:"2026-06-25", publisher:"Marcus Ade — Harborview", isImportant:false },
  { id:"an3", title:"Ashgrove Reading Circle — Thursdays", content:"Join our weekly reading circle every Thursday at 6pm. This month we're reading 'A Quiet Astronomy'. All members welcome — no signup required.", announceDate:"2026-06-20", publisher:"Priya Mahal — Ashgrove", isImportant:false },
  { id:"an4", title:"System Maintenance — July 3rd", content:"Online reservation systems will be unavailable from 1am to 4am on July 3rd for scheduled maintenance. In-branch services will continue as normal.", announceDate:"2026-06-18", publisher:"System Admin", isImportant:true },
  { id:"an5", title:"Children's Story Hour Returns", content:"Northfield's beloved story hour resumes every Saturday morning at 10am, starting July 6th. Suitable for ages 3–8.", announceDate:"2026-06-12", publisher:"Ren Iwasaki — Northfield", isImportant:false },
];

// -----------------------------
// API surface (all Promise-based so real fetch drop-in is 1 line)
// -----------------------------
const delay = (ms) => new Promise(r => setTimeout(r, ms));

window.api = {
  async getLibraries(){ await delay(120); return LIBRARIES; },
  async getGenres(){ await delay(80); return GENRES; },
  async getAuthors(){ await delay(80); return AUTHORS; },
  async getLanguages(){ await delay(80); return LANGUAGES; },
  async getBooks(filters = {}){
    await delay(180);
    let out = [...BOOKS];
    const {q,genres,author,minPages,maxPages,minYear,maxYear,language,minRating,availableOnly,libraryId} = filters;
    if(q){ const s = q.toLowerCase(); out = out.filter(b=>b.title.toLowerCase().includes(s) || b.authorName.toLowerCase().includes(s)); }
    if(genres?.length){ out = out.filter(b=>b.genreIds.some(g=>genres.includes(g))); }
    if(author){ out = out.filter(b=>b.authorId===author); }
    if(minPages!=null){ out = out.filter(b=>b.pageCount>=minPages); }
    if(maxPages!=null){ out = out.filter(b=>b.pageCount<=maxPages); }
    if(minYear!=null){ out = out.filter(b=>parseInt(b.publishedDate)>=minYear); }
    if(maxYear!=null){ out = out.filter(b=>parseInt(b.publishedDate)<=maxYear); }
    if(language){ out = out.filter(b=>b.language===language); }
    if(minRating!=null){ out = out.filter(b=>b.rating>=minRating); }
    if(availableOnly){ out = out.filter(b=>b.inStock); }
    if(libraryId){ out = out.filter(b=>b.libraryId===libraryId); }
    return out;
  },
  async getBookById(id){ await delay(120); return BOOKS.find(b=>b.id===id) || null; },
  async getRelatedBooks(book, n=6){
    await delay(100);
    return BOOKS.filter(b => b.id!==book.id && b.genreIds.some(g=>book.genreIds.includes(g))).slice(0,n);
  },
  async getGalleryItems(){ await delay(120); return GALLERY_IMGS.map((url,i)=>({id:`gal${i+1}`, url})); },
  async getRooms(filters={}){
    await delay(150);
    let out = [...ROOMS];
    if(filters.libraryId) out = out.filter(r=>r.libraryId===filters.libraryId);
    if(filters.minCapacity) out = out.filter(r=>r.capacity>=filters.minCapacity);
    if(filters.availableOnly) out = out.filter(r=>r.isAvailable);
    return out;
  },
  async getAnnouncements(){ await delay(120); return ANNOUNCEMENTS; },
  async getReviewsForBook(bookId){
    await delay(100);
    return [
      { id:"rv1", author:"Nina R.", rating:5, date:"2026-05-11", text:"Absolutely luminous. I finished it in two sittings and immediately started again."},
      { id:"rv2", author:"David K.", rating:4, date:"2026-04-02", text:"A quiet, patient book — worth the slow burn. The final chapter is stunning."},
      { id:"rv3", author:"Priya S.", rating:4, date:"2026-03-15", text:"Prose so careful it feels handmade. A great pick if you enjoyed the author's earlier work."},
    ];
  },
  // auth
  async register(payload){ await delay(300); localStorage.setItem("lumen_pending_email", payload.email); return {ok:true}; },
  async verifyCode(code){ await delay(250); return {ok: code === "123456"}; },
  async login(email, _pw){
    await delay(300);
    const user = { id:"u1", fullName: email.split("@")[0].replace(/\W/g," ").replace(/\b\w/g,c=>c.toUpperCase()) || "Member", email, phoneNumber:"", libraryId:"lib-1", balance:0, loan:0, isSubscribed:true, role:"Member" };
    localStorage.setItem("lumen_user", JSON.stringify(user));
    return { ok:true, user };
  },
  async logout(){ localStorage.removeItem("lumen_user"); },
  currentUser(){ try{ return JSON.parse(localStorage.getItem("lumen_user")||"null"); }catch{return null;} },
  async updateProfile(patch){
    await delay(200);
    const u = { ...(this.currentUser()||{}), ...patch };
    localStorage.setItem("lumen_user", JSON.stringify(u));
    return { ok:true, user:u };
  },
  async changePassword(_o,_n){ await delay(250); return { ok:true }; },
  async deleteAccount(_confirmation){ await delay(400); localStorage.removeItem("lumen_user"); localStorage.removeItem("lumen_shelves"); return {ok:true}; },
  // small counters used by navbar badges
  async unreadCounts(){ await delay(50); return { announcements: 2, chat: 3 }; },

  // ---- Member dashboard mock ----
  async getMyLoans(){
    await delay(160);
    const pick = (i)=>BOOKS[i];
    return [
      { id:"ln1", book:pick(2), borrowedDate:"2026-06-18", dueDate:"2026-07-09", status:"active", renewals:0 },
      { id:"ln2", book:pick(5), borrowedDate:"2026-06-22", dueDate:"2026-07-06", status:"due-soon", renewals:1 },
      { id:"ln3", book:pick(11), borrowedDate:"2026-06-04", dueDate:"2026-06-25", status:"overdue", renewals:0, fine:3.50 },
    ];
  },
  async getMyReservations(){
    await delay(140);
    return [
      { id:"br1", book:BOOKS[7], reservedDate:"2026-06-30", pickupBy:"2026-07-10", position:1, libraryName:LIBRARIES[0].name },
      { id:"br2", book:BOOKS[14], reservedDate:"2026-06-28", pickupBy:"2026-07-08", position:3, libraryName:LIBRARIES[1].name },
    ];
  },
  async getMyHistory(){
    await delay(160);
    return [
      { id:"h1", book:BOOKS[0], borrowedDate:"2026-04-02", returnedDate:"2026-04-19", rating:5 },
      { id:"h2", book:BOOKS[3], borrowedDate:"2026-03-10", returnedDate:"2026-03-30", rating:4 },
      { id:"h3", book:BOOKS[8], borrowedDate:"2026-02-14", returnedDate:"2026-03-01", rating:4 },
      { id:"h4", book:BOOKS[13], borrowedDate:"2026-01-08", returnedDate:"2026-01-26", rating:3 },
      { id:"h5", book:BOOKS[17], borrowedDate:"2025-12-01", returnedDate:"2025-12-18", rating:5 },
    ];
  },
  async getMyStats(){
    await delay(140);
    return {
      totalBorrowed: 47,
      thisYear: 12,
      currentStreakDays: 42,
      favoriteGenre: "Fiction",
      pagesRead: 8420,
      avgRating: 4.3,
      monthly: [3,4,2,5,3,6,4,2,5,4,3,6], // last 12 months
      byGenre: [
        { name:"Fiction", count:18 },
        { name:"Mystery", count:9 },
        { name:"Sci-Fi", count:7 },
        { name:"Fantasy", count:6 },
        { name:"Biography", count:4 },
        { name:"Poetry", count:3 },
      ],
    };
  },
  async getMyShelves(){
    await delay(150);
    const s = JSON.parse(localStorage.getItem("lumen_shelves")||"null");
    if(s) return s;
    const seed = [
      { id:"sh1", name:"Favorites", icon:"★", bookIds:[BOOKS[0].id, BOOKS[3].id, BOOKS[8].id] },
      { id:"sh2", name:"Want to Read", icon:"🔖", bookIds:[BOOKS[6].id, BOOKS[9].id, BOOKS[12].id, BOOKS[15].id] },
      { id:"sh3", name:"Summer Reading", icon:"☀", bookIds:[BOOKS[1].id, BOOKS[14].id] },
    ];
    localStorage.setItem("lumen_shelves", JSON.stringify(seed));
    return seed;
  },
  async saveMyShelves(shelves){ await delay(120); localStorage.setItem("lumen_shelves", JSON.stringify(shelves)); return {ok:true}; },
  async getMyRoomReservations(){
    await delay(140);
    return [
      { id:"rr1", room:ROOMS[1], date:"2026-07-08", start:"14:00", end:"16:00", status:"upcoming" },
      { id:"rr2", room:ROOMS[4], date:"2026-07-12", start:"10:00", end:"11:30", status:"upcoming" },
      { id:"rr3", room:ROOMS[0], date:"2026-06-20", start:"09:00", end:"11:00", status:"completed" },
      { id:"rr4", room:ROOMS[7], date:"2026-06-11", start:"15:00", end:"17:00", status:"cancelled" },
    ];
  },
  async cancelRoomReservation(_id){ await delay(200); return {ok:true}; },
  async getMyPayments(){
    await delay(150);
    return {
      balance: 12.50,
      transactions: [
        { id:"t1", date:"2026-06-25", type:"Late fee",       description:"'The Auburn Room' — 4 days overdue", amount:-3.50, status:"unpaid" },
        { id:"t2", date:"2026-06-20", type:"Membership",     description:"Annual renewal",                    amount:-20.00, status:"paid" },
        { id:"t3", date:"2026-06-20", type:"Payment",        description:"Visa ending 4021",                   amount:20.00,  status:"paid" },
        { id:"t4", date:"2026-05-14", type:"Room booking",   description:"Media Lab 1C — 2h",                 amount:-9.00,  status:"paid" },
        { id:"t5", date:"2026-05-14", type:"Payment",        description:"Visa ending 4021",                   amount:9.00,   status:"paid" },
        { id:"t6", date:"2026-04-01", type:"Late fee",       description:"'Iron Season' — 2 days overdue",   amount:-1.50,  status:"paid" },
      ],
    };
  },
  async payBalance(_amt){ await delay(300); return {ok:true}; },
};

// ============ ADMIN / LIBRARIAN MOCK DATA ============
const LIBRARIANS = [
  { id:"lr1", name:"Isabelle Chen",  email:"isabelle@lumen.lib", phoneNumber:"+1 415 555 0210", isBlocked:false, isActive:true,  libraryId:"lib-1", salary:3200, salaryStatus:"Paid" },
  { id:"lr2", name:"Marcus Ade",     email:"marcus@lumen.lib",   phoneNumber:"+1 415 555 0211", isBlocked:false, isActive:true,  libraryId:"lib-2", salary:3100, salaryStatus:"Pending Approval" },
  { id:"lr3", name:"Priya Mahal",    email:"priya@lumen.lib",    phoneNumber:"+1 415 555 0212", isBlocked:false, isActive:true,  libraryId:"lib-3", salary:3050, salaryStatus:"Approved" },
  { id:"lr4", name:"Ren Iwasaki",    email:"ren@lumen.lib",      phoneNumber:"+1 415 555 0213", isBlocked:false, isActive:false, libraryId:"lib-4", salary:2900, salaryStatus:"Paid" },
  { id:"lr5", name:"Kofi Mensah",    email:"kofi@lumen.lib",     phoneNumber:"+1 415 555 0214", isBlocked:true,  isActive:false, libraryId:"lib-1", salary:3000, salaryStatus:"Pending Approval" },
];

const MEMBERS = [
  { id:"m1", fullName:"Nina Rojas",    email:"nina@example.com",   phoneNumber:"+1 555 0101", libraryId:"lib-1", balance:12.50, loan:2, isSubscribed:true,  role:"Member" },
  { id:"m2", fullName:"David Kimura",  email:"david@example.com",  phoneNumber:"+1 555 0102", libraryId:"lib-2", balance:0,     loan:1, isSubscribed:false, role:"Member" },
  { id:"m3", fullName:"Priya Sundar",  email:"priyas@example.com", phoneNumber:"+1 555 0103", libraryId:"lib-1", balance:3.50,  loan:0, isSubscribed:true,  role:"Member" },
  { id:"m4", fullName:"Aaron Levi",    email:"aaron@example.com",  phoneNumber:"+1 555 0104", libraryId:"lib-3", balance:0,     loan:3, isSubscribed:true,  role:"Member" },
  { id:"m5", fullName:"Sofia Rivera",  email:"sofia@example.com",  phoneNumber:"+1 555 0105", libraryId:"lib-4", balance:8.00,  loan:1, isSubscribed:false, role:"Member" },
  { id:"m6", fullName:"Tomas Novak",   email:"tomas@example.com",  phoneNumber:"+1 555 0106", libraryId:"lib-2", balance:0,     loan:0, isSubscribed:true,  role:"Member" },
];

const ROOM_RESERVATIONS = ROOMS.slice(0, 10).map((r, i) => ({
  id:`res${i+1}`, studyRoomId:r.id, roomName:r.name, libraryName:r.libraryName,
  userId:MEMBERS[i % MEMBERS.length].id, userName:MEMBERS[i % MEMBERS.length].fullName,
  reservationDate:`2026-07-${String((i%20)+3).padStart(2,'0')}`,
  startTime:`${9+(i%8)}:00`, endTime:`${10+(i%8)}:30`,
  status: ["Pending","Confirmed","Confirmed","Cancelled","Pending"][i%5],
}));

const BORROWINGS = BOOKS.slice(0, 14).map((b, i) => {
  const statuses = ["Pending","Approved","Returned","Overdue","Approved","Returned"];
  const st = statuses[i%statuses.length];
  return {
    id:`bor${i+1}`, bookId:b.id, bookTitle:b.title, libraryName:b.libraryName,
    userId:MEMBERS[i % MEMBERS.length].id, userName:MEMBERS[i % MEMBERS.length].fullName,
    borrowedDate:`2026-06-${String((i%25)+1).padStart(2,'0')}`,
    dueDate:`2026-07-${String((i%25)+1).padStart(2,'0')}`,
    returnedDate: st==="Returned" ? `2026-07-${String((i%20)+2).padStart(2,'0')}` : null,
    isReturned: st==="Returned",
    status: st,
    fineAmount: st==="Overdue" ? (i%3+1)*1.5 : 0,
  };
});

const SALARY_PAYMENTS = [
  { id:"sp1", librarianId:"lr1", librarianName:"Isabelle Chen", date:"2026-06-30", amount:3200, method:"Visa ****4021", status:"Paid" },
  { id:"sp2", librarianId:"lr3", librarianName:"Priya Mahal",   date:"2026-06-30", amount:3050, method:"MC ****1180",   status:"Paid" },
  { id:"sp3", librarianId:"lr4", librarianName:"Ren Iwasaki",   date:"2026-06-30", amount:2900, method:"Visa ****9910", status:"Paid" },
  { id:"sp4", librarianId:"lr1", librarianName:"Isabelle Chen", date:"2026-05-31", amount:3200, method:"Visa ****4021", status:"Paid" },
  { id:"sp5", librarianId:"lr2", librarianName:"Marcus Ade",    date:"2026-05-31", amount:3100, method:"Visa ****2233", status:"Paid" },
  { id:"sp6", librarianId:"lr3", librarianName:"Priya Mahal",   date:"2026-05-31", amount:3050, method:"MC ****1180",   status:"Paid" },
];

Object.assign(window.api, {
  async getAdminStats(){
    await delay(150);
    return {
      totalReservations: 128,
      mostReservedGenre: "Fiction",
      totalPayments: 14820.50,
      activeLibraries: LIBRARIES.length,
      activeMembers: MEMBERS.length + 214,
      totalBooks: BOOKS.length + 1240,
      pendingBorrows: BORROWINGS.filter(b=>b.status==="Pending").length,
      overdueBorrows: BORROWINGS.filter(b=>b.status==="Overdue").length,
      monthly: [22,31,28,35,40,38,44,41,48,52,49,58],
    };
  },
  async getLibrarians(){ await delay(140); return [...LIBRARIANS]; },
  async saveLibrarian(rec){ await delay(180); const i = LIBRARIANS.findIndex(x=>x.id===rec.id); if(i>=0) LIBRARIANS[i]=rec; else LIBRARIANS.push({...rec,id:`lr${Date.now()}`}); return {ok:true}; },
  async deleteLibrarian(id){ await delay(120); const i=LIBRARIANS.findIndex(x=>x.id===id); if(i>=0) LIBRARIANS.splice(i,1); return {ok:true}; },
  async approveLibrarianPayout(id){ await delay(120); const l=LIBRARIANS.find(x=>x.id===id); if(l) l.salaryStatus="Approved"; return {ok:true}; },

  async saveLibrary(rec){ await delay(150); const i=LIBRARIES.findIndex(x=>x.id===rec.id); if(i>=0) LIBRARIES[i]=rec; else LIBRARIES.push({...rec,id:`lib-${Date.now()}`}); return {ok:true}; },
  async deleteLibrary(id){ await delay(120); const i=LIBRARIES.findIndex(x=>x.id===id); if(i>=0) LIBRARIES.splice(i,1); return {ok:true}; },

  async saveBook(rec){ await delay(160); const i=BOOKS.findIndex(x=>x.id===rec.id); if(i>=0) BOOKS[i]={...BOOKS[i],...rec}; else BOOKS.push({...rec,id:`b${Date.now()}`,rating:0,isNew:true,inStock:true,additionalImageUrls:[]}); return {ok:true}; },
  async deleteBook(id){ await delay(120); const i=BOOKS.findIndex(x=>x.id===id); if(i>=0) BOOKS.splice(i,1); return {ok:true}; },

  async saveAuthor(rec){ await delay(120); const i=AUTHORS.findIndex(x=>x.id===rec.id); if(i>=0) AUTHORS[i]=rec; else AUTHORS.push({...rec,id:`a${Date.now()}`}); return {ok:true}; },
  async deleteAuthor(id){ await delay(100); const i=AUTHORS.findIndex(x=>x.id===id); if(i>=0) AUTHORS.splice(i,1); return {ok:true}; },
  async saveGenre(rec){ await delay(120); const i=GENRES.findIndex(x=>x.id===rec.id); if(i>=0) GENRES[i]=rec; else GENRES.push({...rec,id:`g${Date.now()}`}); return {ok:true}; },
  async deleteGenre(id){ await delay(100); const i=GENRES.findIndex(x=>x.id===id); if(i>=0) GENRES.splice(i,1); return {ok:true}; },
  async saveLanguage(rec){ await delay(120); const i=LANGUAGES.findIndex(x=>x.id===rec.id); if(i>=0) LANGUAGES[i]=rec; else LANGUAGES.push({...rec,id:`l${Date.now()}`}); return {ok:true}; },
  async deleteLanguage(id){ await delay(100); const i=LANGUAGES.findIndex(x=>x.id===id); if(i>=0) LANGUAGES.splice(i,1); return {ok:true}; },

  async saveRoom(rec){ await delay(140); const i=ROOMS.findIndex(x=>x.id===rec.id); if(i>=0) ROOMS[i]={...ROOMS[i],...rec}; else ROOMS.push({...rec,id:`r${Date.now()}`,amenities:rec.amenities||[]}); return {ok:true}; },
  async deleteRoom(id){ await delay(120); const i=ROOMS.findIndex(x=>x.id===id); if(i>=0) ROOMS.splice(i,1); return {ok:true}; },

  async getAllRoomReservations(){ await delay(150); return [...ROOM_RESERVATIONS]; },
  async setRoomReservationStatus(id, status){ await delay(120); const r=ROOM_RESERVATIONS.find(x=>x.id===id); if(r) r.status=status; return {ok:true}; },

  async getAllBorrowings(){ await delay(160); return [...BORROWINGS]; },
  async setBorrowingStatus(id, status){ await delay(120); const b=BORROWINGS.find(x=>x.id===id); if(b){ b.status=status; if(status==="Returned"){b.isReturned=true;b.returnedDate=new Date().toISOString().slice(0,10);} } return {ok:true}; },

  async getSalaryPayments(){ await delay(140); return [...SALARY_PAYMENTS]; },

  async saveAnnouncement(rec){ await delay(140); const i=ANNOUNCEMENTS.findIndex(x=>x.id===rec.id); if(i>=0) ANNOUNCEMENTS[i]=rec; else ANNOUNCEMENTS.unshift({...rec,id:`an${Date.now()}`}); return {ok:true}; },
  async deleteAnnouncement(id){ await delay(100); const i=ANNOUNCEMENTS.findIndex(x=>x.id===id); if(i>=0) ANNOUNCEMENTS.splice(i,1); return {ok:true}; },

  async saveGalleryItem(rec){ await delay(120); GALLERY_IMGS.push(rec.url); return {ok:true}; },
  async deleteGalleryItem(id){ await delay(100); const idx = parseInt(id.replace('gal',''),10)-1; if(idx>=0 && idx<GALLERY_IMGS.length) GALLERY_IMGS.splice(idx,1); return {ok:true}; },

  async getMembers(){ await delay(140); return [...MEMBERS]; },

  // ---- Librarian panel ----
  currentLibrarian(){
    try { const s = JSON.parse(localStorage.getItem("lumen_librarian")||"null"); if(s) return s; } catch{}
    // default seed: first librarian (Isabelle @ Central)
    const l = LIBRARIANS[0];
    localStorage.setItem("lumen_librarian", JSON.stringify(l));
    return l;
  },
  async getLibrarianStats(libraryId){
    await delay(150);
    const reservations = ROOM_RESERVATIONS.filter(r=>{
      const room = ROOMS.find(x=>x.id===r.studyRoomId);
      return room && room.libraryId===libraryId;
    });
    const borrows = BORROWINGS.filter(b => BOOKS.find(x=>x.id===b.bookId)?.libraryId===libraryId);
    const books   = BOOKS.filter(b=>b.libraryId===libraryId);
    const members = MEMBERS.filter(m=>m.libraryId===libraryId);
    const genreCounts = {};
    borrows.forEach(b=>{
      const bk = BOOKS.find(x=>x.id===b.bookId);
      (bk?.genreNames||[]).forEach(g=> genreCounts[g]=(genreCounts[g]||0)+1);
    });
    const byGenre = Object.entries(genreCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
    return {
      totalBooks: books.length,
      totalMembers: members.length,
      pendingBorrows: borrows.filter(b=>b.status==="Pending").length,
      overdueBorrows: borrows.filter(b=>b.status==="Overdue").length,
      pendingReservations: reservations.filter(r=>r.status==="Pending").length,
      totalReservations: reservations.length,
      totalBorrows: borrows.length,
      finesCollected: borrows.reduce((s,b)=>s+(b.fineAmount||0),0),
      monthly: [12,18,15,22,19,25,28,24,30,27,32,35],
      byGenre,
      statusBreakdown: {
        Pending: borrows.filter(b=>b.status==="Pending").length,
        Approved: borrows.filter(b=>b.status==="Approved").length,
        Returned: borrows.filter(b=>b.status==="Returned").length,
        Overdue: borrows.filter(b=>b.status==="Overdue").length,
      },
    };
  },
  async getLibrarianBorrowings(libraryId){
    await delay(150);
    return BORROWINGS.filter(b => BOOKS.find(x=>x.id===b.bookId)?.libraryId===libraryId).map(b=>({...b}));
  },
  async getLibrarianReservations(libraryId){
    await delay(150);
    return ROOM_RESERVATIONS.filter(r => ROOMS.find(x=>x.id===r.studyRoomId)?.libraryId===libraryId).map(r=>({...r}));
  },
  async getLibrarianBooks(libraryId){ await delay(140); return BOOKS.filter(b=>b.libraryId===libraryId).map(b=>({...b})); },
  async getLibrarianMembers(libraryId){ await delay(140); return MEMBERS.filter(m=>m.libraryId===libraryId).map(m=>({...m})); },
  async getLibrarianRooms(libraryId){ await delay(120); return ROOMS.filter(r=>r.libraryId===libraryId).map(r=>({...r})); },
  async getMySalaryInfo(librarianId){
    await delay(120);
    const l = LIBRARIANS.find(x=>x.id===librarianId);
    const history = SALARY_PAYMENTS.filter(p=>p.librarianId===librarianId);
    return { librarian:l, history };
  },
  async checkoutSalary(librarianId, payload){
    await delay(400);
    const l = LIBRARIANS.find(x=>x.id===librarianId); if(!l) return {ok:false};
    const rec = {
      id:`sp${Date.now()}`, librarianId:l.id, librarianName:l.name,
      date:new Date().toISOString().slice(0,10), amount:l.salary,
      method: payload.method || "Visa ****0000", status:"Paid"
    };
    SALARY_PAYMENTS.unshift(rec);
    l.salaryStatus = "Paid";
    return { ok:true, payment:rec };
  },
});
