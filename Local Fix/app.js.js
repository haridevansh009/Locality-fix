const CATS = [
  {
    id: 'elec',
    n: 'Electrician',
    e: '⚡',
    s: [
      ['Fan or light fitting', 249],
      ['Switchboard repair', 349],
      ['Wiring check', 499],
    ],
  },
  {
    id: 'plum',
    n: 'Plumber',
    e: '🔧',
    s: [
      ['Tap or leak fix', 299],
      ['Drain unblocking', 449],
      ['Bathroom fitting', 599],
    ],
  },
  {
    id: 'ac',
    n: 'AC repair',
    e: '❄️',
    s: [
      ['AC check-up', 399],
      ['Gas top-up', 1499],
      ['Deep service', 699],
    ],
  },
  {
    id: 'clean',
    n: 'Cleaning',
    e: '🧹',
    s: [
      ['Bathroom cleaning', 499],
      ['Kitchen deep clean', 999],
      ['Full home (2 BHK)', 2199],
    ],
  },
];

const P = [
  [
    1,
    'Rajesh Kumar',
    'elec',
    4.8,
    212,
    249,
    9,
    1,
    'Sector 14',
    'Licensed electrician. Neat work, shares a clear quote before starting.',
  ],
  [
    2,
    'Imran Ansari',
    'elec',
    4.5,
    98,
    229,
    5,
    1,
    'Civil Lines',
    'Handles inverter, MCB and wiring faults. Evening slots usually open.',
  ],
  [
    3,
    'Sunil Verma',
    'elec',
    4.2,
    40,
    199,
    3,
    0,
    'Old Town',
    'Quick fixes for fans, lights and sockets.',
  ],
  [
    4,
    'Mohan Lal',
    'plum',
    4.7,
    176,
    299,
    12,
    1,
    'Sector 14',
    'Leaks, drains and bathroom fittings. Carries common spares.',
  ],
  [
    5,
    'Deepak Yadav',
    'plum',
    4.4,
    64,
    269,
    4,
    1,
    'Civil Lines',
    'Fast response for urgent leaks.',
  ],
  [
    6,
    'Arif Khan',
    'ac',
    4.9,
    301,
    399,
    11,
    1,
    'Sector 9',
    'Split and window AC specialist. Brand-trained.',
  ],
  [
    7,
    'Pooja Cooling',
    'ac',
    4.3,
    87,
    449,
    6,
    0,
    'Old Town',
    'Small team for servicing and gas refills.',
  ],
  [
    8,
    'Sparkle Home Care',
    'clean',
    4.6,
    245,
    499,
    7,
    1,
    'Sector 9',
    'Trained cleaners with their own equipment and eco-safe products.',
  ],
  [
    9,
    'Meena Devi',
    'clean',
    4.4,
    73,
    449,
    5,
    1,
    'Civil Lines',
    'Careful bathroom and kitchen cleaning.',
  ],
].map((a) => ({
  id: a[0],
  name: a[1],
  cat: a[2],
  r: a[3],
  jobs: a[4],
  price: a[5],
  exp: a[6],
  ver: a[7],
  area: a[8],
  about: a[9],
}));

const TIMES = ['09:00', '11:00', '13:00', '15:00', '17:00'],
  FEE = 29,
  COL = ['#F5B700', '#7BD3B0', '#9CC3FF', '#F2A0A0', '#C8B6FF'];

let S = {
  user: null,
  role: 'c',
  view: 'login',
  cat: null,
  q: '',
  sort: 'rating',
  ver: 0,
  max: 0,
  pid: null,
  bk: {},
  rv: null,
  rs: 0,
  asP: 1,
  rid: null,
};

let B = [
  {
    id: 'LF-1001',
    pid: 1,
    cat: 'elec',
    svc: 'Fan or light fitting',
    price: 249,
    slot: dk(1, '11:00'),
    addr: 'B-12, Sector 14',
    u: 'demo',
    un: 'Neha S.',
    pay: 'later',
    status: 'Requested',
    rv: null,
  },
];

let avail = {};

try {
  const j = JSON.parse(localStorage.getItem('lf') || 'null');
  if (j) {
    S.user = j.user;
    B = j.B || B;
    avail = j.avail || {};
    if (S.user) S.view = 'home';
  }
} catch (e) {}

function save() {
  try {
    localStorage.setItem('lf', JSON.stringify({ user: S.user, B, avail }));
  } catch (e) {}
}

const $ = (id) => document.getElementById(id),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c])
    );

function dk(d, t) {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10) + ' ' + t;
}

const fmt = (k) => {
  const [d, t] = k.split(' ');
  return (
    new Date(d + 'T00:00').toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }) +
    ', ' +
    t
  );
};

const inr = (n) => '₹' + n.toLocaleString('en-IN'),
  cat = (id) => CATS.find((c) => c.id == id),
  pr = (id) => P.find((p) => p.id == id);

function rating(p) {
  const rv = B.filter((b) => b.pid == p.id && b.rv);
  return {
    r: (
      (p.r * p.jobs + rv.reduce((a, b) => a + b.rv.s, 0)) /
      (p.jobs + rv.length)
    ).toFixed(1),
    n: p.jobs + rv.length,
    rv,
  };
}

function taken(pid, k) {
  return (
    B.some(
      (b) =>
        b.pid == pid &&
        b.slot == k &&
        ['Requested', 'Confirmed'].includes(b.status)
    ) || k.split('').reduce((a, c) => a + c.charCodeAt(0), pid) % 5 == 0
  );
}

function toast(m) {
  $('tt').innerHTML = '<div class="toast" role="status">' + esc(m) + '</div>';
  setTimeout(() => ($('tt').innerHTML = ''), 2600);
}

function go(v, o) {
  Object.assign(S, { view: v }, o || {});
  render();
  scrollTo(0, 0);
}

function avatar(p) {
  return (
    '<div class="av" style="background:' +
    COL[p.id % 5] +
    '">' +
    p.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('') +
    '</div>'
  );
}

function head() {
  let h = '<div class="logo" data-a="go" data-v="home">Local<b>Fix</b></div>';
  if (S.user) {
    h +=
      '<nav>' +
      (S.role == 'c'
        ? '<button data-a="go" data-v="home" class="' +
          (['home', 'list', 'profile', 'book'].includes(S.view) ? 'on' : '') +
          '">Book</button><button data-a="go" data-v="bks" class="' +
          (S.view == 'bks' ? 'on' : '') +
          '">My bookings</button>'
        : '<button class="on">Provider dashboard</button>') +
      '</nav><button class="pill" data-a="role" title="Demo: switch between customer and provider">' +
      (S.role == 'c' ? 'Switch to provider' : 'Switch to customer') +
      '</button><button class="pill" data-a="out">Log out</button>';
  }
  $('hd').innerHTML = h;
}

function slotPicker(pid, sel, key) {
  let h = '';
  for (let d = 0; d < 3; d++) {
    const day = dk(d, '09:00').split(' ')[0];
    h +=
      '<div class="mute">' +
      (d ? fmt(day + ' 00:00').split(',')[0] : 'Today') +
      '</div><div class="slots">' +
      TIMES.map((t) => {
        const k = day + ' ' + t,
          past = d == 0 && parseInt(t) <= new Date().getHours() + 1;
        const off = taken(pid, k) || past || avail[pid] === false;
        return (
          '<button class="slot ' +
          (sel == k ? 'on' : '') +
          '" ' +
          (off ? 'disabled' : '') +
          ' data-a="' +
          key +
          '" data-k="' +
          k +
          '">' +
          t +
          '</button>'
        );
      }).join('') +
      '</div>';
  }
  return h;
}

function provCard(p) {
  const r = rating(p);
  return (
    '<div class="card"><div class="row">' +
    avatar(p) +
    '<div><h3>' +
    esc(p.name) +
    '</h3><div class="mute">' +
    cat(p.cat).n +
    ' · ' +
    p.exp +
    ' yrs · ' +
    p.area +
    '</div></div></div><div class="row sp" style="margin-top:12px"><div>' +
    (p.ver
      ? '<span class="tag ver">✓ Verified</span> '
      : '<span class="tag t-Requested">Verification pending</span> ') +
    '<b>★ ' +
    r.r +
    '</b> <span class="mute">(' +
    r.n +
    ')</span></div><div><div class="mute">Visit from</div><b>' +
    inr(p.price) +
    '</b></div></div><button class="btn s sm" style="margin-top:12px;width:100%" data-a="prof" data-id="' +
    p.id +
    '">View profile and book</button></div>'
  );
}

function listHTML() {
  let l = P.filter(
    (p) =>
      (!S.cat || p.cat == S.cat) &&
      (!S.ver || p.ver) &&
      (!S.max || p.price <= S.max) &&
      (!S.q ||
        (p.name + cat(p.cat).n).toLowerCase().includes(S.q.toLowerCase()))
  );
  l.sort((a, b) =>
    S.sort == 'price' ? a.price - b.price : rating(b).r - rating(a).r
  );
  return l.length
    ? '<div class="grid g2">' + l.map(provCard).join('') + '</div>'
    : '<div class="card"><b>No professionals match.</b><div class="mute">Clear the price limit or the verified-only filter to see more.</div></div>';
}

function status(b) {
  return '<span class="tag t-' + b.status + '">' + b.status + '</span>';
}

function view() {
  const v = S.view;
  if (v == 'login')
    return '<div class="card" style="max-width:420px;margin:30px auto"><h2>Welcome to LocalFix</h2><p class="mute">Verified electricians, plumbers, AC technicians and cleaners. Log in to book.</p><label for="nm">Your name</label><input id="nm" autocomplete="name"><label for="ph">Mobile number</label><input id="ph" inputmode="numeric" maxlength="10" placeholder="10-digit number"><label for="ot">OTP</label><input id="ot" inputmode="numeric" maxlength="4" placeholder="Demo OTP: 1234"><div class="err" id="err" role="alert"></div><button class="btn" style="width:100%;margin-top:8px" data-a="login">Log in</button></div>';
  if (v == 'home')
    return (
      '<div class="hero"><h1>Book a verified pro, at a price you see first.</h1><p>Pick a service, choose a free slot, and track the booking until the job is done.</p><div class="row"><input id="q" placeholder="Search a service or a name" style="max-width:340px" value="' +
      esc(S.q) +
      '"><button class="btn" data-a="search">Search</button></div></div><h2 style="margin-bottom:12px">What needs fixing?</h2><div class="grid g3">' +
      CATS.map(
        (c) =>
          '<button class="cat" data-a="cat" data-id="' +
          c.id +
          '"><span>' +
          c.e +
          '</span><b>' +
          c.n +
          '</b><div class="mute">from ' +
          inr(Math.min(...c.s.map((x) => x[1]))) +
          '</div></button>'
      ).join('') +
      '</div><h2 style="margin:26px 0 12px">Why you can trust a LocalFix pro</h2><div class="grid g2"><div class="card"><b>Checked before listing</b><div class="mute">ID, address and skill check are completed before a “Verified” badge appears.</div></div><div class="card"><b>Price shown before you confirm</b><div class="mute">Service price and platform fee are listed. Parts are quoted and need your approval.</div></div><div class="card"><b>Reviews from real jobs only</b><div class="mute">Only customers with a completed booking can rate.</div></div></div>'
    );
  if (v == 'list') {
    return (
      '<button class="back" data-a="go" data-v="home">← Back</button><h2 style="margin-bottom:12px">' +
      (S.cat ? cat(S.cat).n + ' professionals' : 'All professionals') +
      '</h2><div class="row" style="margin-bottom:14px"><input id="q" placeholder="Search" style="max-width:220px" value="' +
      esc(S.q) +
      '" aria-label="Search"><select id="sort" style="width:auto" aria-label="Sort"><option value="rating">Top rated</option><option value="price"' +
      (S.sort == 'price' ? ' selected' : '') +
      '>Lowest price</option></select><select id="max" style="width:auto" aria-label="Max price"><option value="0">Any price</option>' +
      [300, 400, 500]
        .map(
          (m) =>
            '<option value="' +
            m +
            '"' +
            (S.max == m ? ' selected' : '') +
            '>Up to ' +
            inr(m) +
            '</option>'
        )
        .join('') +
      '</select><label class="row" style="margin:0"><input type="checkbox" id="ver" style="width:auto"' +
      (S.ver ? ' checked' : '') +
      '> Verified only</label></div><div id="list">' +
      listHTML() +
      '</div>'
    );
  }
  if (v == 'profile') {
    const p = pr(S.pid),
      r = rating(p),
      c = cat(p.cat);
    return (
      '<button class="back" data-a="go" data-v="list">← Back to results</button><div class="card"><div class="row">' +
      avatar(p) +
      '<div><h2>' +
      esc(p.name) +
      '</h2><div class="mute">' +
      c.n +
      ' · ' +
      p.exp +
      ' years · ' +
      p.area +
      '</div></div></div><p>' +
      esc(p.about) +
      '</p><div class="row">' +
      (p.ver
        ? '<span class="tag ver">✓ ID, address and skills verified</span>'
        : '<span class="tag t-Requested">Verification in progress</span>') +
      '<b>★ ' +
      r.r +
      '</b><span class="mute">' +
      r.n +
      ' jobs</span></div><h3 style="margin:18px 0 8px">Services and fixed prices</h3><table class="sum" style="width:100%">' +
      c.s
        .map(
          (s) =>
            '<tr><td>' +
            s[0] +
            '</td><td>' +
            inr(s[1] + (p.price - c.s[0][1] > 0 ? p.price - c.s[0][1] : 0)) +
            '</td></tr>'
        )
        .join('') +
      '</table><button class="btn" style="margin-top:14px" data-a="book" data-id="' +
      p.id +
      '"' +
      (avail[p.id] === false ? ' disabled' : '') +
      '>' +
      (avail[p.id] === false ? 'Not taking requests now' : 'Book this pro') +
      '</button></div><h3 style="margin:20px 0 8px">Recent reviews</h3>' +
      (r.rv.length
        ? r.rv
            .map(
              (b) =>
                '<div class="card" style="margin-bottom:8px"><b>' +
                '★'.repeat(b.rv.s) +
                '</b> ' +
                esc(b.rv.t || '') +
                '<div class="mute">' +
                esc(b.un || 'Customer') +
                '</div></div>'
            )
            .join('')
        : '<div class="mute">New reviews will appear here after completed jobs.</div>')
    );
  }
  if (v == 'book') {
    const p = pr(S.pid),
      c = cat(p.cat),
      b = S.bk,
      adj = p.price - c.s[0][1],
      sv = b.svc != null ? c.s[b.svc] : null,
      pr_ = sv ? sv[1] + Math.max(adj, 0) : 0;
    return (
      '<button class="back" data-a="prof" data-id="' +
      p.id +
      '">← Back to profile</button><h2 style="margin-bottom:12px">Book ' +
      esc(p.name) +
      '</h2><div class="grid g2"><div class="card"><h3>1. Service</h3>' +
      c.s
        .map(
          (s, i) =>
            '<label class="opt ' +
            (b.svc === i ? 'on' : '') +
            '"><input type="radio" name="svc" data-a="svc" data-i="' +
            i +
            '"' +
            (b.svc === i ? ' checked' : '') +
            '><span>' +
            s[0] +
            '<br><b>' +
            inr(s[1] + Math.max(adj, 0)) +
            '</b></span></label>'
        )
        .join('') +
      '<h3 style="margin-top:14px">2. Time slot</h3>' +
      slotPicker(p.id, b.slot, 'slot') +
      '</div><div class="card"><h3>3. Address</h3><label for="ad">House / street / landmark</label><textarea id="ad" rows="2">' +
      esc(b.addr || '') +
      '</textarea><label for="pin">Pincode</label><input id="pin" inputmode="numeric" maxlength="6" value="' +
      esc(b.pin || '') +
      '"><h3 style="margin-top:16px">4. Payment</h3><label class="opt ' +
      (b.pay != 'now' ? 'on' : '') +
      '"><input type="radio" name="pay" data-a="pay" data-v="later"' +
      (b.pay != 'now' ? ' checked' : '') +
      '><span>Pay after service<br><span class="mute">Cash or UPI to the pro</span></span></label><label class="opt ' +
      (b.pay == 'now' ? 'on' : '') +
      '"><input type="radio" name="pay" data-a="pay" data-v="now"' +
      (b.pay == 'now' ? ' checked' : '') +
      '><span>Pay online now<br><span class="mute">UPI, card or netbanking</span></span></label><table class="sum" style="width:100%;margin-top:10px"><tr><td>Service price</td><td>' +
      (sv ? inr(pr_) : '—') +
      '</td></tr><tr><td>Platform fee</td><td>' +
      inr(FEE) +
      '</td></tr><tr class="tot"><td>Total</td><td>' +
      (sv ? inr(pr_ + FEE) : '—') +
      '</td></tr></table><div class="mute">Parts, if needed, are quoted first and need your OK.</div><div class="err" id="err" role="alert"></div><button class="btn" id="cf" style="width:100%" data-a="confirm">Confirm booking</button></div></div>'
    );
  }
  if (v == 'done') {
    const b = B.find((x) => x.id == S.rid),
      p = pr(b.pid);
    return (
      '<div class="card" style="max-width:520px;margin:20px auto;text-align:center"><div class="big" style="color:var(--ok)">Request sent ✓</div><p>Booking <b>' +
      b.id +
      '</b> with ' +
      esc(p.name) +
      '<br>' +
      fmt(b.slot) +
      '</p><p class="mute">The pro will confirm shortly. You can track status, reschedule or cancel from My bookings.</p><div class="row" style="justify-content:center"><button class="btn" data-a="go" data-v="bks">Track booking</button><button class="btn s" data-a="go" data-v="home">Book another</button></div></div>'
    );
  }
  if (v == 'bks') {
    const l = B.filter((b) => b.u == S.user.phone);
    return (
      '<h2 style="margin-bottom:12px">My bookings</h2>' +
      (l.length
        ? '<div class="grid">' +
          l
            .slice()
            .reverse()
            .map((b) => {
              const p = pr(b.pid),
                open = ['Requested', 'Confirmed'].includes(b.status);
              return (
                '<div class="card"><div class="row sp"><b>' +
                b.svc +
                ' · ' +
                esc(p.name) +
                '</b>' +
                status(b) +
                '</div><div class="mute">' +
                b.id +
                ' · ' +
                fmt(b.slot) +
                ' · ' +
                inr(b.price + FEE) +
                ' · ' +
                (b.pay == 'now' ? 'Paid online' : 'Pay after service') +
                '</div><div class="mute">' +
                esc(b.addr) +
                '</div><div class="row" style="margin-top:10px">' +
                (open
                  ? '<button class="btn s sm" data-a="rs" data-id="' +
                    b.id +
                    '">Reschedule</button><button class="btn d sm" data-a="cancel" data-id="' +
                    b.id +
                    '">Cancel (free)</button>'
                  : '') +
                (b.status == 'Completed' && !b.rv
                  ? '<button class="btn sm" data-a="rvo" data-id="' +
                    b.id +
                    '">Rate this service</button>'
                  : '') +
                (b.rv
                  ? '<span class="mute">You rated ' +
                    '★'.repeat(b.rv.s) +
                    '</span>'
                  : '') +
                '</div>' +
                (S.rv == b.id
                  ? '<div class="stars" style="margin-top:8px">' +
                    [1, 2, 3, 4, 5]
                      .map(
                        (i) =>
                          '<button aria-label="' +
                          i +
                          ' stars" class="' +
                          (i <= S.rs ? 'on' : '') +
                          '" data-a="star" data-i="' +
                          i +
                          '">★</button>'
                      )
                      .join('') +
                    '<textarea id="rt" rows="2" placeholder="How was the service?"></textarea><button class="btn sm" style="margin-top:8px" data-a="rsub" data-id="' +
                    b.id +
                    '">Submit review</button></div>'
                  : '') +
                '</div>'
              );
            })
            .join('') +
          '</div>'
        : '<div class="card"><b>No bookings yet.</b><div class="mute">Pick a service to book your first pro.</div><button class="btn" style="margin-top:10px" data-a="go" data-v="home">Browse services</button></div>')
    );
  }
  if (v == 'resched') {
    const b = B.find((x) => x.id == S.rid);
    return (
      '<button class="back" data-a="go" data-v="bks">← Back</button><div class="card"><h2>Reschedule ' +
      b.id +
      '</h2><p class="mute">Current: ' +
      fmt(b.slot) +
      '</p>' +
      slotPicker(b.pid, S.ns, 'ns') +
      '<button class="btn" data-a="rssave"' +
      (S.ns ? '' : ' disabled') +
      '>Save new time</button></div>'
    );
  }
  if (v == 'dash') {
    const p = pr(S.asP),
      l = B.filter((b) => b.pid == p.id),
      done = l.filter((b) => b.status == 'Completed');
    return (
      '<h2 style="margin-bottom:12px">Provider dashboard</h2><div class="card row sp"><div class="row">' +
      avatar(p) +
      '<div><select id="asp" aria-label="Demo provider">' +
      P.map(
        (x) =>
          '<option value="' +
          x.id +
          '"' +
          (x.id == p.id ? ' selected' : '') +
          '>' +
          esc(x.name) +
          '</option>'
      ).join('') +
      '</select></div></div><label class="row" style="margin:0"><input type="checkbox" id="av" style="width:auto"' +
      (avail[p.id] !== false ? ' checked' : '') +
      '> Accepting new requests</label></div><div class="grid g3" style="margin:12px 0"><div class="card"><div class="big">' +
      l.filter((b) => b.status == 'Requested').length +
      '</div><div class="mute">New requests</div></div><div class="card"><div class="big">' +
      l.filter((b) => b.status == 'Confirmed').length +
      '</div><div class="mute">Upcoming</div></div><div class="card"><div class="big">' +
      done.length +
      '</div><div class="mute">Completed</div></div><div class="card"><div class="big">' +
      inr(done.reduce((a, b) => a + b.price, 0)) +
      '</div><div class="mute">Earned</div></div></div>' +
      (l.length
        ? '<div class="grid">' +
          l
            .slice()
            .reverse()
            .map(
              (b) =>
                '<div class="card"><div class="row sp"><b>' +
                b.svc +
                ' · ' +
                esc(b.un || 'Customer') +
                '</b>' +
                status(b) +
                '</div><div class="mute">' +
                b.id +
                ' · ' +
                fmt(b.slot) +
                ' · ' +
                inr(b.price) +
                '</div><div class="mute">' +
                esc(b.addr) +
                '</div><div class="row" style="margin-top:10px">' +
                (b.status == 'Requested'
                  ? '<button class="btn sm" data-a="pst" data-id="' +
                    b.id +
                    '" data-s="Confirmed">Accept</button><button class="btn d sm" data-a="pst" data-id="' +
                    b.id +
                    '" data-s="Declined">Decline</button>'
                  : '') +
                (b.status == 'Confirmed'
                  ? '<button class="btn sm" data-a="pst" data-id="' +
                    b.id +
                    '" data-s="Completed">Mark completed</button>'
                  : '') +
                '</div></div>'
            )
            .join('') +
          '</div>'
        : '<div class="card mute">No requests yet. Book as a customer, then switch back here.</div>')
    );
  }
  return '';
}

function render() {
  head();
  $('app').innerHTML =
    S.role == 'p' && S.user ? view.call(0, (S.view = 'dash')) : view();
}

const A = {
  go: (d) => go(d.v),
  role: () => {
    S.role = S.role == 'c' ? 'p' : 'c';
    go(S.role == 'c' ? 'home' : 'dash');
  },
  out: () => {
    S.user = null;
    S.role = 'c';
    save();
    go('login');
  },
  login() {
    const n = $('nm').value.trim(),
      p = $('ph').value.trim(),
      o = $('ot').value.trim(),
      e = $('err');
    if (n.length < 2) return (e.textContent = 'Enter your name.');
    if (!/^[6-9]\d{9}$/.test(p))
      return (e.textContent = 'Enter a valid 10-digit Indian mobile number.');
    if (o != '1234')
      return (e.textContent = 'OTP is incorrect. Use 1234 in this demo.');
    S.user = { name: n, phone: p };
    save();
    go('home');
  },
  search() {
    S.q = $('q').value;
    S.cat = null;
    go('list');
  },
  cat: (d) => go('list', { cat: d.id, q: '' }),
  prof: (d) => go('profile', { pid: +d.id }),
  book: (d) => go('book', { pid: +d.id, bk: { pay: 'later' } }),
  svc: (d) => {
    keep();
    S.bk.svc = +d.i;
    render();
  },
  slot: (d) => {
    keep();
    S.bk.slot = d.k;
    render();
  },
  pay: (d) => {
    keep();
    S.bk.pay = d.v;
    render();
  },
  confirm() {
    keep();
    const b = S.bk,
      e = $('err'),
      p = pr(S.pid);
    if (b.svc == null) return (e.textContent = 'Choose a service.');
    if (!b.slot) return (e.textContent = 'Choose a time slot.');
    if (!b.addr || b.addr.length < 6)
      return (e.textContent = 'Enter your full address.');
    if (!/^\d{6}$/.test(b.pin || ''))
      return (e.textContent = 'Enter a 6-digit pincode.');
    if (taken(p.id, b.slot))
      return (e.textContent = 'That slot was just taken. Pick another.');
    $('cf').disabled = true;
    const c = cat(p.cat),
      adj = Math.max(p.price - c.s[0][1], 0),
      id =
        'LF-' + (1000 + B.length + 1 + Math.floor(Math.random() * 9));
    B.push({
      id,
      pid: p.id,
      cat: p.cat,
      svc: c.s[b.svc][0],
      price: c.s[b.svc][1] + adj,
      slot: b.slot,
      addr: b.addr + ' - ' + b.pin,
      u: S.user.phone,
      un: S.user.name,
      pay: b.pay,
      status: 'Requested',
      rv: null,
    });
    save();
    go('done', { rid: id });
  },
  cancel: (d) => {
    B.find((b) => b.id == d.id).status = 'Cancelled';
    save();
    render();
    toast('Booking cancelled');
  },
  rs: (d) => go('resched', { rid: d.id, ns: null }),
  ns: (d) => {
    S.ns = d.k;
    render();
  },
  rssave() {
    B.find((b) => b.id == S.rid).slot = S.ns;
    save();
    toast('Booking rescheduled');
    go('bks');
  },
  rvo: (d) => {
    S.rv = d.id;
    S.rs = 0;
    render();
  },
  star: (d) => {
    S.rs = +d.i;
    const t = $('rt').value;
    render();
    $('rt').value = t;
  },
  rsub(d) {
    if (!S.rs) return toast('Choose a star rating');
    B.find((b) => b.id == d.id).rv = {
      s: S.rs,
      t: $('rt').value.trim(),
    };
    S.rv = null;
    save();
    render();
    toast('Thanks for your review');
  },
  pst: (d) => {
    B.find((b) => b.id == d.id).status = d.s;
    save();
    render();
    toast('Booking ' + d.s.toLowerCase());
  },
};

function keep() {
  const a = $('ad'),
    p = $('pin');
  if (a) S.bk.addr = a.value;
  if (p) S.bk.pin = p.value;
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-a]');
  if (
    t &&
    A[t.dataset.a] &&
    !(t.tagName == 'INPUT' && t.type == 'radio' && e.type == 'click' && false)
  )
    A[t.dataset.a](t.dataset);
});

document.addEventListener('change', (e) => {
  const i = e.target.id;
  if (i == 'sort' || i == 'max' || i == 'ver') {
    S.sort = $('sort').value;
    S.max = +$('max').value;
    S.ver = $('ver').checked ? 1 : 0;
    $('list').innerHTML = listHTML();
  }
  if (i == 'asp') {
    S.asP = +e.target.value;
    render();
  }
  if (i == 'av') {
    avail[S.asP] = e.target.checked;
    save();
    render();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id == 'q' && S.view == 'list') {
    S.q = e.target.value;
    $('list').innerHTML = listHTML();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && e.target.id == 'q' && S.view == 'home') A.search();
});

render();
