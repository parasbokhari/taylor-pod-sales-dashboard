const HUBSPOT_API_URL =
  "https://api.hubapi.com/cms/v3/hubdb/tables/215729304/rows?portalId=39614771";

export async function fetchSubmissions() {
  const res = await fetch(HUBSPOT_API_URL, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.results ?? [];
}

export async function fetchSubmissionById(id) {
  const submissions = await fetchSubmissions();
  return submissions.find((s) => s.id === id) ?? null;
}
