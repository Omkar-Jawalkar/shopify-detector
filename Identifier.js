(function () {
    // Configuration
    const CONFIG = {
        bannerId: "shopify-detector-banner",
        bannerText: "Built with Shopify",
        checkInterval: 1000,
        maxChecks: 10,
    };

    let checkCount = 0;
    let bannerCreated = false;
    
    function isShopifyWebsite() {
        // Check for window.Shopify object
        if (typeof window?.Shopify !== "undefined") {
            return true;
        }

        // Check for Shopify-specific meta tags
        const shopifyMeta = document.querySelector(
            'meta[name="shopify-checkout-api-version"]'
        );
        if (shopifyMeta) {
            return true;
        }

        // Check for Shopify-specific scripts
        const shopifyScripts = document.querySelectorAll(
            'script[src*="shopify"]'
        );
        if (shopifyScripts.length > 0) {
            return true;
        }

        return false;
    }

    function createBanner() {
        if (bannerCreated) return;

        // Remove any existing banner
        const existingBanner = document.getElementById(CONFIG.bannerId);
        if (existingBanner) {
            existingBanner.remove();
        }

        // Create banner element
        const banner = document.createElement("div");
        banner.id = CONFIG.bannerId;
        banner.className = "shopify-detector-banner";
        banner.innerHTML = `
            <div class="banner-content">
                <span class="banner-text">${CONFIG.bannerText}</span>
                <button class="banner-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.insertBefore(banner, document.body.firstChild);
        bannerCreated = true;
    }

    function detectShopify() {
        checkCount++;

        if (isShopifyWebsite()) {
            createBanner();
            return true;
        }

        // If we haven't found Shopify yet and haven't exceeded max checks, try again
        if (checkCount < CONFIG.maxChecks) {
            setTimeout(detectShopify, CONFIG.checkInterval);
        } else {
            updateExtensionIcon(false);
        }

        return false;
    }

    function init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", detectShopify);
        } else {
            detectShopify();
        }
    }

    // Start the detection
    init();
})();
