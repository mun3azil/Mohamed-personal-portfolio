# Icons Directory

This directory contains all favicon and icon assets for the Mohamed Ashraf Portfolio website.

## 📁 File Structure

```
/public/icons/
├── favicon.ico              # Main favicon (ICO format)
├── favicon-16x16.png        # Small favicon (16x16 PNG)
├── favicon-32x32.png        # Medium favicon (32x32 PNG)
├── apple-touch-icon.png     # Apple touch icon (180x180 PNG)
├── icon-192x192.png         # PWA icon (192x192 PNG)
├── icon-512x512.png         # PWA icon (512x512 PNG)
├── avatar-main.svg          # Main avatar/logo (SVG)
├── safari-pinned-tab.svg    # Safari pinned tab icon (SVG)
└── README.md               # This file
```

## 🎯 Icon Usage

### Favicon Icons
- **favicon.ico**: Traditional favicon for older browsers
- **favicon-16x16.png**: Small favicon for browser tabs
- **favicon-32x32.png**: Medium favicon for bookmarks and shortcuts

### Mobile & PWA Icons
- **apple-touch-icon.png**: iOS home screen icon (180x180)
- **icon-192x192.png**: Android home screen icon (192x192)
- **icon-512x512.png**: High-resolution PWA icon (512x512)

### Special Icons
- **avatar-main.svg**: Scalable vector logo/avatar
- **safari-pinned-tab.svg**: Safari pinned tab icon with theme color

## 🔗 References

These icons are referenced in:
- `src/app/layout.tsx` - Next.js metadata configuration
- `public/manifest.json` - PWA manifest file
- `vercel.json` - Caching configuration

## 🎨 Design Guidelines

All icons follow the portfolio's design system:
- **Primary Color**: #0ea5e9 (Sky Blue)
- **Background**: #020617 (Dark Navy)
- **Style**: Modern, minimalist developer avatar
- **Format**: Optimized for web performance

## 📱 Browser Support

- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ iOS Safari
- ✅ Android Chrome

## 🚀 Performance

- All PNG icons are optimized for web
- SVG icons are minified and optimized
- Proper caching headers configured in vercel.json
- Icons follow web standards for maximum compatibility
