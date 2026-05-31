// ── Supabase logger — logs each simulation run (debounced) ──
(function () {
  const URL  = 'https://jhjbbzpmutrgsfscskow.supabase.co';
  const KEY  = 'sb_publishable_8QM_ac6ThtSQBvOyb3oyPA_i_uxs4tq';

  async function logRun(payload) {
    try {
      await fetch(`${URL}/rest/v1/simulation_runs`, {
        method: 'POST',
        headers: {
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(payload),
      });
    } catch (_) {}
  }

  // Debounce: wait 3 s of inactivity before logging
  let timer = null;
  function scheduleLog(payload) {
    clearTimeout(timer);
    timer = setTimeout(() => logRun(payload), 3000);
  }

  window.SupabaseLogger = { scheduleLog };
})();
