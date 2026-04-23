/**
 * Adds a "Copy as md" control to the top of each chapter page. Fetches mirrored source from
 * `_md_src/` (populated by `make` after `mdbook build`).
 */
(function () {
    var CLIPBOARD_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
        '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
        "</svg>";

    function getMdFetchUrl() {
        var pathname = window.location.pathname.split("?")[0].split("#")[0];
        var rel = pathname;
        var bookIdx = pathname.indexOf("/book/");
        if (bookIdx >= 0) {
            rel = pathname.slice(bookIdx + 6);
        } else {
            rel = pathname.replace(/^\/+/, "");
        }
        if (!rel || rel.endsWith("/")) {
            rel = rel.endsWith("/") ? rel + "index.html" : "index.html";
        }
        if (rel === "print.html" || rel === "404.html" || rel === "toc.html") {
            return null;
        }
        if (rel === "index.html") {
            rel = "README.md";
        } else if (!rel.endsWith(".html")) {
            return null;
        } else {
            rel = rel.slice(0, -5) + ".md";
        }
        var root = typeof path_to_root !== "undefined" ? path_to_root : "";
        try {
            return new URL(root + "_md_src/" + rel, window.location.href);
        } catch (e) {
            return null;
        }
    }

    function setState(btn, labelEl, state, text) {
        btn.classList.remove("is-success", "is-error");
        if (state === "success") btn.classList.add("is-success");
        if (state === "error") btn.classList.add("is-error");
        labelEl.textContent = text;
    }

    function install() {
        var url = getMdFetchUrl();
        if (!url) return;

        var main = document.querySelector("#mdbook-content main");
        if (!main) return;
        if (main.querySelector(".copy-md-bar")) return;

        var wrap = document.createElement("div");
        wrap.className = "copy-md-bar";

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-md-btn";
        btn.setAttribute("aria-label", "Copy this page as Markdown");
        btn.title = "Copy this chapter’s Markdown source for use in AI tools";

        var icon = document.createElement("span");
        icon.className = "copy-md-btn__icon";
        icon.innerHTML = CLIPBOARD_SVG;

        var label = document.createElement("span");
        label.className = "copy-md-btn__label";
        label.textContent = "Copy as md";

        btn.appendChild(icon);
        btn.appendChild(label);

        var defaultLabel = "Copy as md";

        btn.addEventListener("click", function () {
            btn.disabled = true;
            setState(btn, label, "", defaultLabel);
            fetch(url, { credentials: "same-origin" })
                .then(function (r) {
                    if (!r.ok) throw new Error(r.statusText);
                    return r.text();
                })
                .then(function (text) {
                    return navigator.clipboard.writeText(text);
                })
                .then(function () {
                    setState(btn, label, "success", "Copied");
                    setTimeout(function () {
                        setState(btn, label, "", defaultLabel);
                        btn.disabled = false;
                    }, 1600);
                })
                .catch(function () {
                    setState(btn, label, "error", "Failed");
                    setTimeout(function () {
                        setState(btn, label, "", defaultLabel);
                        btn.disabled = false;
                    }, 2000);
                });
        });

        wrap.appendChild(btn);
        main.insertBefore(wrap, main.firstChild);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install);
    } else {
        install();
    }
})();
