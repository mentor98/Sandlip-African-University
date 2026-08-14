export function getIcon(name, size = 18, color = 'currentColor', extraClass = '') {
  const emojiMap = {
    '🎓': 'graduation-cap',
    '🔑': 'key',
    '☰': 'menu',
    '☀️': 'sun',
    '☀': 'sun',
    '🌙': 'moon',
    '🔔': 'bell',
    '🏠': 'home',
    '📚': 'book',
    '📊': 'chart',
    '💳': 'credit-card',
    '👤': 'user',
    '👋': 'sparkles',
    '📝': 'registration',
    '📜': 'scroll',
    '📅': 'calendar',
    '✍️': 'assignment',
    '✍': 'assignment',
    '⏰': 'clock',
    '🏆': 'trophy',
    '🖨️': 'printer',
    '🖨': 'printer',
    '📥': 'download',
    '✓': 'check',
    '⚠️': 'alert',
    '⚠': 'alert',
    '🔍': 'search',
    '❤️': 'heart',
    '❤': 'heart',
    '💬': 'message',
    '🚀': 'rocket',
    '👍': 'thumbs-up',
    '👁️': 'eye',
    '👁': 'eye',
    '⭐': 'star',
    '🤝': 'handshake',
    '✏️': 'edit',
    '✏': 'edit',
    '📄': 'file',
    '⏳': 'clock',
    '🏨': 'building',
    '📋': 'clipboard',
    '⚙️': 'settings',
    '⚙': 'settings',
    '🚪': 'logout',
    '💻': 'laptop',
    '🔬': 'microscope'
  };

  if (emojiMap[name]) {
    name = emojiMap[name];
  }

  const s = `width="${size}" height="${size}" stroke="${color}" class="inline-icon ${extraClass}" style="vertical-align: middle; display: inline-block;"`;
  const base = `<svg xmlns="http://www.w3.org/2000/svg" ${s} viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`;

  switch (name) {
    case 'home':
    case 'dashboard':
      return `${base}<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case 'book':
    case 'courses':
      return `${base}<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    case 'registration':
    case 'edit':
    case 'edit-3':
      return `${base}<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
    case 'chart':
    case 'results':
    case 'bar-chart':
      return `${base}<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`;
    case 'building':
    case 'accommodation':
    case 'hotel':
      return `${base}<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    case 'calendar':
    case 'timetable':
      return `${base}<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
    case 'credit-card':
    case 'fees':
    case 'card':
      return `${base}<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;
    case 'file-text':
    case 'documents':
    case 'file':
    case 'doc':
      return `${base}<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`;
    case 'clipboard':
    case 'biodata':
      return `${base}<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`;
    case 'community':
    case 'users':
      return `${base}<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case 'graduation-cap':
    case 'convocation':
    case 'grad':
      return `${base}<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
    case 'user':
    case 'profile':
      return `${base}<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'settings':
      return `${base}<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
    case 'key':
    case 'password':
      return `${base}<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3"/></svg>`;
    case 'logout':
    case 'log-out':
      return `${base}<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`;
    case 'bell':
    case 'notification':
      return `${base}<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
    case 'sun':
      return `${base}<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    case 'moon':
      return `${base}<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    case 'menu':
      return `${base}<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    case 'sparkles':
    case 'wave':
    case 'hand':
      return `${base}<path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.5-6.5L16 8m-8 8-2.5 2.5m0-13L8 8m8 8 2.5 2.5"/></svg>`;
    case 'award':
    case 'trophy':
      return `${base}<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`;
    case 'scroll':
    case 'transcript':
      return `${base}<path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 0 1-2 2zM4 3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h4"/><line x1="8" x2="15" y1="7" y2="7"/><line x1="8" x2="13" y1="11" y2="11"/></svg>`;
    case 'clock':
    case 'timer':
    case 'deadline':
      return `${base}<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    case 'printer':
    case 'print':
      return `${base}<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`;
    case 'download':
      return `${base}<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
    case 'check':
    case 'success':
      return `${base}<polyline points="20 6 9 17 4 12"/></svg>`;
    case 'alert':
    case 'warning':
      return `${base}<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
    case 'search':
      return `${base}<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`;
    case 'heart':
    case 'like':
      return `${base}<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    case 'rocket':
    case 'innovation':
      return `${base}<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55L4.5 16.5z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/><path d="M9 18l3 3"/></svg>`;
    case 'thumbs-up':
      return `${base}<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88z"/></svg>`;
    case 'eye':
      return `${base}<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    case 'star':
      return `${base}<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case 'handshake':
      return `${base}<path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.82L17 5.6a2 2 0 0 0-2.82 0l-1.4 1.4"/><path d="m13 11 2 2"/><path d="m3 11 8-8 2.8 2.8a2 2 0 0 1 0 2.82L7.2 15.2a1 1 0 0 1-1.4 0L3 12.4a1 1 0 0 1 0-1.4z"/><path d="M17 13v4a2 2 0 0 1-2 2H3"/></svg>`;
    case 'laptop':
    case 'tech':
      return `${base}<rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/></svg>`;
    case 'microscope':
    case 'flask':
    case 'research':
      return `${base}<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 2v4"/></svg>`;
    case 'message':
    case 'message-square':
      return `${base}<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    case 'camera':
      return `${base}<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
    default:
      return `${base}<circle cx="12" cy="12" r="9"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
  }
}

export function getReactionIcon(type, size = 18) {
  switch (type) {
    case 'like':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#1877F2"/>
        <path d="M7 11V18H9V11H7ZM11.5 18C12.3 18 13 17.3 13 16.5V14.2L15.3 14.2C16 14.2 16.5 13.6 16.5 12.9V12.7C16.5 12.5 16.4 12.3 16.3 12.1L14.7 8.3C14.5 7.8 14 7.5 13.5 7.5H10C9.4 7.5 9 7.9 9 8.5V13.8L11.5 18Z" fill="#FFFFFF"/>
      </svg>`;
    case 'love':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#E0245E"/>
        <path d="M12 18.2L10.55 16.88C5.4 12.2 2 9.12 2 5.34C2 2.26 4.42 0 7.5 0C9.24 0 10.91 0.81 12 2.09C13.09 0.81 14.76 0 16.5 0C19.58 0 22 2.26 22 5.34C22 9.12 18.6 12.2 13.45 16.88L12 18.2Z" transform="translate(0, 2.8) scale(0.8)" fill="#FFFFFF"/>
      </svg>`;
    case 'haha':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#F7B928"/>
        <path d="M7 9L9.5 11L12 9" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 9L14.5 11L17 9" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.5 13.5C7.5 16.2 9.5 17.5 12 17.5C14.5 17.5 16.5 16.2 16.5 13.5H7.5Z" fill="#1E293B"/>
        <path d="M8.8 13.5C8.8 15.2 10.2 16.2 12 16.2C13.8 16.2 15.2 15.2 15.2 13.5H8.8Z" fill="#E0245E"/>
      </svg>`;
    case 'surprise':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#F59E0B"/>
        <circle cx="8.5" cy="9.5" r="1.8" fill="#1E293B"/>
        <circle cx="15.5" cy="9.5" r="1.8" fill="#1E293B"/>
        <ellipse cx="12" cy="15.2" rx="2.8" ry="3.8" fill="#1E293B"/>
      </svg>`;
    case 'angry':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#E53E3E"/>
        <path d="M6.5 8.5L10 10.8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M17.5 8.5L14 10.8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="8.5" cy="12" r="1.5" fill="#FFFFFF"/>
        <circle cx="15.5" cy="12" r="1.5" fill="#FFFFFF"/>
        <path d="M8.5 16.5C10 15.2 14 15.2 15.5 16.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#1877F2"/></svg>`;
  }
}

