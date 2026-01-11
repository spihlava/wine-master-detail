---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality
---

# Frontend Design Guidelines

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

## Design Thinking

Before coding, commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, luxury/refined, editorial/magazine, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Differentiation**: What makes this UNFORGETTABLE?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision.

## Wine Cellar Aesthetic Direction

For this app, consider:
- **Luxury wine retail** - Dark themes, rich burgundy accents, elegant serif typography
- **Editorial/magazine** - Clean layouts, dramatic photography, sophisticated type hierarchy
- **Art deco** - Geometric patterns, gold accents, vintage elegance
- **Minimal luxury** - Restrained, generous whitespace, perfect typography

## Typography

- **AVOID**: Generic fonts like Arial, Inter, Roboto, system fonts
- **USE**: Distinctive choices that elevate the aesthetic
  - Display: Playfair Display, Cormorant, Bodoni, Libre Baskerville
  - Body: Source Serif Pro, Lora, or a refined sans like Outfit
- Pair a distinctive display font with a refined body font

## Color & Theme

- Dominant colors with sharp accents
- Avoid timid, evenly-distributed palettes
- Wine-specific palette inspiration:
  - Deep burgundy (#722F37)
  - Rich gold (#D4AF37)
  - Aged paper (#F5F0E6)
  - Cellar slate (#2C3E50)
- Use CSS variables for consistency

## Motion

- Focus on high-impact moments
- Page load with staggered reveals (animation-delay)
- Scroll-triggered animations
- Hover states that surprise
- CSS-only solutions preferred, Motion library for React

## Spatial Composition

- Asymmetric layouts
- Generous negative space
- Grid-breaking elements
- Overlap and layering
- Diagonal flow where appropriate

## Backgrounds & Visual Details

Create atmosphere and depth:
- Gradient meshes
- Noise/grain textures
- Layered transparencies  
- Dramatic shadows
- Decorative borders

## NEVER

- Purple gradients on white backgrounds
- Cookie-cutter card layouts
- Overused component patterns
- Design without context-specific character
- The same aesthetic twice

## Implementation

Match implementation complexity to aesthetic vision:
- **Maximalist** → Elaborate code, extensive animations
- **Minimalist** → Restraint, precision, subtle details

Elegance comes from executing the vision well.
