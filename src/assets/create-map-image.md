# Sri Lanka Map Image Creation Guide

To complete the Sri Lanka map-based train tracking feature, you'll need to add a Sri Lanka map image to the assets folder.

## Requirements for the map image:

1. Create a PNG file named `sri-lanka-map.png` in the `/src/assets/` directory
2. The image should be:
   - A simple outline map of Sri Lanka
   - Preferably with minimal detail (just country borders)
   - With a transparent background
   - Approximately 800px × 1080px in size (maintaining a 1.35 aspect ratio)
   - Optimized for both light and dark mode display

## Recommended approaches:

### Option 1: Use an existing SVG/PNG
Download a simple Sri Lanka map outline from sites like:
- Wikimedia Commons
- Free SVG repositories
- Stock image sites with royalty-free content

### Option 2: Create your own
Create a simple Sri Lanka outline map using design software like:
- Adobe Illustrator or Photoshop
- Figma
- Inkscape (free)
- GIMP (free)

## Important Notes:
- The SriLankaMapTracker component is already configured to use this image from the correct path
- The map coordinates in the component are calibrated to work with a standard Sri Lanka map outline
- The image should work well with both light and dark mode themes
- Avoid detailed maps with lots of internal boundaries or text that may be hard to read in dark mode

Once the map image is added, the train tracking feature will display trains on a proper Sri Lanka map with the correct routes visualized.
