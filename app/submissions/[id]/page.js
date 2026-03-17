import { fetchSubmissionById, fetchSubmissions } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Calendar, ShoppingCart } from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const submissions = await fetchSubmissions();
  return submissions.map((s) => ({ id: s.id }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-xs font-medium text-[#9c9c96] mb-0.5">{label}</dt>
      <dd className={`text-sm text-[#1a1a18] break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? <span className="text-[#b8b8b2]">—</span>}
      </dd>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-[#e8e8e6] rounded-xl p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
      <h2 className="text-sm font-semibold text-[#1a1a18] mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Cart Data ────────────────────────────────────────────────────────────────
// Once you share the cart_data shape, replace this placeholder with real rendering.

function CartDataSection({ cartData }) {
  if (!cartData) {
    return (
      <Section title="Cart Data">
        <div className="flex items-center gap-3 py-4">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4ff] flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4 text-[#2458f1]" />
          </div>
          <div>
            <p className="text-sm text-[#5c5c58]">No cart data on this submission</p>
            <p className="text-xs text-[#9c9c96] mt-0.5">
              Share the <code className="font-mono bg-[#f8f8f7] px-1 py-0.5 rounded text-[10px]">cart_data</code> field
              shape and this section will be updated to render it properly.
            </p>
          </div>
        </div>
      </Section>
    );
  }

  // TODO: replace with real cart_data rendering once you share the shape.
  // For now we render raw JSON so you can see the structure.
  return (
    <Section title="Cart Data">
      <pre className="text-xs bg-[#f8f8f7] rounded-lg p-4 overflow-x-auto text-[#5c5c58] leading-relaxed border border-[#e8e8e6]">
        {JSON.stringify(cartData, null, 2)}
      </pre>
    </Section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SubmissionDetailPage({ params }) {
  const submission = await fetchSubmissionById(params.id);
  if (!submission) notFound();

  const { first_name, last_name, email, submitted_at, cart_data, ...restValues } =
    submission.values ?? {};

  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "Unknown";
  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  // All values except the ones shown in the dedicated sections
  const knownValueKeys = ["first_name", "last_name", "email", "submitted_at", "cart_data"];
  const extraValues = Object.entries(submission.values ?? {}).filter(
    ([k]) => !knownValueKeys.includes(k)
  );

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e8e6] sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[#9c9c96] hover:text-[#1a1a18] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <span className="text-[#e8e8e6]">/</span>
          <span className="text-sm text-[#1a1a18] font-medium">{fullName}</span>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="space-y-4">

            {/* Contact card */}
            <div
              className="bg-white border border-[#e8e8e6] rounded-xl p-6 text-center"
              style={{ boxShadow: "var(--shadow-xs)" }}
            >
              <div className="w-16 h-16 rounded-full bg-[#f0f4ff] flex items-center justify-center text-lg font-semibold text-[#2458f1] mx-auto mb-4">
                {initials}
              </div>
              <h1 className="text-base font-semibold text-[#1a1a18]">{fullName}</h1>
              <a
                href={`mailto:${email}`}
                className="text-sm text-[#2458f1] hover:underline mt-1 inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {email ?? "—"}
              </a>
              <div className="mt-4 pt-4 border-t border-[#e8e8e6] flex items-center gap-2 justify-center text-xs text-[#9c9c96]">
                <Calendar className="w-3 h-3" />
                {formatDate(submitted_at)}
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    submission.publishStatus === "PUBLISHED"
                      ? "bg-[#f0fdf4] text-[#16a34a]"
                      : "bg-[#f8f8f7] text-[#9c9c96]"
                  }`}
                >
                  {submission.publishStatus ?? "—"}
                </span>
              </div>
            </div>

            {/* Row metadata */}
            <Section title="Metadata">
              <dl className="space-y-3">
                <Field label="Row ID" value={submission.id} mono />
                <Field label="Created" value={formatDate(submission.createdAt)} />
                <Field label="Updated" value={formatDate(submission.updatedAt)} />
                <Field label="Published" value={formatDate(submission.publishedAt)} />
                <Field label="Render order" value={submission.renderOrder} />
                <Field label="Edited" value={submission.isEdited ? "Yes" : "No"} />
              </dl>
            </Section>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Cart data — will render real items once shape is shared */}
            <CartDataSection cartData={cart_data ?? null} />

            {/* All field values */}
            <Section title="All field values">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e8e8e6]">
                      <th className="text-left py-2 px-3 text-xs font-medium text-[#9c9c96] w-1/3">Field</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-[#9c9c96]">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(submission.values ?? {}).map(([key, value]) => (
                      <tr key={key} className="border-b border-[#e8e8e6] last:border-0 hover:bg-[#f8f8f7]">
                        <td className="py-2.5 px-3 font-mono text-xs text-[#9c9c96]">{key}</td>
                        <td className="py-2.5 px-3 text-[#1a1a18] break-all text-xs">
                          {key.endsWith("_at") && typeof value === "number"
                            ? formatDate(value)
                            : typeof value === "object"
                            ? <pre className="whitespace-pre-wrap text-[10px] text-[#5c5c58]">{JSON.stringify(value, null, 2)}</pre>
                            : String(value ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Raw JSON */}
            <details className="bg-white border border-[#e8e8e6] rounded-xl p-5 group" style={{ boxShadow: "var(--shadow-xs)" }}>
              <summary className="text-sm font-semibold text-[#1a1a18] cursor-pointer select-none list-none flex items-center justify-between">
                <span>Raw JSON</span>
                <span className="text-xs font-normal text-[#9c9c96]">
                  <span className="group-open:hidden">Show</span>
                  <span className="hidden group-open:inline">Hide</span>
                </span>
              </summary>
              <pre className="mt-4 text-xs bg-[#f8f8f7] rounded-lg p-4 overflow-x-auto text-[#5c5c58] leading-relaxed border border-[#e8e8e6]">
                {JSON.stringify(submission, null, 2)}
              </pre>
            </details>

          </div>
        </div>
      </main>
    </div>
  );
}
