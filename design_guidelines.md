# Design Guidelines: School Management Dashboard

## Design Approach
**System**: Custom glass-morphism design system with gradient accents, optimized for Arabic RTL layouts and data-dense administrative interfaces.

## Core Design Principles
- **Glass-morphism aesthetic**: Translucent cards with backdrop blur for modern, layered appearance
- **Gradient accents**: Strategic use of vibrant gradients for visual hierarchy and engagement
- **Information clarity**: Data-first layout prioritizing readability and quick scanning
- **Arabic-first design**: Optimized RTL layout with proper text rendering and spacing

## Color Palette

### Background & Base
- Primary gradient background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (purple-blue)
- Glass containers: `rgba(255, 255, 255, 0.95)` with 20px backdrop blur
- Sidebar: `rgba(255, 255, 255, 0.1)` with 20px backdrop blur
- Border highlights: `rgba(255, 255, 255, 0.2)` for glass edges

### Gradient Categories (for stat cards & accents)
- Primary: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - purple/indigo
- Success: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)` - teal/green
- Warning: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` - pink/red
- Info: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - blue/cyan

### Text Colors
- Primary headings: `#1a202c` (gray-900) on light backgrounds, white on gradients
- Secondary text: `rgba(0, 0, 0, 0.7)` on light, `rgba(255, 255, 255, 0.8)` on dark
- Muted text: `rgba(0, 0, 0, 0.5)` on light, `rgba(255, 255, 255, 0.7)` on dark

## Typography
- **Font family**: 'Cairo', 'Segoe UI', Tahoma (Arabic-optimized)
- **Headings**: 
  - H1: 2xl (30px), font-bold (700)
  - H2: xl (20px), font-bold (700)
  - H3: lg (18px), font-semibold (600)
- **Body text**: base (16px), font-normal (400)
- **Small text**: sm (14px), xs (12px) for metadata
- **Line height**: Generous for Arabic readability (1.6-1.8)

## Layout System
**Spacing primitives**: Use Tailwind units of 2, 4, 6, 8 for consistency
- Container padding: `p-6` (24px) or `p-8` (32px) for main sections
- Card spacing: `gap-6` between grid items
- Section margins: `mb-8` between major sections
- Sidebar width: Fixed 320px (`w-80`)
- Main content: `mr-80` (margin-right for RTL) with `p-8` padding

**Grid Layouts**:
- Stats cards: 4-column grid on desktop (`grid-cols-4`), stack on mobile
- Content cards: 2-3 column grids (`grid-cols-2` or `grid-cols-3`)
- Responsive breakpoints: Mobile-first, md: 768px, lg: 1024px

## Component Library

### Navigation (Sidebar)
- Glass-effect background with 20px blur
- Active state: `rgba(255, 255, 255, 0.3)` with 4px right border (white)
- Hover: `rgba(255, 255, 255, 0.2)` with -5px translateX
- Item spacing: `space-y-2` with rounded-xl corners
- Icon + text layout with notification badges

### Cards & Containers
- Glass cards: White background (95% opacity), 20px blur, 8-32px shadow
- Border radius: `rounded-2xl` (16px) for all cards
- Hover effect: `translateY(-8px) scale(1.02)` with enhanced shadow
- Transition: `0.4s cubic-bezier(0.4, 0, 0.2, 1)`

### Stat Cards
- Gradient backgrounds from color palette
- White text throughout
- Large numbers (3xl/30px, bold)
- Small metadata text (xs/12px, 70% opacity)
- Emoji icons at 4xl size for visual interest

### Buttons
- Primary: Gradient background `#667eea to #764ba2` with blur shadow
- Hover: `translateY(-2px)` with enhanced shadow (0 8px 25px)
- Padding: `py-2 px-4` or `py-3 px-6` for prominent actions
- Border radius: `rounded-lg` (8px)
- Transition: All 0.3s ease

### Tables & Data Display
- Row hover: Gradient overlay `rgba(102, 126, 234, 0.1)` with `scale(1.01)`
- Headers: Semi-bold with slight opacity reduction
- Alternating rows optional: Use subtle gray backgrounds
- Borders: Light gray `rgba(0, 0, 0, 0.1)`

### Modals & Overlays
- Backdrop: `rgba(0, 0, 0, 0.5)` with 5px blur
- Modal content: Glass-card styling
- Smooth fade-in animation (0.5s ease-out)

### Form Elements
- Input fields: White background, light border, rounded-lg
- Focus state: Border color matches primary gradient
- Labels: Font-medium (500), mb-2 spacing
- Dark mode inputs: Maintain consistent glass aesthetic

### Icons & Badges
- Use emoji icons for quick visual recognition (mix with SVG where needed)
- Notification badges: Colored circles with pulse animation
- Size hierarchy: text-xl for menu, text-4xl for stat cards

## Animations
**Minimal, purposeful motion**:
- Page load: 0.5s fade-in with translateY(20px)
- Card hover: 0.4s transform with enhanced shadow
- Button interactions: 0.3s ease transitions
- Notification badges: 2s pulse loop (opacity 1 to 0.5)

## RTL-Specific Guidelines
- All spacing: Use `space-x-reverse` for proper RTL flow
- Flex direction: Items naturally flow right-to-left
- Text alignment: Right-aligned by default
- Icon placement: Icons on right side of text
- Borders: Right borders for active states (not left)
- Transforms: Use translateX with negative values for RTL hover effects

## Data Visualization
- Progress rings: Use transform rotate(-90deg) for proper start position
- Charts: Maintain RTL number formatting
- Color coding: Red for alerts, green for success, blue for info
- Percentage displays: Large, bold numbers with context labels

## Accessibility
- High contrast text on all backgrounds (WCAG AA minimum)
- Focus states: Visible outlines on all interactive elements
- Touch targets: Minimum 44px height for mobile interactions
- Arabic number formatting: Use Arabic-Indic numerals where appropriate

## Images
This dashboard does not require hero images. Focus on:
- User avatars (rounded-full, 40-48px)
- Icon-based visual hierarchy using emojis and simple SVGs
- Data visualization charts/graphs where applicable