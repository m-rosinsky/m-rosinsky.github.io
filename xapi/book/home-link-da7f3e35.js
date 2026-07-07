/**
 * Adds a "Home" link to the mdBook menu bar that points back to the
 * portfolio home page at the site root (two levels above the book root).
 */
(function () {
    var HOUSE_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">' +
        '<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V464c0 26.5-21.5 48-48 48H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-26.5 0-48-21.5-48-48V448 384c0-17.7-14.3-32-32-32H288c-17.7 0-32 14.3-32 32v64 16c0 26.5-21.5 48-48 48H184 120.5c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-26.5 0-48-21.5-48-48V416c0-.9 0-1.9 .1-2.8V287.6H24c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>' +
        "</svg>";

    function install() {
        var rightButtons = document.querySelector("#mdbook-menu-bar .right-buttons");
        if (!rightButtons) return;
        if (rightButtons.querySelector(".home-link")) return;

        var root = typeof path_to_root !== "undefined" ? path_to_root : "";

        var link = document.createElement("a");
        link.className = "home-link";
        link.href = root + "../../index.html";
        link.title = "Back to portfolio home";
        link.setAttribute("aria-label", "Back to portfolio home");

        var icon = document.createElement("span");
        icon.className = "fa-svg";
        icon.innerHTML = HOUSE_SVG;

        link.appendChild(icon);
        rightButtons.insertBefore(link, rightButtons.firstChild);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install);
    } else {
        install();
    }
})();
