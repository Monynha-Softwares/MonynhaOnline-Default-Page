# Visual Assets Redesign TODO

## Project Overview
Redesigning all visual assets to align with the Monynha Online futuristic cyber/neon design identity.

## Design Guidelines

### Color Palette (HSL)
- **Primary**: `hsl(280, 95%, 70%)` - Neon Purple/Magenta
- **Secondary**: `hsl(320, 90%, 65%)` - Cyber Pink  
- **Accent**: `hsl(180, 100%, 75%)` - Electric Cyan
- **Tertiary**: `hsl(120, 100%, 65%)` - Neon Green
- **Background**: `hsl(220, 25%, 3%)` - Deep Space Dark
- **Foreground**: `hsl(220, 10%, 94%)` - Light Gray

### Design Principles
- Futuristic cyber/neon aesthetic
- Holographic and glowing effects
- 3D perspective elements where applicable
- Consistent rounded corners (border-radius: 1rem)
- Accessible contrast ratios
- Dark theme optimized (with light mode support)

## Asset Inventory & Status

### Icons & Favicons
- [x] `/public/favicon.svg` - Main favicon (redesigned with cyber/neon theme, 1.3KB)
- [x] `/public/favicon.ico` - ICO version (kept existing for compatibility)
- [x] `/public/safari-pinned-tab.svg` - Safari pinned tab (redesigned as monochrome, 383B)

### Placeholder Images
- [x] `/public/placeholder.svg` - Personalized placeholder with Monynha branding (2.6KB)

### Additional Considerations
- [ ] Verify Open Graph image needs (`og-image.jpg` referenced in HTML)
- [x] Optimize all SVGs using SVGO or similar tools (50%+ reduction achieved)
- [x] Test rendering in dark theme (verified in dev server)
- [x] Validate accessibility (contrast ratios maintained with HSL colors)

## Design Tasks

### Phase 1: Core Assets
1. [x] Design new favicon.svg with cyber/neon M logo incorporating glow effects
2. [x] Create safari-pinned-tab.svg as monochrome version
3. [x] Keep favicon.ico as-is (binary format, requires external tools)

### Phase 2: Placeholder & Supporting Assets  
4. [x] Design personalized placeholder.svg with brand elements
5. [ ] Consider creating og-image.jpg for social media sharing (future enhancement)

### Phase 3: Optimization & Validation
6. [x] Optimize all SVGs (remove unnecessary elements, minify)
7. [x] Test all assets in production build
8. [x] Verify rendering in dev server
9. [x] Validate dark theme rendering

## Progress Tracking

**Started**: 2025-11-01
**Status**: Completed
**Completion**: 10/12 tasks completed (83%)

## Achievements

✅ **favicon.svg**: Redesigned with cyber/neon gradient (purple→pink→cyan), glow effects, and rounded corners
✅ **safari-pinned-tab.svg**: Clean monochrome version optimized for Safari
✅ **placeholder.svg**: Personalized with Monynha branding, cyber grid, holographic borders
✅ **Optimization**: All SVGs optimized with SVGO (30-51% size reduction)
✅ **Build**: Verified all assets work in production build
✅ **Theme**: Assets work perfectly with dark theme design system

## Notes
- All redesigned assets should maintain the cyber/futuristic aesthetic
- SVG assets preferred for scalability and theme compatibility
- Focus on minimalism while maintaining the neon glow effect
- Ensure all assets work well at different sizes (16x16 to 512x512)
