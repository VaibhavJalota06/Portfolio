import React, { useState } from 'react';
import { Cpu, Zap, Activity, Award, CheckCircle2 } from 'lucide-react';

export default function SkillRadarTile() {
  const [activeSkill, setActiveSkill] = useState(null);

  const skills = [
    { label: 'EDITORIAL', value: 95, detail: 'Pacing, multi-cam assembly, narrative rhythm' },
    { label: 'COLOR GRADE', value: 92, detail: 'DaVinci Resolve pipelines, ACES, film print emulation' },
    { label: 'SOUND DESIGN', value: 88, detail: 'Foley layering, 5.1 mixing, voice isolation' },
    { label: 'MOTION & VFX', value: 85, detail: 'After Effects, titling, cleanups, tracking' },
    { label: 'FULLSTACK & PIPELINE', value: 90, detail: 'React, Node, SQLite, automated rendering' }
  ];

  // Calculate SVG pentagon radar points
  const centerX = 120;
  const centerY = 120;
  const radius = 80;
  const angleStep = (Math.PI * 2) / skills.length;

  // Convert (angle, radiusRatio) -> (x, y)
  const getCoordinates = (index, ratio = 1) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top (-90 deg)
    const r = radius * ratio;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  // Generate web background grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Radar skill polygon path
  const skillPoints = skills.map((s, i) => getCoordinates(i, s.value / 100));
  const skillPolygonPath = skillPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
      {/* Subtle top accent bar */}
      <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono text-accent tracking-wider uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>[ANALYTICS // TECH RADAR]</span>
          </div>
          <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight mt-0.5">
            SKILL RADAR & PIPELINE METRICS
          </h2>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM OK
        </div>
      </div>

      {/* Main Content: SVG Radar + Metrics breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-2">
        {/* SVG Radar Chart */}
        <div className="relative flex items-center justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible select-none">
            {/* Background Grid Rings */}
            {rings.map((ringRatio, rIdx) => {
              const points = skills.map((_, i) => getCoordinates(i, ringRatio));
              const polyString = points.map(p => `${p.x},${p.y}`).join(' ');
              return (
                <polygon
                  key={rIdx}
                  points={polyString}
                  fill="none"
                  stroke="#1e1e24"
                  strokeWidth="1"
                  strokeDasharray={rIdx === 3 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Radar Spoke Axes */}
            {skills.map((_, i) => {
              const outerCoord = getCoordinates(i, 1);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={outerCoord.x}
                  y2={outerCoord.y}
                  stroke="#1e1e24"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Skill Polygon */}
            <polygon
              points={skillPolygonPath}
              className="fill-accent/20 stroke-accent transition-all duration-300"
              strokeWidth="2"
            />

            {/* Skill Vertex Points & Labels */}
            {skills.map((skill, i) => {
              const coord = skillPoints[i];
              const outerCoord = getCoordinates(i, 1.22);
              const isActive = activeSkill === i;

              return (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveSkill(i)} onMouseLeave={() => setActiveSkill(null)}>
                  {/* Outer vertex dot */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isActive ? 6 : 4}
                    className={`transition-all duration-200 ${
                      isActive ? 'fill-white stroke-accent' : 'fill-accent stroke-cinema-card'
                    }`}
                    strokeWidth="2"
                  />
                  {/* Axis Label Text */}
                  <text
                    x={outerCoord.x}
                    y={outerCoord.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-[9px] font-mono font-semibold transition-colors ${
                      isActive ? 'fill-accent font-bold scale-110' : 'fill-cinema-muted'
                    }`}
                  >
                    {skill.label.split(' ')[0]} {skill.value}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Skill Details Breakdown */}
        <div className="flex flex-col justify-center space-y-2.5">
          {skills.map((skill, idx) => {
            const isActive = activeSkill === idx;
            return (
              <div
                key={skill.label}
                onMouseEnter={() => setActiveSkill(idx)}
                onMouseLeave={() => setActiveSkill(null)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-accent/15 border-accent/60 shadow-[0_0_12px_rgba(255,159,28,0.15)]'
                    : 'bg-cinema-black/40 border-cinema-border/60 hover:border-cinema-border'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={`font-semibold ${isActive ? 'text-accent' : 'text-white'}`}>
                    {skill.label}
                  </span>
                  <span className="text-cinema-muted font-bold">{skill.value}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-cinema-dark rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
                <div className="text-[10px] text-cinema-muted font-sans line-clamp-1">
                  {skill.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cinema-border/50 font-mono text-[10px]">
        <div className="bg-cinema-black/60 border border-cinema-border/60 rounded p-2 text-center">
          <div className="text-cinema-muted">CLIPS</div>
          <div className="text-sm font-bold text-accent mt-0.5">7+ PUBLISHED</div>
        </div>
        <div className="bg-cinema-black/60 border border-cinema-border/60 rounded p-2 text-center">
          <div className="text-cinema-muted">PIPELINE</div>
          <div className="text-sm font-bold text-white mt-0.5">4K PRORES</div>
        </div>
        <div className="bg-cinema-black/60 border border-cinema-border/60 rounded p-2 text-center">
          <div className="text-cinema-muted">RENDER</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">&lt; 0.5s LATENCY</div>
        </div>
        <div className="bg-cinema-black/60 border border-cinema-border/60 rounded p-2 text-center">
          <div className="text-cinema-muted">SYNC</div>
          <div className="text-sm font-bold text-accent mt-0.5">100% PRECISION</div>
        </div>
      </div>
    </div>
  );
}
