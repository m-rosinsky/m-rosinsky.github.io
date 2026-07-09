/**
 * Adds a top-right "Copy" button to every <pre> code block in the article.
 */
(function () {
  var COPY_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
    "</svg>";

  var CHECK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 6L9 17l-5-5"/>' +
    "</svg>";

  function install() {
    document.querySelectorAll(".prose pre").forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains("code-block")) {
        return;
      }

      var wrap = document.createElement("div");
      wrap.className = "code-block";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-code-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.title = "Copy";
      btn.innerHTML = COPY_SVG + '<span class="copy-code-btn__label">Copy</span>';

      btn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        var text = (code || pre).innerText.replace(/\n$/, "");

        function succeed() {
          btn.classList.add("is-success");
          btn.innerHTML = CHECK_SVG + '<span class="copy-code-btn__label">Copied</span>';
          setTimeout(function () {
            btn.classList.remove("is-success");
            btn.innerHTML = COPY_SVG + '<span class="copy-code-btn__label">Copy</span>';
          }, 1600);
        }

        function fail() {
          btn.classList.add("is-error");
          btn.querySelector(".copy-code-btn__label").textContent = "Failed";
          setTimeout(function () {
            btn.classList.remove("is-error");
            btn.innerHTML = COPY_SVG + '<span class="copy-code-btn__label">Copy</span>';
          }, 1600);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(succeed).catch(fail);
        } else {
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
            succeed();
          } catch (e) {
            fail();
          }
        }
      });

      wrap.appendChild(btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
})();
