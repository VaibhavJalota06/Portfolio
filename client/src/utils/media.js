// Media URL utility functions

export function isEmbedType(type) {
  return ['youtube', 'vimeo', 'gdrive', 'loom', 'streamable', 'tiktok', 'instagram', 'dailymotion', 'wistia'].includes(type);
}

// Detect type of media and parse key parameters
export function getMediaInfo(url) {
  if (!url) {
    return { type: 'image', embedUrl: '', id: '', thumbnailUrl: '' };
  }

  // YouTube
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|watch\?v=|shorts\/)|youtu\.be\/)([^"&?\/ ]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    };
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/videos\/|album\/\d+\/video\/|video\/|showcase\/[^\/]+\/)?|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&autopause=0&controls=0`,
      thumbnailUrl: `https://vumbnail.com/${id}.jpg`
    };
  }

  // Google Drive
  const gdriveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    const id = gdriveMatch[1];
    return {
      type: 'gdrive',
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${id}`
    };
  }

  // Loom
  const loomRegex = /(?:loom\.com\/(?:share|embed)\/)([a-zA-Z0-9]+)/;
  const loomMatch = url.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    const id = loomMatch[1];
    return {
      type: 'loom',
      id,
      embedUrl: `https://www.loom.com/embed/${id}`,
      thumbnailUrl: `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`
    };
  }

  // Streamable
  const streamableRegex = /(?:streamable\.com\/(?:e\/)?)([a-zA-Z0-9]+)/;
  const streamableMatch = url.match(streamableRegex);
  if (streamableMatch && streamableMatch[1]) {
    const id = streamableMatch[1];
    return {
      type: 'streamable',
      id,
      embedUrl: `https://streamable.com/e/${id}?autoplay=1&muted=1`,
      thumbnailUrl: `https://cdn-cf-east.streamable.com/image/${id}.jpg`
    };
  }

  // TikTok
  const tiktokRegex = /(?:tiktok\.com\/@[^\/]+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)(\d+)/;
  const tiktokMatch = url.match(tiktokRegex);
  if (tiktokMatch && tiktokMatch[1]) {
    const id = tiktokMatch[1];
    return {
      type: 'tiktok',
      id,
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      thumbnailUrl: ''
    };
  }

  // Instagram
  const igRegex = /(?:instagram\.com\/(?:reel|p|tv)\/)([a-zA-Z0-9_-]+)/;
  const igMatch = url.match(igRegex);
  if (igMatch && igMatch[1]) {
    const id = igMatch[1];
    return {
      type: 'instagram',
      id,
      embedUrl: `https://www.instagram.com/p/${id}/embed`,
      thumbnailUrl: ''
    };
  }

  // Dailymotion
  const dmRegex = /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/;
  const dmMatch = url.match(dmRegex);
  if (dmMatch && dmMatch[1]) {
    const id = dmMatch[1];
    return {
      type: 'dailymotion',
      id,
      embedUrl: `https://www.dailymotion.com/embed/video/${id}?autoplay=1&mute=1`,
      thumbnailUrl: `https://www.dailymotion.com/thumbnail/video/${id}`
    };
  }

  // Wistia
  const wistiaRegex = /(?:wistia\.com\/medias\/|wistia\.net\/embed\/iframe\/)([a-zA-Z0-9]+)/;
  const wistiaMatch = url.match(wistiaRegex);
  if (wistiaMatch && wistiaMatch[1]) {
    const id = wistiaMatch[1];
    return {
      type: 'wistia',
      id,
      embedUrl: `https://fast.wistia.net/embed/iframe/${id}?autoPlay=true&muted=true`,
      thumbnailUrl: `https://fast.wistia.com/embed/medias/${id}.jpg`
    };
  }

  // Dropbox (Direct video stream conversion)
  if (url.includes('dropbox.com')) {
    const directUrl = url.replace(/([?&])dl=0/, '$1raw=1');
    return {
      type: 'mp4',
      id: url,
      embedUrl: directUrl,
      thumbnailUrl: ''
    };
  }

  // Direct MP4/WebM/Mov/Ogg
  const videoExtRegex = /\.(mp4|webm|mov|ogg)($|\?)/i;
  if (videoExtRegex.test(url)) {
    return {
      type: 'mp4',
      id: url,
      embedUrl: url,
      thumbnailUrl: ''
    };
  }

  // Default to Image
  return {
    type: 'image',
    id: url,
    embedUrl: url,
    thumbnailUrl: url
  };
}

// Quick type detection helper
export function detectMediaType(url) {
  return getMediaInfo(url).type;
}
