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
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      type: 'image',
      title: 'Generative AI Brand Film & Synthetic B-Roll',
      size: 'wide',
      sort_order: 1,
      description: 'Next-gen Runway Gen-3 and Midjourney generative visuals for high-converting brand commercials and futuristic product sequences.',
      tags: JSON.stringify(['AI Videos', 'Ad Creatives']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'Short-Form Viral Retention Engine',
      size: 'tall',
      sort_order: 2,
      description: 'Scaled creator channel by 240k followers in 60 days. Includes custom kinetic typography, visual hook interruptions every 3.5 seconds, and sound design.',
      tags: JSON.stringify(['Short-Form / Reels']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      type: 'youtube',
      title: 'YouTube Long-Form Docuseries - 1.4M Views',
      size: 'wide',
      sort_order: 3,
      description: 'Comprehensive pacing reconstruction and multicam assembly. Boosted average percentage viewed from 34% to 58%, earning spot on the YouTube trending tab.',
      tags: JSON.stringify(['YouTube Long-Form']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://vimeo.com/148756910',
      type: 'vimeo',
      title: 'Direct-Response Commercial (4.8x ROAS)',
      size: 'large',
      sort_order: 4,
      description: 'High-converting video ad creative for DTC brand launch. 3 hook variations, seamless speed ramping, macro product shots, and direct-response callouts.',
      tags: JSON.stringify(['Ad Creatives']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      type: 'image',
      title: 'High-CTR YouTube Packaging & Thumbnails',
      size: 'small',
      sort_order: 5,
      description: 'Psychologically tested thumbnail packaging and typography designed to double organic click-through rates across tech, gaming, and finance channels.',
      tags: JSON.stringify(['Thumbnails & Packaging', 'YouTube Long-Form']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      type: 'youtube',
      title: 'AI Avatar & Multilingual Video Dubbing',
      size: 'small',
      sort_order: 6,
      description: 'Neural voice cloning with hyper-realistic lip-syncing for global product launches across 5 languages.',
      tags: JSON.stringify(['AI Videos', 'Short-Form / Reels']),
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

  // Update website settings
  const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const updateSettingsTransaction = db.transaction(() => {
    updateSetting.run('editor_name', 'Cutframe Studio');
    updateSetting.run('hero_tagline', 'We engineer high-retention videos that scale modern brands and creators.');
    updateSetting.run('bio_text', 'Cutframe Studio is a full-service media production and post-production engine. We transform raw footage and ideas into magnetic, high-retaining short-form assets, cinematic YouTube stories, and commercial ad creatives.');
    updateSetting.run('hero_label', 'CUTFRAME STUDIO • VIDEO & MEDIA ENGINE');
    updateSetting.run('theme_accent', 'blue');
    updateSetting.run('contact_email', 'vaibhav@cutframestudio.in');
    updateSetting.run('rate_currency', '₹');
  });
  updateSettingsTransaction();

  console.log('Seeding complete. Seeded 7 Cutframe Studio agency items and updated agency settings successfully.');
} catch (error) {
  console.error('Error during database seeding:', error);
}
