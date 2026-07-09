/**
 * Shared table of contents for the native X API blog.
 * Set `data-page` on <body> to the active page id (e.g. "intro", "xurl").
 * Set `data-depth` to how many directories deep the page is under xapi/ (0, 1, or 2).
 */
(function () {
  var PAGES = [
    { id: "intro", title: "Introduction", href: "./index.html" },
    { section: "Helpful tools" },
    { id: "xurl", title: "xURL", href: "./1_tools/xurl.html" },
    { section: "Getting real-time signal" },
    { id: "webhooks", title: "Webhooks", href: "./2_realtime/1_webhooks/0_webhooks.html" },
    {
      id: "webhook-app",
      title: "Writing a basic webhook app",
      href: "./2_realtime/1_webhooks/1_sample_app.html",
      nested: true,
    },
    {
      id: "xurl-webhook",
      title: "Temporary webhooks with xURL",
      href: "./2_realtime/1_webhooks/2_xurl_webhook.html",
      nested: true,
    },
    {
      id: "registration",
      title: "Registering the webhook with X",
      href: "./2_realtime/1_webhooks/3_registration.html",
      nested: true,
    },
    {
      id: "replay",
      title: "Replay webhook events",
      href: "./2_realtime/1_webhooks/4_replay.html",
      nested: true,
    },
    { id: "xaa", title: "X Activity API", href: "./2_realtime/2_xaa/0_xaa.html" },
    {
      id: "events-auth",
      title: "Event types and authentication",
      href: "./2_realtime/2_xaa/1_events_and_auth.html",
      nested: true,
    },
    {
      id: "subscribe-public",
      title: "Subscribing to public events",
      href: "./2_realtime/2_xaa/2_subscribe_public.html",
      nested: true,
    },
    {
      id: "subscribe-private",
      title: "Subscribing to private events",
      href: "./2_realtime/2_xaa/3_subscribe_private.html",
      nested: true,
    },
    {
      id: "news",
      title: "News by keyword",
      href: "./2_realtime/2_xaa/4_news.html",
      nested: true,
    },
    {
      id: "direction",
      title: "Direction filter",
      href: "./2_realtime/2_xaa/5_direction_filter.html",
      nested: true,
    },
  ];

  function hrefFor(page) {
    if (!page.href) return null;
    var depth = (document.body.getAttribute("data-depth") || "0") | 0;
    if (depth <= 0) return page.href;
    if (page.href.indexOf("./") === 0) {
      return "../".repeat(depth) + page.href.slice(2);
    }
    return page.href;
  }

  function render() {
    var mount = document.querySelector("[data-toc]");
    if (!mount) return;

    var active = document.body.getAttribute("data-page") || "";

    var html = '<div class="sidebar-title">X API Blog</div><ul class="sidebar-nav">';

    PAGES.forEach(function (page) {
      if (page.section) {
        html += '<li class="sidebar-section">' + page.section + "</li>";
        return;
      }

      var classes = [];
      if (page.nested) classes.push("nested");
      if (page.id === active) classes.push("active");
      var classAttr = classes.length ? ' class="' + classes.join(" ") + '"' : "";

      var href = hrefFor(page);
      if (href) {
        html +=
          "<li><a" +
          classAttr +
          ' href="' +
          href +
          '">' +
          page.title +
          "</a></li>";
      } else {
        html +=
          "<li><span class=\"sidebar-soon" +
          (page.nested ? " nested" : "") +
          '">' +
          page.title +
          "</span></li>";
      }
    });

    html += "</ul>";
    mount.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
