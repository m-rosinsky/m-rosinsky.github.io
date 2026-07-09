/**
 * Adds a compact copy menu (icon + caret) inline with the breadcrumb.
 * Options:
 *   - "Copy as text" — plain text of the rendered article
 *   - "Copy as md"   — Markdown converted from the rendered article via Turndown
 */
(function () {
  var CLIPBOARD_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
    "</svg>";

  var CARET_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M6 9l6 6 6-6"/>' +
    "</svg>";

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function articleClone(article) {
    var clone = article.cloneNode(true);
    clone
      .querySelectorAll(".article-toolbar, .article-nav, .copy-menu, .copy-code-btn, .breadcrumb, .meta")
      .forEach(function (el) {
        el.remove();
      });
    // Unwrap code-block wrappers so Turndown sees bare <pre>
    clone.querySelectorAll(".code-block").forEach(function (wrap) {
      var pre = wrap.querySelector("pre");
      if (pre) wrap.parentNode.insertBefore(pre, wrap);
      wrap.remove();
    });
    return clone;
  }

  function articlePlainText(article) {
    return articleClone(article).innerText.replace(/\n{3,}/g, "\n\n").trim();
  }

  function articleMarkdown(article) {
    if (typeof TurndownService === "undefined") {
      throw new Error("Turndown is not loaded");
    }

    var service = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "*",
      strongDelimiter: "**",
    });

    service.addRule("fencedCode", {
      filter: ["pre"],
      replacement: function (_content, node) {
        var code = node.querySelector("code") || node;
        var text = code.textContent.replace(/\n$/, "");
        return "\n\n```\n" + text + "\n```\n\n";
      },
    });

    service.addRule("callout", {
      filter: function (node) {
        return node.nodeName === "DIV" && node.classList.contains("callout");
      },
      replacement: function (content, node) {
        var titleEl = node.querySelector(".callout-title, :scope > strong");
        var title = titleEl ? titleEl.textContent.trim() : "Note";
        var body = content
          .replace(title, "")
          .replace(/^\s+|\s+$/g, "")
          .split("\n")
          .map(function (line) {
            return "> " + line;
          })
          .join("\n");
        return "\n\n> **" + title + "**\n" + body + "\n\n";
      },
    });

    service.addRule("spoiler", {
      filter: function (node) {
        return (
          node.nodeName === "DETAILS" && node.classList.contains("spoiler")
        );
      },
      replacement: function (_content, node) {
        var summary = node.querySelector("summary");
        var body = node.querySelector(".spoiler-body") || node;
        var title = summary ? summary.textContent.trim() : "Details";
        var inner = new TurndownService({
          headingStyle: "atx",
          codeBlockStyle: "fenced",
          bulletListMarker: "-",
        });
        inner.addRule("fencedCode", {
          filter: ["pre"],
          replacement: function (_c, n) {
            var code = n.querySelector("code") || n;
            return "\n\n```\n" + code.textContent.replace(/\n$/, "") + "\n```\n\n";
          },
        });
        var md = inner.turndown(body.innerHTML).trim();
        return (
          "\n\n<details>\n<summary>" +
          title +
          "</summary>\n\n" +
          md +
          "\n\n</details>\n\n"
        );
      },
    });

    var clone = articleClone(article);
    var title = clone.querySelector("h1");
    var prose = clone.querySelector(".prose") || clone;
    var parts = [];
    if (title) parts.push("# " + title.textContent.trim());
    parts.push(service.turndown(prose.innerHTML).trim());
    return parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  var skillTipTimer = null;

  function skillLink() {
    var links = document.querySelectorAll(".nav-links a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (/SKILL\.md$/i.test(href) || links[i].textContent.trim() === "Skill") {
        return links[i];
      }
    }
    return null;
  }

  function hideSkillTip() {
    var tip = document.querySelector(".skill-tip");
    if (!tip) return;
    tip.classList.remove("is-visible");
    if (skillTipTimer) {
      clearTimeout(skillTipTimer);
      skillTipTimer = null;
    }
  }

  function showSkillTip() {
    var link = skillLink();
    if (!link) return;

    var tip = document.querySelector(".skill-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "skill-tip";
      tip.setAttribute("role", "status");
      tip.innerHTML =
        '<span class="skill-tip__arrow" aria-hidden="true"></span>' +
        '<p class="skill-tip__text">Pssst — looking for me?</p>';
      link.classList.add("nav-skill");
      link.appendChild(tip);

    }

    // Restart visibility so repeat copies re-trigger the animation.
    tip.classList.remove("is-visible");
    // Force reflow so the transition replays.
    void tip.offsetWidth;
    tip.classList.add("is-visible");

    if (skillTipTimer) clearTimeout(skillTipTimer);
    skillTipTimer = setTimeout(hideSkillTip, 4500);

    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") {
        hideSkillTip();
        document.removeEventListener("keydown", onKey);
      }
    });
  }

  function install() {
    var article = document.querySelector("article");
    if (!article || article.querySelector(".copy-menu")) return;

    var breadcrumb = article.querySelector(".breadcrumb");
    if (!breadcrumb) return;

    var row = document.createElement("div");
    row.className = "article-toolbar";
    breadcrumb.parentNode.insertBefore(row, breadcrumb);
    row.appendChild(breadcrumb);

    var menu = document.createElement("div");
    menu.className = "copy-menu";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-menu-btn";
    btn.setAttribute("aria-label", "Copy page");
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");
    btn.title = "Copy page";
    btn.innerHTML =
      '<span class="copy-menu-btn__icon">' +
      CLIPBOARD_SVG +
      "</span>" +
      '<span class="copy-menu-btn__caret">' +
      CARET_SVG +
      "</span>";

    var dropdown = document.createElement("div");
    dropdown.className = "copy-menu-dropdown";
    dropdown.setAttribute("role", "menu");
    dropdown.hidden = true;

    function addItem(label, action) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "copy-menu-item";
      item.setAttribute("role", "menuitem");
      item.textContent = label;
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        close();
        action(item);
      });
      dropdown.appendChild(item);
    }

    function flash(item, ok) {
      var original = item.textContent;
      item.classList.toggle("is-success", ok);
      item.classList.toggle("is-error", !ok);
      item.textContent = ok ? "Copied" : "Failed";
      setTimeout(function () {
        item.classList.remove("is-success", "is-error");
        item.textContent = original;
      }, 1400);
    }

    addItem("Copy as text", function (item) {
      writeClipboard(articlePlainText(article))
        .then(function () {
          flash(item, true);
        })
        .catch(function () {
          flash(item, false);
        });
    });

    addItem("Copy as md", function (item) {
      try {
        var md = articleMarkdown(article);
        writeClipboard(md)
          .then(function () {
            flash(item, true);
            showSkillTip();
          })
          .catch(function () {
            flash(item, false);
          });
      } catch (e) {
        flash(item, false);
      }
    });

    function open() {
      dropdown.hidden = false;
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }

    function close() {
      dropdown.hidden = true;
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.classList.contains("is-open")) close();
      else open();
    });

    document.addEventListener("click", function () {
      close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    menu.appendChild(btn);
    menu.appendChild(dropdown);
    row.appendChild(menu);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
})();
