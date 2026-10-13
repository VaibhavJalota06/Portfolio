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
    <meta name="theme-color" content="#2563EB" />
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
  <body class="bg-white text-slate-900 font-sans antialiased">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" class="font-display font-bold text-lg">Cutframe <span class="text-blue-600">Studio</span></a>
        <a href="${WA}" class="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2">Book a Free Call</a>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-6">
      <nav aria-label="Breadcrumb" class="pt-6 text-sm text-slate-500"><a href="/" class="hover:text-blue-600">Home</a>${crumb.map(([name, item], i) => i === crumb.length - 1 ? ` / <span>${esc(name)}</span>` : ` / <a href="${item.replace(SITE, '')}" class="hover:text-blue-600">${esc(name)}</a>`).join('')}</nav>
${main}
    </main>

    <footer class="mt-10 bg-slate-900 text-slate-300 text-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
        <nav aria-label="Services" class="flex flex-wrap gap-x-4 gap-y-2">
          ${services.map((o) => `<a href="/${o.slug}" class="hover:text-white py-1">${esc(o.nav)}</a>`).join('\n          ')}
          <a href="/guides" class="hover:text-white py-1">Guides</a>
        </nav>
        <div class="flex flex-col sm:flex-row gap-3 justify-between text-slate-400">
          <span>© Cutframe Studio · Delhi, India</span>
          <span><a href="mailto:vaibhav@cutframestudio.in" class="hover:text-white">vaibhav@cutframestudio.in</a> · <a href="${WA}" class="hover:text-white">+91 92175 84204</a> · <a href="https://instagram.com/studiocutframe" class="hover:text-white">@studiocutframe</a></span>
        </div>
      </div>
    </footer>
  </body>
</html>
`;

const faqSection = (faqs) => `
      <section class="py-10 border-t border-slate-200">
        <h2 class="font-display text-2xl sm:text-3xl font-bold">Frequently asked questions</h2>
        <div class="mt-6 divide-y divide-slate-200">
          ${faqs.map(([q, a]) => `<details class="py-4"><summary class="font-semibold cursor-pointer">${esc(q)}</summary><p class="mt-2 text-slate-600 leading-relaxed">${esc(a)}</p></details>`).join('\n          ')}
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
        <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight">${esc(s.h1)}</h1>
        <p class="mt-5 text-lg text-slate-700 leading-relaxed max-w-3xl">${esc(s.answer)}</p>
        <p class="mt-4 text-slate-600 leading-relaxed max-w-3xl">${esc(s.body)}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="${WA}?text=${encodeURIComponent(`Hi, I'm interested in ${s.nav}.`)}" class="inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">WhatsApp us</a>
          <a href="/#work" class="inline-flex items-center rounded-full border border-slate-300 hover:border-blue-600 font-semibold px-6 py-3">See our work</a>
        </div>
      </section>

      <section class="py-10 border-t border-slate-200">
        <h2 class="font-display text-2xl sm:text-3xl font-bold">What’s included</h2>
        <ul class="mt-6 grid sm:grid-cols-2 gap-3">
          ${s.deliverables.map((d) => `<li class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">${esc(d)}</li>`).join('\n          ')}
        </ul>
      </section>

      <section class="py-10 border-t border-slate-200">
        <h2 class="font-display text-2xl sm:text-3xl font-bold">How it works</h2>
        <ol class="mt-6 grid sm:grid-cols-3 gap-4">
          <li class="rounded-xl border border-slate-200 p-5"><strong class="block text-blue-600">1. Free call</strong><span class="text-slate-600">We learn about your brand and goals.</span></li>
          <li class="rounded-xl border border-slate-200 p-5"><strong class="block text-blue-600">2. Plan &amp; create</strong><span class="text-slate-600">We plan, shoot or design, and edit.</span></li>
          <li class="rounded-xl border border-slate-200 p-5"><strong class="block text-blue-600">3. Review &amp; publish</strong><span class="text-slate-600">You approve everything before it goes live.</span></li>
        </ol>
      </section>
${faqSection(s.faqs)}
${related.length ? `
      <section class="py-10 border-t border-slate-200">
        <h2 class="font-display text-xl font-bold">Helpful guides</h2>
        <ul class="mt-4 flex flex-col gap-2">
          ${related.map((g) => `<li><a href="/guides/${g.slug}" class="text-blue-600 hover:underline font-medium">${esc(g.h1)}</a></li>`).join('\n          ')}
        </ul>
      </section>` : ''}

      <section class="py-10 border-t border-slate-200">
        <h2 class="font-display text-xl font-bold">Other services</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          ${others.map((o) => `<li><a href="/${o.slug}" class="inline-block rounded-full border border-slate-300 hover:border-blue-600 hover:text-blue-600 px-4 py-2 text-sm">${esc(o.nav)}</a></li>`).join('\n          ')}
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
        <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight">${esc(g.h1)}</h1>
        <p class="mt-4 text-sm text-slate-500">By Vaibhav Jalota, founder of Cutframe Studio · <time datetime="${g.date}">${new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
        <p class="mt-6 text-lg text-slate-700 leading-relaxed">${esc(g.answer)}</p>
        ${g.sections.map((sec) => `
        <h2 class="mt-10 font-display text-2xl font-bold">${esc(sec.h)}</h2>
        ${(sec.p || []).map((p) => `<p class="mt-4 text-slate-700 leading-relaxed">${esc(p)}</p>`).join('\n        ')}
        ${sec.list ? `<ul class="mt-4 list-disc pl-6 space-y-2 text-slate-700 leading-relaxed">${sec.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}`).join('\n')}
        <div class="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <p class="font-semibold">Want this handled for you?</p>
          <p class="mt-1 text-slate-700">${linked.map((s) => `<a href="/${s.slug}" class="text-blue-600 hover:underline">${esc(s.nav)}</a>`).join(' · ')}</p>
          <a href="${WA}?text=${encodeURIComponent(`Hi, I read your guide "${g.h1}" and have a question.`)}" class="mt-4 inline-flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5">Ask us on WhatsApp</a>
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
        <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight">Guides</h1>
        <p class="mt-4 text-lg text-slate-700 max-w-3xl">Practical advice on Reels, Instagram and websites for brands and small businesses, from the team at Cutframe Studio.</p>
        <ul class="mt-10 grid sm:grid-cols-2 gap-4">
          ${guides.map((g) => `<li class="rounded-2xl border border-slate-200 p-6 hover:border-blue-400 transition-colors"><a href="/guides/${g.slug}" class="font-display text-xl font-bold hover:text-blue-600">${esc(g.h1)}</a><p class="mt-2 text-slate-600">${esc(g.description)}</p></li>`).join('\n          ')}
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
