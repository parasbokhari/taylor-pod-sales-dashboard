// ─── API config ───────────────────────────────────────────────────────────────
// To point to a different endpoint in the future, change this one constant.
const API_BASE =
  "https://parasbokhari1--ce4a306c26fe11f1a7f242dde27851f2.web.val.run";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch(params = {}) {
  const url = new URL(API_BASE);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error("API returned success: false");
  }

  return data;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of submissions.
 * Returns { submissions, total, page, limit, total_pages }
 */
export async function fetchSubmissions({
  page = 1,
  limit = 25,
  search = "",
} = {}) {
  return apiFetch({ page, limit, ...(search ? { search } : {}) });
}

/**
 * Fetch all submissions in one shot (used for stats cards + chart).
 * Requests the max allowed limit (100) and loops through all pages.
 */
export async function fetchAllSubmissions() {
  const first = await apiFetch({ page: 1, limit: 100 });
  const all = [...first.submissions];

  // Fetch remaining pages if needed
  for (let p = 2; p <= first.total_pages; p++) {
    const next = await apiFetch({ page: p, limit: 100 });
    all.push(...next.submissions);
  }

  return all;
}

/**
 * Fetch a single submission by submission_id.
 * Returns the submission object or null if not found.
 */
export async function fetchSubmissionById(submissionId) {
  const data = await apiFetch({ submission_id: submissionId });
  return data.submissions[0] ?? null;
}

/**
 * Fetch aggregated stats for a date range.
 * range: "7d" | "30d" | { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
 */
export async function fetchStats(range) {
  const params = { mode: "stats" };
  if (typeof range === "string") {
    params.range = range;
  } else {
    params.from = range.from;
    params.to = range.to;
  }
  return apiFetch(params);
}
/**
 * Fetch bestselling products for a date range.
 * range: "7d" | "30d" | "90d" | { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
 */
export async function fetchBestsellers(range = "30d", top = 20) {
  const params = { mode: "bestsellers", top };
  if (typeof range === "string") {
    params.range = range;
  } else {
    params.from = range.from;
    params.to = range.to;
  }
  return apiFetch(params);
}

export async function fetchSubmissionsByEmail(email) {
  const data = await apiFetch({ email, limit: 100 });
  return data.submissions;
}
