/**
 * Mobile sidebar open / close for the native blog layout.
 */
(function () {
  var toggle = document.querySelector(".sidebar-toggle");
  var backdrop = document.querySelector(".sidebar-backdrop");
  if (!toggle) return;

  function setOpen(open) {
    document.body.classList.toggle("sidebar-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("sidebar-open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  document.querySelectorAll(".sidebar a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });
})();
