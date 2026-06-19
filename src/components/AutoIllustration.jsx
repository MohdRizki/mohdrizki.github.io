import React from 'react';

/**
 * AutoIllustration — Generates a unique, consistent retro-style SVG illustration
 * based on the item's name and category. No external API needed.
 * 
 * Usage: <AutoIllustration name="NilaiKu Pro" category="Produktivitas" />
 */

// Retro color palette
const PALETTES = [
  { bg: '#B8CCE2', accent: '#FFD56B', shape: '#2D2A26' },  // Blue
  { bg: '#FFD56B', accent: '#B5D8B0', shape: '#2D2A26' },  // Yellow
  { bg: '#FFBCB0', accent: '#B8CCE2', shape: '#2D2A26' },  // Pink
  { bg: '#B5D8B0', accent: '#FFBCB0', shape: '#2D2A26' },  // Mint
  { bg: '#F5F0E8', accent: '#FFD56B', shape: '#2D2A26' },  // Grey
];

// Icon shapes based on category keywords
const CATEGORY_ICONS = {
  'produktivitas': '📊', 'administrasi': '📋', 'edukasi': '📚',
  'coding': '💻', 'desain': '🎨', 'marketing': '📢',
  'media': '🎥', 'game': '🎮', 'quiz': '❓', 'kelas': '🏫',
  'kolaborasi': '🤝', 'nilai': '📈', 'presensi': '✅',
  'default': '⭐'
};

// Generate a deterministic hash from a string
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get category icon
function getCategoryIcon(category, name) {
  const searchStr = `${category} ${name}`.toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
    if (keyword !== 'default' && searchStr.includes(keyword)) return icon;
  }
  return CATEGORY_ICONS.default;
}

// Generate deterministic geometric shapes
function generateShapes(hash) {
  const shapes = [];
  const shapeCount = 3 + (hash % 4); // 3-6 shapes
  
  for (let i = 0; i < shapeCount; i++) {
    const seed = hashString(`shape-${hash}-${i}`);
    const type = seed % 4; // 0=circle, 1=rect, 2=diamond, 3=triangle
    const x = 15 + ((seed * 7) % 70);
    const y = 15 + ((seed * 11) % 70);
    const size = 8 + (seed % 20);
    const rotation = (seed * 13) % 360;
    const opacity = 0.15 + ((seed % 30) / 100);
    
    shapes.push({ type, x, y, size, rotation, opacity, seed });
  }
  return shapes;
}

export default function AutoIllustration({ 
  name = '', 
  category = '', 
  className = '',
  size = 'md' // 'sm', 'md', 'lg'
}) {
  const hash = hashString(name + category);
  const palette = PALETTES[hash % PALETTES.length];
  const icon = getCategoryIcon(category, name);
  const shapes = generateShapes(hash);
  const initial = name.charAt(0).toUpperCase();
  
  const sizeMap = { sm: 'w-full h-full', md: 'w-full h-full', lg: 'w-full h-full' };
  const iconSize = size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2.2rem';

  return (
    <div className={`relative overflow-hidden ${sizeMap[size]} ${className}`} style={{ backgroundColor: palette.bg }}>
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background pattern */}
        <defs>
          <pattern id={`dots-${hash}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.8" fill={palette.shape} opacity="0.08" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#dots-${hash})`} />

        {/* Decorative shapes */}
        {shapes.map((s, i) => {
          const fill = i % 2 === 0 ? palette.accent : palette.bg;
          switch (s.type) {
            case 0: // Circle
              return <circle key={i} cx={s.x} cy={s.y} r={s.size / 2} fill={fill} opacity={s.opacity} />;
            case 1: // Rounded rect
              return (
                <rect 
                  key={i} x={s.x - s.size/2} y={s.y - s.size/2} 
                  width={s.size} height={s.size} rx={s.size / 5}
                  fill={fill} opacity={s.opacity}
                  transform={`rotate(${s.rotation} ${s.x} ${s.y})`}
                />
              );
            case 2: // Diamond
              return (
                <rect 
                  key={i} x={s.x - s.size/3} y={s.y - s.size/3} 
                  width={s.size * 0.66} height={s.size * 0.66}
                  fill={fill} opacity={s.opacity}
                  transform={`rotate(45 ${s.x} ${s.y})`}
                />
              );
            case 3: // Plus sign
              return (
                <g key={i} opacity={s.opacity} transform={`rotate(${s.rotation} ${s.x} ${s.y})`}>
                  <rect x={s.x - s.size/6} y={s.y - s.size/2} width={s.size/3} height={s.size} rx={2} fill={fill} />
                  <rect x={s.x - s.size/2} y={s.y - s.size/6} width={s.size} height={s.size/3} rx={2} fill={fill} />
                </g>
              );
            default:
              return null;
          }
        })}

        {/* Border accent line at bottom */}
        <rect x="0" y="94" width="100" height="6" fill={palette.accent} opacity="0.5" />
      </svg>

      {/* Center icon + initial */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span style={{ fontSize: iconSize }} className="drop-shadow-sm">{icon}</span>
        <span 
          className="font-heading font-bold text-retro-dark/30 mt-0.5"
          style={{ fontSize: size === 'sm' ? '0.6rem' : '0.7rem', letterSpacing: '0.05em' }}
        >
          {name.length > 12 ? name.substring(0, 12) + '…' : name}
        </span>
      </div>
    </div>
  );
}
