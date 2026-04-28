/**
 * MobileTestChecklist - Dev-only page to verify dashboard layouts have
 * no horizontal overflow at common mobile widths (320, 375, 414).
 *
 * Visit: /dev/mobile-test
 *
 * Each row renders a route inside an iframe sized to the target width,
 * then probes the iframe document for `scrollWidth > clientWidth` to
 * flag horizontal overflow. Manual visual review still recommended.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const WIDTHS = [320, 375, 414] as const;
type Width = typeof WIDTHS[number];

const ROUTES: { path: string; label: string; note?: string }[] = [
  { path: '/', label: 'Landing' },
  { path: '/about', label: 'About' },
  { path: '/curriculum', label: 'Curriculum' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/login', label: 'Login' },
  { path: '/signup', label: 'Signup' },
  { path: '/admin', label: 'Admin Dashboard', note: 'requires admin login' },
  { path: '/instructor', label: 'Instructor Dashboard', note: 'requires instructor login' },
  { path: '/learner', label: 'Learner Dashboard', note: 'requires learner login' },
  { path: '/parent', label: 'Parent Dashboard', note: 'requires parent login' },
];

type Status = 'pending' | 'pass' | 'fail' | 'blocked';

interface Result {
  scrollWidth: number;
  clientWidth: number;
  overflow: number;
  status: Status;
}

const FrameProbe: React.FC<{
  path: string;
  width: Width;
  onResult: (r: Result) => void;
  reloadKey: number;
}> = ({ path, width, onResult, reloadKey }) => {
  const ref = useRef<HTMLIFrameElement>(null);

  const measure = () => {
    const frame = ref.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (!doc) {
        onResult({ scrollWidth: 0, clientWidth: 0, overflow: 0, status: 'blocked' });
        return;
      }
      const scrollWidth = doc.documentElement.scrollWidth;
      const clientWidth = doc.documentElement.clientWidth;
      const overflow = scrollWidth - clientWidth;
      onResult({
        scrollWidth,
        clientWidth,
        overflow,
        status: overflow > 1 ? 'fail' : 'pass',
      });
    } catch {
      onResult({ scrollWidth: 0, clientWidth: 0, overflow: 0, status: 'blocked' });
    }
  };

  return (
    <iframe
      key={reloadKey}
      ref={ref}
      src={path}
      title={`${path}-${width}`}
      style={{ width, height: 480, border: '1px solid hsl(var(--border))', borderRadius: 8, background: 'white' }}
      onLoad={() => {
        // Allow async content to settle, then re-measure.
        setTimeout(measure, 800);
        setTimeout(measure, 2000);
      }}
    />
  );
};

const MobileTestChecklist: React.FC = () => {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = 'Mobile Test Checklist';
  }, []);

  const summary = useMemo(() => {
    const total = ROUTES.length * WIDTHS.length;
    let pass = 0, fail = 0, blocked = 0;
    Object.values(results).forEach((r) => {
      if (r.status === 'pass') pass++;
      else if (r.status === 'fail') fail++;
      else if (r.status === 'blocked') blocked++;
    });
    return { total, pass, fail, blocked, pending: total - pass - fail - blocked };
  }, [results]);

  const setResult = (key: string, r: Result) =>
    setResults((prev) => ({ ...prev, [key]: r }));

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Mobile Test Checklist</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Verifies key routes render without horizontal overflow at 320 / 375 / 414 px widths.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm flex items-center gap-2"
            >
              <FiArrowLeft /> Home
            </Link>
            <button
              onClick={() => { setResults({}); setReloadKey((k) => k + 1); }}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"
            >
              <FiRefreshCw /> Re-run
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Stat label="Total" value={summary.total} />
          <Stat label="Pass" value={summary.pass} tone="pass" />
          <Stat label="Fail" value={summary.fail} tone="fail" />
          <Stat label="Blocked" value={summary.blocked} tone="warn" />
          <Stat label="Pending" value={summary.pending} />
        </div>

        <div className="space-y-8">
          {ROUTES.map((route) => (
            <section key={route.path} className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-semibold">
                    {route.label} <span className="text-muted-foreground font-mono text-xs">{route.path}</span>
                  </h2>
                  {route.note && <p className="text-xs text-muted-foreground mt-0.5">{route.note}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {WIDTHS.map((w) => {
                    const key = `${route.path}@${w}`;
                    const r = results[key];
                    return <Pill key={w} width={w} status={r?.status ?? 'pending'} overflow={r?.overflow} />;
                  })}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                  {WIDTHS.map((w) => (
                    <div key={w} className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">{w}px</span>
                      <FrameProbe
                        path={route.path}
                        width={w}
                        reloadKey={reloadKey}
                        onResult={(r) => setResult(`${route.path}@${w}`, r)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Note: protected routes (Admin/Instructor/Learner/Parent) will redirect to /login when not authenticated;
          they still pass the overflow check on the login screen. Sign in first in another tab to test the real
          dashboards, then click Re-run.
        </p>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; tone?: 'pass' | 'fail' | 'warn' }> = ({ label, value, tone }) => {
  const color =
    tone === 'pass' ? 'text-green-600' :
    tone === 'fail' ? 'text-destructive' :
    tone === 'warn' ? 'text-orange-500' : 'text-foreground';
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

const Pill: React.FC<{ width: number; status: Status; overflow?: number }> = ({ width, status, overflow }) => {
  const map: Record<Status, { cls: string; icon: React.ReactNode; text: string }> = {
    pending: { cls: 'bg-muted text-muted-foreground', icon: null, text: `${width}: …` },
    pass:    { cls: 'bg-green-500/15 text-green-700',  icon: <FiCheckCircle />, text: `${width}: OK` },
    fail:    { cls: 'bg-destructive/15 text-destructive', icon: <FiAlertTriangle />, text: `${width}: +${overflow}px` },
    blocked: { cls: 'bg-orange-500/15 text-orange-600', icon: <FiAlertTriangle />, text: `${width}: blocked` },
  };
  const { cls, icon, text } = map[status];
  return (
    <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${cls}`}>
      {icon} {text}
    </span>
  );
};

export default MobileTestChecklist;
