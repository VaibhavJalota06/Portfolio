import React, { useState } from 'react';
import { Lock } from 'lucide-react';

// The only website setting still in use: the admin PIN. (Site text lives in the code; see contact.js.)
export default function SettingsPanel({ onSaveSettings }) {
  const [adminPin, setAdminPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminPin.length < 4) return;
    onSaveSettings({ admin_pin: adminPin });
    setAdminPin('');
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold flex items-center gap-2"><Lock className="w-4 h-4 text-blue-600" /> Admin PIN</h2>
      <p className="mt-1 text-sm text-slate-500">Change the PIN used to open this dashboard. The current PIN is never shown.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3 flex-wrap">
        <input
          type="password" inputMode="numeric" maxLength={6}
          aria-label="New admin PIN"
          value={adminPin}
          onChange={e => setAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="New 4–6 digit PIN"
          className="w-56 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 tracking-widest focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
        <button type="submit" disabled={adminPin.length < 4}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer focus-ring">
          Update PIN
        </button>
      </form>
    </section>
  );
}
