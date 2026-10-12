import db from './db.js';

console.log('Seeding Cutframe Studio agency database...');

try {
  // Clear existing items
  db.prepare('DELETE FROM portfolio_items').run();

  // Reset sqlite autoincrement sequence
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'portfolio_items'").run();

  const insertStmt = db.prepare(`
    INSERT INTO portfolio_items (url, type, title, size, sort_order, description, tags, is_featured, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleItems = [
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-man-with-a-camera-42861-large.mp4',
      type: 'mp4',
      title: "Cutframe Agency Master Showreel 2026",
      size: 'large',
      sort_order: 0,
      description: 'The pinnacle of our high-retention video production. Commercial campaigns, viral YouTube storytelling, and high-impact color grading across 180M+ aggregate impressions.',
      tags: JSON.stringify(['Showreel', 'Agency Master', 'Commercials']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'Short-Form Viral Retention Engine',
      size: 'tall',
      sort_order: 1,
      description: 'Scaled creator channel by 240k followers in 60 days. Includes custom kinetic typography, visual hook interruptions every 3.5 seconds, and immersive SFX layering.',
      tags: JSON.stringify(['Short-Form', 'Reels', 'TikTok', 'Viral']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      type: 'youtube',
      title: 'YouTube Long-Form Docuseries - 1.4M Views',
      size: 'wide',
      sort_order: 2,
      description: 'Comprehensive pacing reconstruction and multicam assembly. Boosted average percentage viewed from 34% to 58%, earning spot on the YouTube trending tab.',
      tags: JSON.stringify(['YouTube', 'Long-Form', 'Docuseries']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'DaVinci Resolve S-Log3 Cinema Color Master',
      size: 'small',
      sort_order: 3,
      description: 'Hollywood cinema color pipeline with custom Kodak 2383 print curve, skin tone fidelity protection, and balanced shadow dynamic range.',
      tags: JSON.stringify(['Color Grading', 'DaVinci Resolve', 'Cinema']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://vimeo.com/148756910',
      type: 'vimeo',
      title: 'Direct-Response Commercial (4.8x ROAS)',
      size: 'large',
      sort_order: 4,
      description: 'High-converting video ad creative for DTC brand launch. 3 hook variations, seamless speed ramping, macro product shots, and direct-response callouts.',
      tags: JSON.stringify(['Commercial', 'Paid Ads', 'ROAS', 'Vimeo']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'High-Retention Video Podcast Production',
      size: 'wide',
      sort_order: 5,
      description: 'Studio multicam switching, broadcast audio restoration, and automated highlight extraction for weekly high-profile executive interviews.',
      tags: JSON.stringify(['Podcast', 'Multicam', 'Audio Polish']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
      type: 'mp4',
      title: 'Sound Design & Foley Reconstruction',
      size: 'small',
      sort_order: 6,
      description: 'Custom acoustic Foley and spatial sound layering for an outdoor lifestyle brand commercial, engineered to -14 LUFS standards.',
      tags: JSON.stringify(['Sound Design', 'Foley', 'Audio Mastering']),
      is_featured: 0,
      is_published: 1
    }
  ];

  const seedTransaction = db.transaction((items) => {
    for (const item of items) {
      insertStmt.run(item.url, item.type, item.title, item.size, item.sort_order, item.description, item.tags, item.is_featured, item.is_published);
    }
  });

  seedTransaction(sampleItems);

  // Update settings table with Cutframe Studio agency brand data
  const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const agencySettings = {
    editor_name: "Cutframe Studio",
    hero_tagline: "We engineer high-retention videos that scale modern brands and creators.",
    showreel_url: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-man-with-a-camera-42861-large.mp4",
    bio_text: "Cutframe Studio is a full-service media production and post-production engine. We transform raw footage into magnetic, high-retaining short-form assets, cinematic YouTube stories, and commercial ad creatives designed to maximize reach, retention, and return on ad spend.",
    location_info: "FULL-SERVICE MEDIA AGENCY • DAVINCI RESOLVE / PREMIERE PRO / AFTER EFFECTS",
    contact_email: "hello@cutframestudio.com",
    contact_github: "github.com/cutframestudio",
    contact_vimeo: "vimeo.com/cutframestudio",
    gallery_title: "AGENCY VIDEO SHOWCASE",
    gallery_description: "Filter our recent viral short-form campaigns, YouTube long-form stories, and high-conversion commercial ads.",
    hero_label: "CUTFRAME STUDIO • FULL-SERVICE MEDIA ENGINE",
    instagram_url: "instagram.com/cutframestudio",
    behance_url: "",
    available_for_work: "1",
    theme_accent: "blue"
  };

  for (const [k, v] of Object.entries(agencySettings)) {
    updateSetting.run(k, v);
  }

  console.log('Seeding complete. Seeded 7 Cutframe Studio agency items and updated agency settings successfully.');
} catch (error) {
  console.error('Error seeding database:', error);
}
