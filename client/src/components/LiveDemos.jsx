import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock, WifiOff, Loader2, Monitor } from 'lucide-react';

// Live app URLs. Set url to null to show "Coming soon".
// Both apps run on the owner's home server, so each is probed before its button is enabled.
const DEMO_APPS = {
  expenseOs: {
    name: 'Expense OS',
    tagline: 'Personal finance dashboard',
    description: 'A personal finance dashboard for tracking spending, budgets and accounts in one place.',
    url: 'https://home-server.tail709e96.ts.net:8443',
    screenshots: ['/demos/expense-os.jpg'],
  },
};

// Opaque no-cors fetch: resolves on any HTTP response, rejects when the server is unreachable.
async function isReachable(url) {
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(6000) });
    return true;
  } catch {
    return false;
  }
}

function DemoCard({ app }) {
  const [status, setStatus] = useState(app.url ? 'checking' : 'soon');

  useEffect(() => {
    if (!app.url) return;
    let alive = true;
    isReachable(app.url).then(ok => alive && setStatus(ok ? 'online' : 'offline'));
    return () => { alive = false; };
  }, [app.url]);

  const shot = app.screenshots[0];

  return (
    <article className="flex flex-col rounded-2xl border border-[#23232c] bg-[#131319] overflow-hidden">
      <div className="aspect-[4/3] bg-slate-900 relative">
        {shot ? (
          <img src={shot} alt={`${app.name} screenshot`} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#e10600] to-[#7c3aed] text-white">
            <Monitor className="w-10 h-10 opacity-80" />
            <span className="text-sm font-semibold">Screenshots coming soon</span>
          </div>
        )}
        {app.screenshots.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            {app.screenshots.slice(1).map(s => (
              <img key={s} src={s} alt="" loading="lazy" className="w-16 h-12 object-cover rounded-md border border-white/40" />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <p className="cf-mono">{app.tagline}</p>
        <h3 className="mt-1 text-xl font-bold text-white">{app.name}</h3>
        <p className="mt-2 text-sm text-[#a9a9b6] flex-1">{app.description}</p>
        <div className="mt-5">
          {status === 'online' ? (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cf-btn cf-btn-red cf-btn-sm"
            >
              Try it live <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b1b22] text-[#8b8b98] text-sm font-semibold border border-[#23232c] cursor-not-allowed"
            >
              {status === 'checking' && <><Loader2 className="w-4 h-4 animate-spin" /> Checking demo…</>}
              {status === 'offline' && <><WifiOff className="w-4 h-4" /> Demo offline right now</>}
              {status === 'soon' && <><Clock className="w-4 h-4" /> Coming soon</>}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LiveDemos() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Object.entries(DEMO_APPS).map(([id, app]) => <DemoCard key={id} app={app} />)}
    </div>
  );
}
