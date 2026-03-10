import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Viofel Transport';

// ─── Fix: Prevent stale admin pages on browser Back/Forward ───
//
// Problem: Inertia.js is a SPA. When the user presses Back or Forward,
// Inertia restores a cached snapshot of the page WITH OLD auth props.
// This means:
//   1. After logout → Back shows cached admin page (old props say "logged in")
//   2. While logged in → Back shows cached login page (old props say "logged out")
//
// Solution: Intercept the browser's `popstate` event (fires on Back/Forward)
// and force a full server page reload for any /admin URL. The server then
// runs its middleware:
//   - RedirectIfNotAdmin → sends unauthenticated users to /admin/login
//   - showLogin() auth check → sends authenticated users to /admin/analytics
//
// This only affects Back/Forward (popstate). Normal link clicks use Inertia's
// pushState and are NOT affected — SPA navigation within admin stays fast.

window.addEventListener('popstate', () => {
    if (window.location.pathname.startsWith('/admin')) {
        window.location.reload();
    }
});

// Also handle native browser bfcache (completely frozen page snapshots)
window.addEventListener('pageshow', (e) => {
    if (e.persisted && window.location.pathname.startsWith('/admin')) {
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
