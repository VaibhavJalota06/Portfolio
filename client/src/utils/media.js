// Media URL utility functions

// Detect type of media and parse key parameters
export function getMediaInfo(url) {
  if (!url) {
    return { type: 'image', embedUrl: '', id: '', thumbnailUrl: '' };
  }

  // YouTube
  // Matches:
  // - https://www.youtube.com/watch?v=ID
  // - https://youtu.be/ID
  // - https://youtube.com/embed/ID
  // - https://youtube.com/shorts/ID
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
  // Matches:
  // - https://vimeo.com/123456789
  // - https://vimeo.com/channels/staffpicks/123456789
  // - https://player.vimeo.com/video/123456789
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/videos\/|album\/\d+\/video\/|video\/|showcase\/[^\/]+\/)?|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&autopause=0&controls=0`,
      // Vimeo thumbnail API exists but requires fetch. We can use a reliable default thumbnail
      // or fetch it. Let's provide a placeholder, or fetch it dynamically.
      thumbnailUrl: `https://vumbnail.com/${id}.jpg` // vumbnail.com is a free community service to get Vimeo thumbnails!
    };
  }

  // Direct MP4/WebM/Mov/Ogg
  const videoExtRegex = /\.(mp4|webm|mov|ogg)($|\?)/i;
  if (videoExtRegex.test(url)) {
    return {
      type: 'mp4',
      id: url,
      embedUrl: url,
      thumbnailUrl: '' // Native video will use poster or auto-load first frame
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
