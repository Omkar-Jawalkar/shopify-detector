# 🛍️ Shopify Detector Chrome Extension

A Chrome extension that automatically detects Shopify-powered websites and displays a notification banner.

## Features

-   **Automatic Detection**: Detects Shopify sites using multiple methods
-   **Clean Banner**: Shows "Built with Shopify" banner on detected sites
-   **Popup Interface**: Interactive popup with status and testing tools
-   **Lightweight**: Minimal performance impact

## Detection Methods

-   `window.Shopify` object detection
-   Shopify-specific meta tags
-   Shopify script sources

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select this folder
5. Pin the extension to your toolbar

## Usage

-   **Automatic**: Extension runs on every page load
-   **Banner**: Green banner appears on Shopify sites

## Testing

Try these Shopify sites:

-   [Plum Goodness](https://plumgoodness.com/)
-   [Westside](https://www.westside.com/)

## Files

-   `manifest.json` - Extension configuration
-   `Identifier.js` - Main detection script
-   `Identifier.html` - Popup interface
-   `styles.css` - Banner styling
-   `images/` - Extension icons
-   `dynamic-variatio-badge-detection.js` - Variant badge detection script

## 🏷️ Dynamic Variant Badge Detection

A standalone JavaScript script that detects variant changes on Shopify product pages and displays a dynamic badge on the main product image.

### Features

-   **Real-time Detection**: Automatically detects when product variants change
-   **Dynamic Badge**: Shows current variant name (e.g., "Light Pink / M") on product image
-   **Smooth Animations**: Fade-in/fade-out transitions with auto-hide after 3 seconds
-   **Multiple Detection Methods**: Works with various Shopify theme structures
-   **Console Ready**: Copy-paste directly into browser console

### Usage

1. **Open a Shopify product page** (e.g., https://technical-assessment-store.myshopify.com/products/mesmerizing-beagle-dog-can-sleeve)
2. **Open browser console** (F12 → Console)
3. **Copy and paste** the entire script from `dynamic-variatio-badge-detection.js`
4. **Press Enter** to execute
5. **Change variants** - watch the badge appear with the variant name!

### Detection Methods

-   JSON script parsing (primary method)
-   Radio button state detection
-   Variant selector monitoring
-   Form change listeners

### Styling

-   Modern gradient design with Shopify brand colors
-   Responsive design for mobile/desktop
-   Dark mode support
-   Smooth CSS animations

## Development

The extension uses Chrome Manifest V3 and requires these permissions:

-   `activeTab` - Access current tab
-   `scripting` - Inject detection scripts
-   `tabs` - Query tab information

---
