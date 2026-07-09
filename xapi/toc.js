/**
 * Shared table of contents for the native X API blog.
 * Set `data-page` on <body> to the active page id (e.g. "intro", "xurl").
 * Set `data-depth` to how many directories deep the page is under xapi/ (0, 1, or 2).
 *
 * Nav roles:
 *   - page:     clickable leaf
 *   - series:   clickable overview page that owns child pages
 *   - category: non-clickable group label
 */
(function () {
  var NAV = [
    { id: "intro", title: "Introduction", href: "./index.html" },
    {
      category: "Helpful tools",
      pages: [{ id: "xurl", title: "xURL", href: "./1_tools/xurl.html" }],
    },
    {
      category: "Getting real-time signal",
      pages: [
        {
          id: "webhooks",
          title: "Webhooks",
          href: "./2_realtime/1_webhooks/0_webhooks.html",
          pages: [
            {
              id: "webhook-app",
              title: "Writing a basic webhook app",
              href: "./2_realtime/1_webhooks/1_sample_app.html",
            },
            {
              id: "xurl-webhook",
              title: "Temporary webhooks with xURL",
              href: "./2_realtime/1_webhooks/2_xurl_webhook.html",
            },
            {
              id: "registration",
              title: "Registering the webhook with X",
              href: "./2_realtime/1_webhooks/3_registration.html",
            },
            {
              id: "replay",
              title: "Replay webhook events",
              href: "./2_realtime/1_webhooks/4_replay.html",
            },
          ],
        },
        {
          id: "xaa",
          title: "X Activity API",
          href: "./2_realtime/2_xaa/0_xaa.html",
          pages: [
            {
              id: "events-auth",
              title: "Event types and authentication",
              href: "./2_realtime/2_xaa/1_events_and_auth.html",
            },
            {
              id: "subscribe-public",
              title: "Subscribing to public events",
              href: "./2_realtime/2_xaa/2_subscribe_public.html",
            },
            {
              id: "subscribe-private",
              title: "Subscribing to private events",
              href: "./2_realtime/2_xaa/3_subscribe_private.html",
            },
            {
              id: "news",
              title: "News by keyword",
              href: "./2_realtime/2_xaa/4_news.html",
            },
            {
              id: "direction",
              title: "Direction filter",
              href: "./2_realtime/2_xaa/5_direction_filter.html",
            },
          ],
        },
      ],
    },
  ];

  function hrefFor(href) {
    if (!href) return null;
    var depth = (document.body.getAttribute("data-depth") || "0") | 0;
    if (depth <= 0) return href;
    if (href.indexOf("./") === 0) {
      return "../".repeat(depth) + href.slice(2);
    }
    return href;
  }

  function containsPage(node, active) {
    if (node.id === active) return true;
    return (node.pages || []).some(function (child) {
      return containsPage(child, active);
    });
  }

  function renderPage(page, active, level) {
    var href = hrefFor(page.href);
    var hasChildren = page.pages && page.pages.length;
    var isActive = page.id === active;
    var inSeries = hasChildren && containsPage(page, active);

    var classes = ["nav-item"];
    if (level === 0) classes.push("nav-item--top");
    if (level > 0) classes.push("nav-item--nested");
    if (hasChildren) classes.push("nav-item--series");
    if (isActive) classes.push("is-active");
    if (inSeries && !isActive) classes.push("is-current-series");

    var html =
      '<li' + (hasChildren ? ' class="nav-series"' : "") + ">";
    if (href) {
      html +=
        '<a class="' +
        classes.join(" ") +
        '" href="' +
        href +
        '">' +
        page.title +
        "</a>";
    } else {
      html +=
        '<span class="' +
        classes.join(" ") +
        ' is-soon">' +
        page.title +
        "</span>";
    }

    if (hasChildren) {
      html += '<ul class="nav-list nav-list--nested">';
      page.pages.forEach(function (child) {
        html += renderPage(child, active, level + 1);
      });
      html += "</ul>";
    }

    html += "</li>";
    return html;
  }

  function render() {
    var mount = document.querySelector("[data-toc]");
    if (!mount) return;

    var active = document.body.getAttribute("data-page") || "";
    var html =
      '<p class="nav-brand">X API Blog</p>' +
      '<nav class="nav-toc" aria-label="Chapters">';

    NAV.forEach(function (entry) {
      if (entry.category) {
        html += '<div class="nav-group">';
        html += '<p class="nav-category">' + entry.category + "</p>";
        html += '<ul class="nav-list">';
        (entry.pages || []).forEach(function (page) {
          html += renderPage(page, active, 0);
        });
        html += "</ul></div>";
        return;
      }

      html += '<ul class="nav-list">' + renderPage(entry, active, 0) + "</ul>";
    });

    html += "</nav>";
    mount.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
