"use client";

import { useCallback, useEffect, useState } from "react";

type RunRow = {
  id: number;
  started_at: string;
  trigger: string;
  status: string;
  duration_ms: number | null;
  new_reviews: number;
  new_photos: number;
  skipped_photos: number;
  deduped_photos: number;
  reviews_offered: number;
  photos_offered: number;
  error_message: string | null;
  photo_errors: string | null;
};

type Status = {
  env: {
    placesApiKey: boolean;
    placeId: boolean;
    cronSecret: boolean;
    blobToken: boolean;
  };
  runs: RunRow[];
  cached: { reviews: number; photos: number; lastReviewSyncedAt: string | null };
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
  const stamp = d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diffMins < 60) return `${stamp} (${diffMins}m ago)`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 48) return `${stamp} (${hours}h ago)`;
  return `${stamp} (${Math.floor(hours / 24)}d ago)`;
}

function EnvFlag({ label, ok, note }: { label: string; ok: boolean; note: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-1 w-2 h-2 rounded-full shrink-0"
        style={{ background: ok ? "#4ade80" : "#f87171" }}
      />
      <div>
        <p className="text-cream text-sm font-semibold">
          {label}{" "}
          <span className={ok ? "text-green-400" : "text-red-400"}>
            {ok ? "set" : "missing"}
          </span>
        </p>
        <p className="text-cream/45 text-xs">{note}</p>
      </div>
    </div>
  );
}

export default function AdminSyncPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sync-status?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runNow() {
    setRunning(true);
    setMessage("");
    try {
      const res = await fetch(`/api/cron/sync-google-profile?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Run finished. Google offered ${data.reviewsOfferedByPlaces} review(s) and ` +
            `${data.photosOfferedByPlaces} photo(s). New: ${data.newReviews} review(s), ` +
            `${data.newPhotos} photo(s).`
        );
      } else {
        setMessage(`Run failed: ${data.error ?? res.status}`);
      }
    } catch (err) {
      setMessage(`Run failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
      load();
    }
  }

  const lastRun = status?.runs[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10">
      <header className="mb-8 pb-6 border-b border-[var(--gold)]/20">
        <a href="/admin" className="text-xs text-[var(--gold-light)] hover:underline">
          ← Back to dashboard
        </a>
        <h1 className="text-3xl md:text-4xl font-heading gold-text mt-3">Google Sync</h1>
        <p className="text-cream/50 text-xs mt-1">
          Reviews, rating and photos pulled from your Google Business Profile.
        </p>
      </header>

      {/* What Google will and will not give us. This is the single most
          common reason a run reports nothing new, so it leads. */}
      <section className="bg-[var(--gold)]/5 border border-[var(--gold)]/25 rounded-sm p-5 sm:p-6 mb-8">
        <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-2">
          Before you read the runs
        </p>
        <p className="text-cream/70 text-sm leading-relaxed">
          The public Places API only exposes a sample of your profile: at most{" "}
          <strong className="text-cream">5 reviews</strong> and around{" "}
          <strong className="text-cream">10 photos</strong>, chosen by Google as
          &quot;most relevant&quot; rather than newest, with no way to sort or page
          through the rest. A run that finds nothing new is usually Google handing
          back the same sample, not a broken cron. Check the{" "}
          <strong className="text-cream">offered</strong> columns below: if Google
          offered 5 reviews and 0 were new, the sync worked and the sample simply
          has not changed.
        </p>
        <p className="text-cream/70 text-sm leading-relaxed mt-3">
          Reviews no longer depend on this cron. The reviews section refreshes
          itself from the same API key when its cache is more than 6 hours old,
          so whatever 5 reviews Google is currently serving show on the site
          automatically. The cron still handles photos and keeps the cache warm.
        </p>
      </section>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6 mb-8">
        <h2 className="text-lg font-heading text-cream uppercase mb-4">Configuration</h2>
        {status ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <EnvFlag
              label="GOOGLE_PLACES_API_KEY"
              ok={status.env.placesApiKey}
              note="Without it the sync aborts before calling Google."
            />
            <EnvFlag
              label="GOOGLE_PLACE_ID"
              ok={status.env.placeId}
              note="Identifies which business profile to read."
            />
            <EnvFlag
              label="CRON_SECRET"
              ok={status.env.cronSecret}
              note="Vercel only sends its auth header when this is set. Missing means every scheduled run is rejected with a 401 and the sync looks dead."
            />
            <EnvFlag
              label="BLOB_READ_WRITE_TOKEN"
              ok={status.env.blobToken}
              note="Needed to store synced photos. Missing means reviews sync but photos fail."
            />
          </div>
        ) : (
          <p className="text-cream/40 text-sm">{loading ? "Loading..." : "Unavailable."}</p>
        )}
      </section>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-heading text-cream uppercase">Last run</h2>
            {lastRun ? (
              <p className="text-cream/50 text-xs mt-1">
                {formatWhen(lastRun.started_at)} via {lastRun.trigger}
                {lastRun.duration_ms ? `, took ${(lastRun.duration_ms / 1000).toFixed(1)}s` : ""}
              </p>
            ) : (
              <p className="text-cream/50 text-xs mt-1">
                No run recorded yet. Runs are only logged from this deployment
                onwards, so trigger one below to confirm the sync works.
              </p>
            )}
          </div>
          <button
            onClick={runNow}
            disabled={running}
            className="self-start px-5 py-2.5 text-xs uppercase tracking-widest border border-[var(--gold)]/50 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition disabled:opacity-40"
          >
            {running ? "Syncing..." : "Run sync now"}
          </button>
        </div>

        {message && (
          <p className="text-sm text-cream/80 bg-black/30 border border-[var(--gold)]/15 rounded-sm p-3 mb-4">
            {message}
          </p>
        )}

        {status && status.cached && (
          <p className="text-cream/50 text-xs">
            Currently cached: {status.cached.reviews} review(s), {status.cached.photos} photo(s)
            {status.cached.lastReviewSyncedAt
              ? `, last touched ${formatWhen(status.cached.lastReviewSyncedAt)}`
              : ""}
            .
          </p>
        )}
      </section>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6">
        <h2 className="text-lg font-heading text-cream uppercase mb-4">Run history</h2>
        {!status || status.runs.length === 0 ? (
          <p className="text-cream/40 text-sm">
            {loading ? "Loading..." : "Nothing logged yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-cream/50 text-xs uppercase tracking-widest">
                  <th className="text-left py-2 pr-4 font-semibold">When</th>
                  <th className="text-left py-2 pr-4 font-semibold">Trigger</th>
                  <th className="text-left py-2 pr-4 font-semibold">Status</th>
                  <th className="text-right py-2 pr-4 font-semibold">Reviews offered</th>
                  <th className="text-right py-2 pr-4 font-semibold">New</th>
                  <th className="text-right py-2 pr-4 font-semibold">Photos offered</th>
                  <th className="text-right py-2 pr-4 font-semibold">New</th>
                  <th className="text-right py-2 font-semibold">Deduped</th>
                </tr>
              </thead>
              <tbody>
                {status.runs.map((run) => (
                  <tr key={run.id} className="border-t border-[var(--gold)]/10 align-top">
                    <td className="py-2 pr-4 text-cream/70 whitespace-nowrap">
                      {formatWhen(run.started_at)}
                    </td>
                    <td className="py-2 pr-4 text-cream/60">{run.trigger}</td>
                    <td className="py-2 pr-4">
                      <span className={run.status === "success" ? "text-green-400" : "text-red-400"}>
                        {run.status}
                      </span>
                      {run.error_message && (
                        <span className="block text-cream/50 text-xs mt-1 max-w-xs">
                          {run.error_message}
                        </span>
                      )}
                      {run.photo_errors && (
                        <span className="block text-amber-300/70 text-xs mt-1 max-w-xs whitespace-pre-line">
                          {run.photo_errors}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-right text-cream/60">{run.reviews_offered}</td>
                    <td className="py-2 pr-4 text-right text-cream">{run.new_reviews}</td>
                    <td className="py-2 pr-4 text-right text-cream/60">{run.photos_offered}</td>
                    <td className="py-2 pr-4 text-right text-cream">{run.new_photos}</td>
                    <td className="py-2 text-right text-cream/60">{run.deduped_photos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
