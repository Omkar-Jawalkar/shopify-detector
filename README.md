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

## Development

The extension uses Chrome Manifest V3 and requires these permissions:

-   `activeTab` - Access current tab
-   `scripting` - Inject detection scripts
-   `tabs` - Query tab information

---
