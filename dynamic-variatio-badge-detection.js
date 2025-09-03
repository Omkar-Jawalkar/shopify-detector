(function () {
    "use strict";

    // Configuration
    const CONFIG = {
        badgeId: "variant-badge",
        badgeClass: "variant-badge",
        animationDuration: 300,
        checkInterval: 100,
        maxRetries: 50,
    };

    let currentVariant = null;
    let badgeElement = null;
    let retryCount = 0;


    function createStyles() {
        const styleId = "variant-badge-styles";

        // Remove existing styles if they exist
        const existingStyles = document.getElementById(styleId);
        if (existingStyles) {
            existingStyles.remove();
        }

        const styles = document.createElement("style");
        styles.id = styleId;
        styles.textContent = `
            .${CONFIG.badgeClass} {
                position: absolute;
                top: 15px;
                right: 15px;
                background: linear-gradient(135deg, #95BF47 0%, #7BA05B 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 12px rgba(149, 191, 71, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                z-index: 1000;
                opacity: 0;
                transform: translateY(-10px) scale(0.9);
                transition: all ${CONFIG.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                user-select: none;
            }

            .${CONFIG.badgeClass}.show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .${CONFIG.badgeClass}.hide {
                opacity: 0;
                transform: translateY(-10px) scale(0.9);
            }

            .${CONFIG.badgeClass}::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(135deg, #95BF47, #7BA05B);
                border-radius: 22px;
                z-index: -1;
                opacity: 0.3;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1.05);
                    opacity: 0.5;
                }
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .${CONFIG.badgeClass} {
                    top: 10px;
                    right: 10px;
                    padding: 6px 12px;
                    font-size: 12px;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .${CONFIG.badgeClass} {
                    background: linear-gradient(135deg, #7BA05B 0%, #5A7A3A 100%);
                    box-shadow: 0 4px 12px rgba(123, 160, 91, 0.4);
                }
            }
        `;

        document.head.appendChild(styles);
    }

    function findProductImage() {
        // Common selectors for Shopify product images
        const selectors = [
            ".product-single__media",
            ".product__media",
            ".product-image-main",
            ".product-photos",
            ".product-single__photos",
            ".product__photo",
            ".product-image",
            ".main-product-image",
            "[data-product-image]",
            ".product__media-wrapper",
            ".product-single__media-wrapper",
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        // Fallback: look for images with product-related classes or data attributes
        const images = document.querySelectorAll(
            'img[src*="products"], img[class*="product"], img[data-product]'
        );
        if (images.length > 0) {
            return images[0].closest("div") || images[0].parentElement;
        }

        return null;
    }

    function getCurrentVariant() {
        // Check for the JSON script with selected variant data
        const variantScript = document.querySelector(
            "script[data-selected-variant]"
        );
        if (variantScript) {
            try {
                const variantData = JSON.parse(variantScript.textContent);
                if (variantData && variantData.title) {
                    return variantData.title;
                }
            } catch (e) {
                console.warn("Failed to parse variant JSON:", e);
            }
        }

        //Check for checked radio buttons with option values
        const checkedRadios = document.querySelectorAll(
            'input[type="radio"]:checked'
        );
        if (checkedRadios.length > 0) {
            const selectedOptions = [];
            checkedRadios.forEach((radio) => {
                const label = document.querySelector(
                    `label[for="${radio.id}"]`
                );
                if (label) {
                    const textContent = label.textContent
                        .replace(/Variant sold out or unavailable/gi, "")
                        .trim();
                    if (textContent) {
                        selectedOptions.push(textContent);
                    }
                }
            });
            if (selectedOptions.length > 0) {
                return selectedOptions.join(" / ");
            }
        }

        //Check for variant selectors with name="id"
        const variantSelect = document.querySelector('select[name="id"]');
        if (variantSelect) {
            const selectedOption =
                variantSelect.options[variantSelect.selectedIndex];
            if (selectedOption && selectedOption.textContent) {
                return selectedOption.textContent.trim();
            }
        }

        return null;
    }

    function createBadge(variantName) {
        if (badgeElement) {
            badgeElement.remove();
        }

        badgeElement = document.createElement("div");
        badgeElement.id = CONFIG.badgeId;
        badgeElement.className = CONFIG.badgeClass;
        badgeElement.textContent = variantName;

        return badgeElement;
    }

    function showBadge(variantName) {
        const productImage = findProductImage();
        if (!productImage) {
            console.warn("Variant Badge: Product image container not found");
            return;
        }

        // Make sure the container has relative positioning
        const computedStyle = window.getComputedStyle(productImage);
        if (computedStyle.position === "static") {
            productImage.style.position = "relative";
        }

        const badge = createBadge(variantName);
        productImage.appendChild(badge);

        // Trigger animation
        requestAnimationFrame(() => {
            badge.classList.add("show");
        });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            hideBadge();
        }, 3000);
    }

    function hideBadge() {
        if (badgeElement) {
            badgeElement.classList.remove("show");
            badgeElement.classList.add("hide");

            setTimeout(() => {
                if (badgeElement && badgeElement.parentNode) {
                    badgeElement.parentNode.removeChild(badgeElement);
                }
                badgeElement = null;
            }, CONFIG.animationDuration);
        }
    }

    function checkVariantChange() {
        const newVariant = getCurrentVariant();

        if (newVariant && newVariant !== currentVariant) {
            currentVariant = newVariant;
            showBadge(newVariant);
            console.log(`Variant changed to: ${newVariant}`);
        }
    }

    function setupEventListeners() {
        // Listen for changes on variant selectors
        const variantSelects = document.querySelectorAll(
            'select[name="id"], select[data-variant-id]'
        );
        variantSelects.forEach((select) => {
            select.addEventListener("change", checkVariantChange);
        });

        // Listen for clicks on all radio buttons (for color, size, etc.)
        const allRadios = document.querySelectorAll('input[type="radio"]');
        allRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                // Small delay to allow DOM to update
                setTimeout(checkVariantChange, 150);
            });
        });

        // Listen for clicks on variant buttons/radios with specific selectors
        const variantButtons = document.querySelectorAll(
            'input[name="id"][type="radio"], input[data-variant-id][type="radio"], ' +
                ".variant-button, .variant-option, [data-variant], [data-option-value]"
        );
        variantButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // Small delay to allow DOM to update
                setTimeout(checkVariantChange, 100);
            });
        });

        // Listen for clicks on labels (since clicking label triggers radio change)
        const variantLabels = document.querySelectorAll(
            'label[for*="template"]'
        );
        variantLabels.forEach((label) => {
            label.addEventListener("click", () => {
                setTimeout(checkVariantChange, 200);
            });
        });

        // Listen for Shopify's variant change events
        document.addEventListener("variant:change", checkVariantChange);
        document.addEventListener("variantChange", checkVariantChange);

        // Listen for custom events that might be triggered by theme scripts
        window.addEventListener("variantChange", checkVariantChange);
        window.addEventListener("shopify:variant:change", checkVariantChange);

        // Listen for form changes (since variants are in forms)
        const productForms = document.querySelectorAll(
            'form[id*="product-form"]'
        );
        productForms.forEach((form) => {
            form.addEventListener("change", () => {
                setTimeout(checkVariantChange, 100);
            });
        });
    }

    function init() {
        console.log("Variant Badge Detector: Initializing...");

        createStyles();

        setupEventListeners();

        const initialVariant = getCurrentVariant();
        if (initialVariant) {
            currentVariant = initialVariant;
            console.log(`Initial variant detected: ${initialVariant}`);
        } else {
            const retryInterval = setInterval(() => {
                retryCount++;
                const variant = getCurrentVariant();

                if (variant) {
                    currentVariant = variant;
                    console.log(
                        `Variant detected after ${retryCount} retries: ${variant}`
                    );
                    clearInterval(retryInterval);
                } else if (retryCount >= CONFIG.maxRetries) {
                    console.log(
                        "Variant Badge: Could not detect initial variant after maximum retries"
                    );
                    clearInterval(retryInterval);
                }
            }, CONFIG.checkInterval);
        }

        setInterval(checkVariantChange, 1000);

        console.log("Variant Badge Detector: Ready!");
    }

    function cleanup() {
        if (badgeElement) {
            badgeElement.remove();
            badgeElement = null;
        }

        const styles = document.getElementById("variant-badge-styles");
        if (styles) {
            styles.remove();
        }

        console.log("Variant Badge Detector: Cleaned up");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.variantBadgeCleanup = cleanup;

    window.addEventListener("beforeunload", cleanup);
})();
