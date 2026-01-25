# Image Assets

## To add your bus fleet image:

1. Place your bus fleet image in this directory as `bus-fleet.jpg`
2. The homepage will automatically use it

## Recommended image specifications:
- **Dimensions:** 1200px × 400px (or similar aspect ratio)
- **Format:** JPG, PNG, or WebP
- **Size:** Under 500KB for optimal loading

## Current fallback:
If `bus-fleet.jpg` is not found, the app uses a placeholder from Unsplash.

## Adding more images:
Place any additional images here and reference them in React components like:
```jsx
<img src="/images/your-image.jpg" alt="Description" />
```
