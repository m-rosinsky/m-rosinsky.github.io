// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="../../index.html">Introduction</a></span></li><li class="chapter-item expanded "><li class="part-title">Helpful tools</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="1_tools/1_xurl/xurl.html"><strong aria-hidden="true">1.</strong> xURL</a></span></li><li class="chapter-item expanded "><li class="part-title">Getting real-time signal</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/1_webhooks/0_webhooks.html"><strong aria-hidden="true">2.</strong> Webhooks</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/1_webhooks/1_sample_app.html"><strong aria-hidden="true">2.1.</strong> Writing a basic webhook app</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/1_webhooks/2_xurl_webhook.html"><strong aria-hidden="true">2.2.</strong> Temporary webhooks with xURL</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/1_webhooks/3_registration.html"><strong aria-hidden="true">2.3.</strong> Registering the webhook with X</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/1_webhooks/4_replay.html"><strong aria-hidden="true">2.4.</strong> Replay webhook events</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/0_xaa.html"><strong aria-hidden="true">3.</strong> X Activity API</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/1_events_and_auth.html"><strong aria-hidden="true">3.1.</strong> Event types and authentication</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/2_subscribe_public.html"><strong aria-hidden="true">3.2.</strong> Subscribing to public events</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/3_subscribe_private.html"><strong aria-hidden="true">3.3.</strong> Subscribing to private events</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/4_news.html"><strong aria-hidden="true">3.4.</strong> News by keyword</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="2_realtime/2_xaa/5_direction_filter.html"><strong aria-hidden="true">3.5.</strong> Direction filter</a></span></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);

