import db from './db.js';

console.log('Seeding portfolio database...');

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
      title: "2026 Director's Cut Showreel",
      size: 'large',
      sort_order: 0,
      description: 'A compilation of my best commercial and narrative editing work over the past year. Focuses on rhythm, timing, and dynamic sound design.',
      tags: JSON.stringify(['Showreel', 'Director Cut', 'Narrative']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'Neon Tokyo - Color Grading Reel',
      size: 'tall',
      sort_order: 1,
      description: 'Custom color pipeline utilizing DaVinci Resolve with film print emulation. Highly saturated reds and deep cybernetic greens.',
      tags: JSON.stringify(['Color Grading', 'DaVinci Resolve', 'Tokyo']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      type: 'youtube',
      title: 'Cinematic Narrative Short - YouTube Embed',
      size: 'wide',
      sort_order: 2,
      description: 'An emotional narrative project directed by Sarah Jenkins. Awarded Best Editing at the Indie Film Festival 2025.',
      tags: JSON.stringify(['Short Film', 'Drama', 'YouTube']),
      is_featured: 1,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'Vintage Film Aesthetics',
      size: 'small',
      sort_order: 3,
      description: 'Experimenting with 16mm film scan overlay, light leaks, and gate weave templates to simulate mechanical film playback.',
      tags: JSON.stringify(['16mm', 'Overlay', 'Experimental']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://vimeo.com/148756910',
      type: 'vimeo',
      title: 'A Mountain Dream - Vimeo Cinematic Edit',
      size: 'large',
      sort_order: 4,
      description: 'Scenic outdoor color tone tests in the Austrian Alps. Showcasing wide-angle landscape framing and seamless speed ramping cuts.',
      tags: JSON.stringify(['Landscape', 'Speed Ramp', 'Vimeo']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      title: 'Behind the Edit: Adobe Premiere Timeline',
      size: 'wide',
      sort_order: 5,
      description: 'A snapshot of a complex nested timeline from the 2025 Nike Campaign, displaying structural pacing and heavy multi-track audio layering.',
      tags: JSON.stringify(['BTS', 'Premiere Pro', 'Timeline']),
      is_featured: 0,
      is_published: 1
    },
    {
      url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
      type: 'mp4',
      title: 'Natural Lighting and Sound Design',
      size: 'small',
      sort_order: 6,
      description: 'Foley and ambient sound reconstruction practice using field-recorded streams and wind rustles over a 4K ProRes source.',
      tags: JSON.stringify(['Sound Design', 'Foley', 'Ambient']),
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
  console.log('Seeding complete. Seeded 7 portfolio items successfully.');
} catch (error) {
  console.error('Error seeding database:', error);
}
