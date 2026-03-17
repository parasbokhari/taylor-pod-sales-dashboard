import { fetchSubmissionById, fetchSubmissions } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Mail, Calendar, ShoppingCart } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  // id here is the submission_id value e.g. "pod-c-209462624646"
  const submission = await fetchSubmissionById(id);
  const { first_name, last_name } = submission?.values ?? {};
  const fullName =
    [first_name, last_name].filter(Boolean).join(" ") || "Unknown";
  return {
    title: `${fullName} - Cart Submission | Print on Demand Catalog | Taylor`,
  };
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground mb-0.5">
        {label}
      </dt>
      <dd className={`text-sm break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value != null ? (
          value
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </dd>
    </div>
  );
}

function CartDataSection({ cartData }) {
  // cart_data being absent never blocks the page — just shows a placeholder
  if (!cartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              cart_data
            </code>{" "}
            on this submission yet. Share the field shape and this section will
            be updated to render line items, quantities, SKUs, etc.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Cart Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: replace pre with real line-items table once you share the cart_data shape */}
        <pre className="text-xs bg-muted rounded-lg p-4 overflow-x-auto leading-relaxed">
          {JSON.stringify(cartData, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

export default async function SubmissionDetailPage({ params }) {
  const { id } = await params;
  let submission;
  let allSubmissions = [];

  try {
    [submission, allSubmissions] = await Promise.all([
      fetchSubmissionById(id),
      fetchSubmissions(),
    ]);
  } catch (e) {
    // API error — show not found rather than crashing
    console.error("Failed to fetch submission:", e.message);
    notFound();
  }

  if (!submission) notFound();

  const values = submission.values ?? {};
  const { first_name, last_name, email, submitted_at, cart_data } = values;
  const fullName =
    [first_name, last_name].filter(Boolean).join(" ") || "Unknown";
  const initials =
    [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase() ||
    "?";

  // Count all submissions sharing the same email
  const totalOrdersByEmail = email
    ? allSubmissions.filter((s) => s.values?.email === email).length
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors"
          >
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">{fullName}</span>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center text-lg font-semibold text-black mx-auto mb-4">
                  {initials}
                </div>
                <h1 className="text-base font-semibold">{fullName}</h1>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline mt-1 inline-flex items-center gap-1 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    {email}
                  </a>
                )}
                <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(submitted_at)}
                </div>
                <div className="mt-3">
                  <Badge
                    variant={
                      submission.publishStatus === "PUBLISHED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {submission.publishStatus === "PUBLISHED"
                      ? "Cart Submitted"
                      : (submission.publishStatus ?? "—")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <Field label="Row ID" value={submission.id} mono />
                  <Field
                    label="Created"
                    value={formatDate(submission.createdAt)}
                  />
                  <Field
                    label="Updated"
                    value={formatDate(submission.updatedAt)}
                  />
                  <Field
                    label="Published"
                    value={formatDate(submission.publishedAt)}
                  />
                  <Field
                    label="Total carts by this email"
                    value={totalOrdersByEmail ?? "—"}
                  />
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            <CartDataSection cartData={cart_data ?? null} />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  All field values
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(values).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center pt-8 pb-4 text-muted-foreground"
                        >
                          No field values
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(values).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {key}
                          </TableCell>
                          <TableCell className="text-xs break-all">
                            {key.endsWith("_at") &&
                            typeof value === "number" ? (
                              formatDate(value)
                            ) : typeof value === "object" && value !== null ? (
                              <pre className="whitespace-pre-wrap text-[10px] text-muted-foreground">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              String(value ?? "—")
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <details className="group">
                <summary className="list-none cursor-pointer px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">Raw JSON</span>
                  <span className="text-xs text-muted-foreground">
                    <span className="group-open:hidden">Show</span>
                    <span className="hidden group-open:inline">Hide</span>
                  </span>
                </summary>
                <CardContent className="pt-0">
                  <pre className="text-xs bg-muted rounded-lg p-4 overflow-x-auto leading-relaxed">
                    {JSON.stringify(submission, null, 2)}
                  </pre>
                </CardContent>
              </details>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
