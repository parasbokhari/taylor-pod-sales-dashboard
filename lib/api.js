const TABLE_ID = "215729304";
const PORTAL_ID = "39614771";
const BASE = "https://api.hubapi.com/cms/v3/hubdb/tables";

export async function fetchSubmissions() {
  const res = await fetch(`${BASE}/${TABLE_ID}/rows?portalId=${PORTAL_ID}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.results ?? [];
}

export async function fetchSubmissionById(submissionId) {
  // Look up by values.submission_id (e.g. "pod-c-209462624646") not the HubDB row id
  const submissions = await fetchSubmissions();
  return (
    submissions.find((s) => s.values?.submission_id === submissionId) ?? null
  );
}
