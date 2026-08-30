// Helper function to generate standardized Rate Card & Resume text automatically
export function generateRateCardText(settings) {
  const sym = settings?.rate_currency || '₹';
  const name = (settings?.editor_name || 'VAIBHAV JALOTA').toUpperCase();
  const loc = (settings?.location_info || 'MUMBAI, INDIA / REMOTE WORLDWIDE').toUpperCase();
  const email = settings?.contact_email || 'alexkane.edit@gmail.com';
  
  const day = settings?.rate_editorial_day || '25,000';
  const half = settings?.rate_editorial_half || '15,000';
  const spot = settings?.rate_color_spot || '30,000';
  const feature = settings?.rate_narrative_base || '75,000';
  
  const gear = settings?.rate_equipment_specs || 'Mac Studio M2 Ultra (128GB Unified Memory) • Flanders Scientific BM240 Calibrated Broadcast Monitor • Tangent Wave2 Control Panel';
  const credits = settings?.rate_credits || 'Vanguard Velocity (Commercial Spot) • Neon Horizon (Sundance 2025) • Aura (Music Video - 3.2M Views)';

  return `====================================================
${name} — OFFICIAL RATE CARD & STUDIO RESUME
====================================================
LOCATION & STUDIO: ${loc}
CONTACT EMAIL: ${email}
PIPELINE: DAVINCI RESOLVE STUDIO 19 / PREMIERE PRO / ACES 1.3

----------------------------------------------------
EDITORIAL & COLOR GRADING DAY RATES
----------------------------------------------------
• Full Day Editorial Rate (10 Hrs):  ${sym}${day} / Day
• Half Day Editorial Rate (5 Hrs):   ${sym}${half} / Half Day
• Commercial Color Grade (per Spot): ${sym}${spot} / Spot
• Feature / Narrative Grading:       ${sym}${feature} / Project Base

----------------------------------------------------
EQUIPMENT & STUDIO PIPELINE
----------------------------------------------------
• ${gear}

----------------------------------------------------
SELECTED CREDITS & FEATURED WORK
----------------------------------------------------
• ${credits}
====================================================`;
}

// Executive PDF Document Generator HTML
export function generateRateCardHTML(settings) {
  const sym = settings?.rate_currency || '₹';
  const name = (settings?.editor_name || 'VAIBHAV JALOTA').toUpperCase();
  const loc = settings?.location_info || 'MUMBAI, INDIA / REMOTE WORLDWIDE';
  const email = settings?.contact_email || 'contact@alexkane.edit';
  
  const day = settings?.rate_editorial_day || '25,000';
  const half = settings?.rate_editorial_half || '15,000';
  const spot = settings?.rate_color_spot || '30,000';
  const feature = settings?.rate_narrative_base || '75,000';
  
  const gear = settings?.rate_equipment_specs || 'Mac Studio M2 Ultra (128GB Unified Memory) • Flanders Scientific BM240 Calibrated Broadcast Monitor • Tangent Wave2 Control Panel';
  const credits = settings?.rate_credits || 'Vanguard Velocity (Commercial Spot) • Neon Horizon (Sundance 2025) • Aura (Music Video - 3.2M Views)';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${name} — Official Rate Card & Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 0;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 48px;
      background: #ffffff;
    }
    
    /* Executive Top Header */
    .header-banner {
      background: #0f0f12;
      color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      margin-bottom: 32px;
      border-left: 6px solid #ff9f1c;
      position: relative;
    }
    .header-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: #ffffff;
    }
    .header-subtitle {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #ff9f1c;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .meta-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #a1a1aa;
      border-top: 1px solid #27272a;
      padding-top: 16px;
    }
    .meta-item span { color: #ffffff; font-weight: 600; }
    
    /* Section Titles */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-top: 28px;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .section-tag {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      color: #ff9f1c;
      font-weight: 700;
    }

    /* Pricing Table */
    .rate-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .rate-table th {
      background: #f8fafc;
      text-align: left;
      padding: 12px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 1px;
      color: #64748b;
      text-transform: uppercase;
      border-bottom: 1px solid #e2e8f0;
    }
    .rate-table td {
      padding: 14px 16px;
      font-size: 13px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }
    .rate-table tr:last-child td { border-bottom: none; }
    .rate-table tr:nth-child(even) { background: #f8fafc; }
    .service-name { font-weight: 600; color: #0f172a; }
    .rate-price {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #d97706;
      font-size: 14px;
      text-align: right;
    }

    /* Cards / Boxes */
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      font-size: 12px;
      color: #334155;
      line-height: 1.6;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Footer */
    .doc-footer {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #94a3b8;
    }

    @media print {
      body { background: #ffffff; }
      .page { padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header-banner">
      <div class="header-title">${name}</div>
      <div class="header-subtitle">Cinematic Editor & Digital Colorist</div>
      <div class="meta-grid">
        <div class="meta-item">LOCATION: <span>${loc}</span></div>
        <div class="meta-item">EMAIL: <span>${email}</span></div>
        <div class="meta-item">PIPELINE: <span>DAVINCI RESOLVE STUDIO 19 / ACES 1.3</span></div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-title">01. Editorial & Color Grading Rates</div>
      <div class="section-tag">[CONFIDENTIAL // 2026]</div>
    </div>

    <table class="rate-table">
      <thead>
        <tr>
          <th>SERVICE & WORKFLOW</th>
          <th>DURATION / SCOPE</th>
          <th style="text-align: right;">INVESTMENT RATE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service-name">Full Day Editorial Assembly & Narrative Cutting</td>
          <td>10 Hours / Full Day</td>
          <td class="rate-price">${sym}${day} / Day</td>
        </tr>
        <tr>
          <td class="service-name">Half Day Editorial Assembly & Pacing Adjustments</td>
          <td>5 Hours / Half Day</td>
          <td class="rate-price">${sym}${half} / Half Day</td>
        </tr>
        <tr>
          <td class="service-name">Commercial Color Grading (Spot / Music Video)</td>
          <td>Per Commercial Spot</td>
          <td class="rate-price">${sym}${spot} / Spot</td>
        </tr>
        <tr>
          <td class="service-name">Feature Film / Narrative Color Grading & Mastering</td>
          <td>Full Project Base</td>
          <td class="rate-price">${sym}${feature} / Project Base</td>
        </tr>
      </tbody>
    </table>

    <div class="section-header">
      <div class="section-title">02. Studio Suite Hardware & Pipeline Specs</div>
    </div>
    <div class="info-card">
      ${gear}
    </div>

    <div class="section-header">
      <div class="section-title">03. Selected Credits & Featured Work</div>
    </div>
    <div class="info-card">
      ${credits}
    </div>

    <div class="doc-footer">
      <div>OFFICIAL RATE SHEET • GENERATED BY ${name} STUDIO PORTFOLIO</div>
      <div>VALID FOR 2026 PRODUCTIONS</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    };
  </script>
</body>
</html>`;
}
