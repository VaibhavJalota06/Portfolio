// Runs after `vite build`: writes static, crawlable HTML pages into dist/ (one per service,
// one per guide in guides.mjs, a /guides index) plus dist/sitemap.xml. Reuses the built CSS + GA tag from dist/index.html so pages match the site.
// Tailwind scans this file, so classes used below end up in the CSS bundle.
import fs from 'node:fs';
import { guides } from './guides.mjs';

const SITE = 'https://cutframestudio.in';
const WA = 'https://wa.me/919217584204';
const dist = new URL('../dist/', import.meta.url);

const services = [
  {
    slug: 'reels-video-editing-delhi',
    nav: 'Reels & Video Editing',
    title: 'Reels & Video Editing Services in Delhi | Cutframe Studio',
    description: 'High-retention reels, YouTube Shorts and long-form video editing in Delhi. On-site shoots across Delhi NCR, editing for brands and creators across India.',
    h1: 'Reels & Video Editing in Delhi',
    answer: 'Cutframe Studio edits high-retention Instagram Reels, YouTube Shorts and long-form YouTube videos for brands, businesses and creators. We shoot on-site across Delhi NCR, or edit footage you send us from anywhere in India.',
    body: 'Every edit is built to keep people watching: a strong hook in the first three seconds, clean word-by-word captions, music, sound effects and B-roll, and pacing that holds attention to the last frame. You review every video before it goes live.',
    deliverables: ['Strong first-3-second hooks', 'Clean word-by-word captions', 'Music, sound effects and B-roll', 'Cuts, zooms and pacing for retention', 'Exported in 9:16 for Reels & Shorts', 'On-site shoots with camera, lighting and audio across Delhi NCR'],
    faqs: [
      ['Do I have to record the videos myself?', 'Not necessarily. For clients in Delhi NCR, our team can come to your office, store or workspace with professional cameras, lighting and audio to record everything for you. If you already have footage or are elsewhere in India, share your raw files via Google Drive or WhatsApp.'],
      ['Can you make reels if I don’t have time to record?', 'Yes. We create engaging videos using motion graphics, AI visuals, licensed B-roll and custom animations, so your brand stays active without you stepping in front of a camera.'],
      ['What happens if I want changes?', 'You review every reel before it goes live. Tell us what to change and we update it until you are satisfied.'],
    ],
  },
  {
    slug: 'instagram-page-management',
    nav: 'Instagram Page Management',
    title: 'Instagram & Social Media Page Management in Delhi | Cutframe Studio',
    description: 'Monthly Instagram and social media page management for brands and businesses: content strategy, posting calendar, captions, scheduled posting and profile cleanup.',
    h1: 'Instagram & Social Media Page Management',
    answer: 'Cutframe Studio manages Instagram and social media pages for brands and businesses in Delhi and across India. Each month we plan your content, write the captions, post on schedule and keep your profile looking consistent and trustworthy.',
    body: 'You get one team handling strategy, reels, designs and posting, so your page stays active without you chasing freelancers. Plans are monthly, with flexible terms and no long-term lock-in.',
    deliverables: ['Monthly content strategy', 'Monthly content & posting calendar', 'Captions and hashtags written for you', 'Regular scheduled posting', 'Profile, bio and highlights cleanup'],
    faqs: [
      ['Who do you work with?', 'Brands and businesses of all sizes: product and e-commerce brands, founders, creators, local businesses and service companies that want strong social media growth.'],
      ['Do you only work in Delhi NCR?', 'We film on-site across Delhi NCR, and handle editing, design and page management for clients all over India and internationally.'],
      ['How much does it cost?', 'It depends on how much content you need, whether you need on-site shooting, and how much of the page we run. After a short discovery call we give you a transparent monthly quote with no hidden fees.'],
    ],
  },
  {
    slug: 'graphic-design',
    nav: 'Graphic Design',
    title: 'Social Media Graphic Design: Posts, Posters & Carousels | Cutframe Studio',
    description: 'Instagram posts, carousels, festival and offer posters, thumbnails and print designs in your brand’s colors and style. Designed in Delhi for brands across India.',
    h1: 'Graphic Design for Social Media & Print',
    answer: 'Cutframe Studio designs Instagram posts, carousels, festival and offer posters, thumbnails and print material that explain your services clearly and match your brand’s colors and style.',
    body: 'Designs are built in Photoshop and CorelDraw and kept consistent across your accounts, so customers recognise your brand at a glance.',
    deliverables: ['Social media posts and carousels', 'Festival and offer posters', 'Thumbnails and reel covers', 'Print designs (flyers, cards, packaging)', 'A consistent look across your accounts'],
    faqs: [
      ['What happens if I want changes?', 'You review every design before it goes live. Tell us what to change and we update it until you are satisfied.'],
      ['Do you only work in Delhi NCR?', 'No. Design work is fully remote, so we work with clients all over India and internationally.'],
    ],
  },
  {
    slug: 'ai-videos',
    nav: 'AI Videos',
    title: 'AI Videos, AI Avatars & AI Creatives for Brands | Cutframe Studio',
    description: 'AI avatar explainer videos, AI-generated scenes, B-roll and animated characters for reels and ads, combined with real editing for a polished finish.',
    h1: 'AI Videos & AI Creatives',
    answer: 'Cutframe Studio creates AI avatar videos, AI-generated scenes and B-roll, and animated characters to explain your products and ideas, useful when you don’t have footage or want something eye-catching.',
    body: 'AI visuals are combined with real editing — captions, sound design and pacing — so the result looks polished and on-brand rather than generic.',
    deliverables: ['AI avatar and explainer videos', 'AI-generated scenes and B-roll', 'Animated characters for awareness reels', 'AI images for posts and ads', 'Combined with real editing for a polished finish'],
    faqs: [
      ['Can you make reels if I don’t have time to record?', 'Yes. AI visuals, motion graphics and licensed B-roll let us keep your brand active without you stepping in front of a camera.'],
      ['How much does it cost?', 'It depends on volume and complexity. After a short discovery call we give you a transparent quote with no hidden fees.'],
    ],
  },
  {
    slug: 'website-design',
    nav: 'Website Design',
    title: 'Website Design & Development in Delhi | Cutframe Studio',
    description: 'Fast, mobile-first websites for brands and businesses: landing pages, brand sites, portfolios and catalogs with SEO, WhatsApp chat and contact forms built in.',
    h1: 'Website Design & Development',
    answer: 'Cutframe Studio designs and builds fast, mobile-first websites — landing pages, brand sites, portfolios and product catalogs — with SEO, WhatsApp click-to-chat and contact forms built in, typically delivered in 5 to 10 business days.',
    body: 'Sites are custom-designed to look premium on phones first and to turn visitors into enquiries. We also help with domain setup and hosting, and can keep the site updated after launch.',
    deliverables: ['Custom responsive design (mobile-first)', 'Fast-loading, SEO-optimized pages', 'Contact forms, booking and WhatsApp integration', 'Domain setup and hosting guidance', 'Ongoing maintenance and content updates'],
    faqs: [
      ['How do your website projects work?', 'We agree the pages and content on a short call, design and build the site, and deliver it typically within 5 to 10 business days, with SEO, WhatsApp click-to-chat and contact forms built in.'],
      ['How much does it cost?', 'It depends on the number of pages and features. After a short discovery call we give you a transparent quote with no hidden fees.'],
    ],
  },
];

// Menu links (same as the homepage menu bar). Homepage sections use /#id so they work from any page.
const NAV = [['Work', '/#work'], ['Services', '/#services'], ['Post-Production', '/post-production/'], ['Process', '/#process'], ['About', '/#about'], ['Apps', '/apps/'], ['Guides', '/guides'], ['FAQ', '/#faq']];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script> must not contain "</".
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const shell = fs.readFileSync(new URL('index.html', dist), 'utf8');
const head = [...shell.matchAll(/<link rel="stylesheet"[^>]*>|<script async src="https:\/\/www\.googletagmanager[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/g)].map((m) => m[0]).join('\n    ');

// Shared document shell for every static page (service pages, guides, guides index).
const doc = ({ title, description, url, type = 'website', graph, crumb, main }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#08080b" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${SITE}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    ${head}
    ${ld({
      '@context': 'https://schema.org',
      '@graph': [
        ...graph,
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cutframe Studio', item: SITE },
          ...crumb.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 2, name, item })) ] },
      ],
    })}
  </head>
  <body class="cf font-sans antialiased">
    <!-- Same dark menu bar as the homepage (plain HTML: a <details> dropdown works as the phone menu) -->
    <header class="cf-header" style="position:sticky">
      <div class="cf-wrap flex items-center justify-between h-16 gap-4">
        <a href="/" class="flex items-center gap-2.5 shrink-0" aria-label="Cutframe Studio home">
          <svg class="cf-logo-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#e10600"/><g stroke="#fff" stroke-width="5.5" stroke-linecap="square"><path d="M14 24V14H24"/><path d="M40 14H50V24"/><path d="M50 40V50H40"/><path d="M24 50H14V40"/></g><path d="M24.5 39.5 39.5 24.5" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>
          <span class="cf-logo-text">CUTFRAME <span>STUDIO</span></span>
        </a>
        <nav class="hidden lg:flex items-center" aria-label="Main">
          ${NAV.map(([label, href]) => `<a href="${href}" class="cf-navlink">${label}</a>`).join('\n          ')}
        </nav>
        <div class="flex items-center gap-2">
          <a href="${WA}" class="cf-btn cf-btn-red cf-btn-sm"><span class="hidden sm:inline">Book a free call</span><span class="sm:hidden">Book call</span></a>
          <details class="cf-menu lg:hidden">
            <summary class="w-10 h-10 grid place-items-center rounded-lg border border-[#23232c] text-white cursor-pointer" aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </summary>
            <nav class="cf-menu-panel" aria-label="Mobile">
              ${NAV.map(([label, href]) => `<a href="${href}">${label}</a>`).join('\n              ')}
            </nav>
          </details>
        </div>
      </div>
    </header>

    <main class="cf-wrap">
      <nav aria-label="Breadcrumb" class="pt-6 text-sm text-[#8b8b98]"><a href="/" class="hover:text-white">Home</a>${crumb.map(([name, item], i) => i === crumb.length - 1 ? ` / <span>${esc(name)}</span>` : ` / <a href="${item.replace(SITE, '')}" class="hover:text-white">${esc(name)}</a>`).join('')}</nav>
${main}
    </main>

    <footer class="cf-foot mt-10 border-t border-[#23232c] text-sm">
      <div class="cf-wrap py-10 flex flex-col gap-5">
        <a href="/" class="flex items-center gap-2.5"><svg class="cf-logo-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#e10600"/><g stroke="#fff" stroke-width="5.5" stroke-linecap="square"><path d="M14 24V14H24"/><path d="M40 14H50V24"/><path d="M50 40V50H40"/><path d="M24 50H14V40"/></g><path d="M24.5 39.5 39.5 24.5" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg><span class="cf-logo-text">CUTFRAME <span>STUDIO</span></span></a>
        <nav aria-label="Services" class="flex flex-wrap gap-x-5 gap-y-1 text-[#c9c9d2]">
          ${services.map((o) => `<a href="/${o.slug}" class="py-1">${esc(o.nav)}</a>`).join('\n          ')}
          <a href="/guides" class="py-1">Guides</a>
          <a href="/post-production/" class="py-1">Post-Production</a>
          <a href="/apps/" class="py-1">Apps</a>
        </nav>
        <div class="flex flex-col sm:flex-row gap-3 justify-between text-[#8b8b98]">
          <span>© Cutframe Studio · Delhi, India</span>
          <span><a href="mailto:vaibhav@cutframestudio.in">vaibhav@cutframestudio.in</a> · <a href="${WA}">+91 92175 84204</a> · <a href="https://instagram.com/studiocutframe">@studiocutframe</a></span>
        </div>
      </div>
    </footer>
  </body>
</html>
`;

const faqSection = (faqs) => `
      <section class="py-10 border-t border-[#23232c]">
        <h2 class="cf-display text-2xl sm:text-3xl font-bold">Frequently asked questions</h2>
        <div class="mt-6 divide-y divide-[#23232c]">
          ${faqs.map(([q, a]) => `<details class="py-4"><summary class="font-semibold cursor-pointer">${esc(q)}</summary><p class="mt-2 text-[#a9a9b6] leading-relaxed">${esc(a)}</p></details>`).join('\n          ')}
        </div>
      </section>`;

const PROVIDER = { '@type': 'ProfessionalService', name: 'Cutframe Studio', url: SITE, telephone: '+91-92175-84204' };
const AUTHOR = { '@type': 'Person', name: 'Vaibhav Jalota', jobTitle: 'Founder, Cutframe Studio', url: SITE };

const servicePage = (s) => {
  const url = `${SITE}/${s.slug}`;
  const others = services.filter((o) => o !== s);
  const related = guides.filter((g) => g.services.includes(s.slug));
  return doc({
    title: s.title, description: s.description, url,
    graph: [{ '@type': 'Service', name: s.h1, description: s.description, url, serviceType: s.nav,
      areaServed: [{ '@type': 'City', name: 'Delhi' }, { '@type': 'Country', name: 'India' }], provider: PROVIDER }],
    crumb: [[s.nav, url]],
    main: `
      <section class="py-10 sm:py-16">
        <h1 class="cf-wide text-3xl sm:text-5xl">${esc(s.h1)}</h1>
        <p class="mt-5 text-lg text-[#d4d4dc] leading-relaxed max-w-3xl">${esc(s.answer)}</p>
        <p class="mt-4 text-[#a9a9b6] leading-relaxed max-w-3xl">${esc(s.body)}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="${WA}?text=${encodeURIComponent(`Hi, I'm interested in ${s.nav}.`)}" class="inline-flex items-center rounded-full bg-[#e10600] hover:bg-[#c00500] text-white font-semibold px-6 py-3">WhatsApp us</a>
          <a href="/#work" class="inline-flex items-center rounded-full border border-[#3a3a46] hover:border-[#8b8b98] font-semibold px-6 py-3">See our work</a>
        </div>
      </section>

      <section class="py-10 border-t border-[#23232c]">
        <h2 class="cf-display text-2xl sm:text-3xl font-bold">What’s included</h2>
        <ul class="mt-6 grid sm:grid-cols-2 gap-3">
          ${s.deliverables.map((d) => `<li class="rounded-xl bg-[#131319] border border-[#23232c] px-4 py-3">${esc(d)}</li>`).join('\n          ')}
        </ul>
      </section>

      <section class="py-10 border-t border-[#23232c]">
        <h2 class="cf-display text-2xl sm:text-3xl font-bold">How it works</h2>
        <ol class="mt-6 grid sm:grid-cols-3 gap-4">
          <li class="rounded-xl border border-[#23232c] p-5"><strong class="block text-[#ff6b63]">Free call</strong><span class="text-[#a9a9b6]">We learn about your brand and goals.</span></li>
          <li class="rounded-xl border border-[#23232c] p-5"><strong class="block text-[#ff6b63]">Plan &amp; create</strong><span class="text-[#a9a9b6]">We plan, shoot or design, and edit.</span></li>
          <li class="rounded-xl border border-[#23232c] p-5"><strong class="block text-[#ff6b63]">Review &amp; publish</strong><span class="text-[#a9a9b6]">You approve everything before it goes live.</span></li>
        </ol>
      </section>
${faqSection(s.faqs)}
${related.length ? `
      <section class="py-10 border-t border-[#23232c]">
        <h2 class="cf-display text-xl font-bold">Helpful guides</h2>
        <ul class="mt-4 flex flex-col gap-2">
          ${related.map((g) => `<li><a href="/guides/${g.slug}" class="text-[#ff6b63] hover:underline font-medium">${esc(g.h1)}</a></li>`).join('\n          ')}
        </ul>
      </section>` : ''}

      <section class="py-10 border-t border-[#23232c]">
        <h2 class="cf-display text-xl font-bold">Other services</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${others.map((o) => `<li><a href="/${o.slug}" class="inline-block rounded-full border border-[#3a3a46] hover:border-[#8b8b98] hover:text-white px-4 py-2 text-sm">${esc(o.nav)}</a></li>`).join('\n          ')}
        </ul>
      </section>`,
  });
};

const guidePage = (g) => {
  const url = `${SITE}/guides/${g.slug}`;
  const linked = services.filter((s) => g.services.includes(s.slug));
  return doc({
    title: g.title, description: g.description, url, type: 'article',
    graph: [{ '@type': 'Article', headline: g.h1, description: g.description, url, mainEntityOfPage: url,
      datePublished: g.date, dateModified: g.date, author: AUTHOR, publisher: PROVIDER, image: `${SITE}/og-image.jpg` }],
    crumb: [['Guides', `${SITE}/guides`], [g.h1, url]],
    main: `
      <article class="py-10 sm:py-14 max-w-3xl">
        <h1 class="cf-wide text-3xl sm:text-5xl">${esc(g.h1)}</h1>
        <p class="mt-4 text-sm text-[#8b8b98]">By Vaibhav Jalota, founder of Cutframe Studio · <time datetime="${g.date}">${new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
        <p class="mt-6 text-lg text-[#d4d4dc] leading-relaxed">${esc(g.answer)}</p>
        ${g.sections.map((sec) => `
        <h2 class="mt-10 cf-display text-2xl font-bold">${esc(sec.h)}</h2>
        ${(sec.p || []).map((p) => `<p class="mt-4 text-[#d4d4dc] leading-relaxed">${esc(p)}</p>`).join('\n        ')}
        ${sec.list ? `<ul class="mt-4 list-disc pl-6 space-y-2 text-[#d4d4dc] leading-relaxed">${sec.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}`).join('\n')}
        <div class="mt-12 rounded-2xl bg-[#131319] border border-[#23232c] p-6">
          <p class="font-semibold">Want this handled for you?</p>
          <p class="mt-1 text-[#d4d4dc]">${linked.map((s) => `<a href="/${s.slug}" class="text-[#ff6b63] hover:underline">${esc(s.nav)}</a>`).join(' · ')}</p>
          <a href="${WA}?text=${encodeURIComponent(`Hi, I read your guide "${g.h1}" and have a question.`)}" class="mt-4 inline-flex items-center rounded-full bg-[#e10600] hover:bg-[#c00500] text-white font-semibold px-5 py-2.5">Ask us on WhatsApp</a>
        </div>
      </article>
${faqSection(g.faqs)}`,
  });
};

const guidesIndex = () => doc({
  title: 'Guides: Reels, Instagram & Websites for Businesses | Cutframe Studio',
  description: 'Practical guides from Cutframe Studio on Instagram Reels, page management and websites for brands and small businesses in India.',
  url: `${SITE}/guides`,
  graph: [{ '@type': 'CollectionPage', name: 'Cutframe Studio guides', url: `${SITE}/guides` }],
  crumb: [['Guides', `${SITE}/guides`]],
  main: `
      <section class="py-10 sm:py-14">
        <h1 class="cf-wide text-3xl sm:text-5xl">Guides</h1>
        <p class="mt-4 text-lg text-[#d4d4dc] max-w-3xl">Practical advice on Reels, Instagram and websites for brands and small businesses, from the team at Cutframe Studio.</p>
        <ul class="mt-10 grid sm:grid-cols-2 gap-4">
          ${guides.map((g) => `<li class="rounded-2xl border border-[#23232c] p-6 hover:border-[#55555f] transition-colors"><a href="/guides/${g.slug}" class="cf-display text-xl font-bold hover:text-white">${esc(g.h1)}</a><p class="mt-2 text-[#a9a9b6]">${esc(g.description)}</p></li>`).join('\n          ')}
        </ul>
      </section>`,
});

const today = new Date().toISOString().slice(0, 10);
fs.mkdirSync(new URL('guides/', dist), { recursive: true });
for (const s of services) fs.writeFileSync(new URL(`${s.slug}.html`, dist), servicePage(s));
for (const g of guides) fs.writeFileSync(new URL(`guides/${g.slug}.html`, dist), guidePage(g));
fs.writeFileSync(new URL('guides.html', dist), guidesIndex());
const urls = [['', today], ...services.map((s) => [s.slug, today]), ['guides', today], ...guides.map((g) => [`guides/${g.slug}`, g.date])];
fs.writeFileSync(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, d]) => `  <url><loc>${SITE}/${p}</loc><lastmod>${d}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log(`static pages: ${services.length} services, ${guides.length} guides written`);
