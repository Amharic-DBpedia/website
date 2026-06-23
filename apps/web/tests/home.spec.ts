import { expect, test } from "@playwright/test";

const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5174";
const configuredBasePath = new URL(configuredBaseURL).pathname;

function appPath(path: string): string {
  const basePath = configuredBasePath.endsWith("/") ? configuredBasePath : `${configuredBasePath}/`;
  return basePath === "/" ? path : `${basePath}${path.replace(/^\//, "")}`;
}

test("renders chapter homepage and resource search", async ({ page }) => {
  await page.goto(appPath("/"));
  await expect(page.getByRole("heading", { name: "Amharic DBpedia Chapter" })).toBeVisible();
  await expect(page.getByLabel("Resource title or IRI")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest news" })).toBeVisible();
  await expect(page.locator(".news-item")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "News", exact: true })).toBeVisible();
});

test("renders a dedicated news destination from the primary navigation", async ({ page }) => {
  await page.goto(appPath("/"));
  await page.getByRole("link", { name: "News", exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`${appPath("/news")}$`));
  await expect(page.getByRole("heading", { name: "News and project updates" })).toBeVisible();
  await expect(page.getByText("Latest update")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Earlier updates" })).toBeVisible();
});

test("embeds Tentris inside the SPARQL page", async ({ page }) => {
  await page.goto(appPath("/sparql"));

  await expect(page.getByRole("heading", { name: "Tentris query workspace" })).toBeVisible();
  await expect(page.getByTitle("Amharic DBpedia Tentris query interface")).toHaveAttribute(
    "src",
    "https://am.dbpedia.data.dice-research.org/ui",
  );
});

test("renders the non-technical about page", async ({ page }) => {
  await page.goto(appPath("/about"));

  await expect(page.getByRole("heading", { name: "About Amharic DBpedia" })).toBeVisible();
  await expect(page.getByText("The idea in plain language")).toBeVisible();
  await expect(page.getByText("Why Amharic needs its own chapter")).toBeVisible();
});

test("renders the latest generated backend statistics", async ({ page }) => {
  await page.route("**/api/statistics/latest", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        run_id: "browser-statistics",
        source_dir: "/tmp/rdf",
        report_path: "/tmp/report.json",
        generated_at: "2026-06-12T06:00:00+00:00",
        success: true,
        engine: "python-streaming+def-native",
        dump_date: "20250820",
        extraction_run_id: "GSoC2025",
        file_count: 32,
        total_triples: 600792,
        unique_subjects: 68937,
        unique_predicates: 1016,
        unique_objects: 230955,
        mapping_based_triples: 19456,
        raw_infobox_triples: 39892,
        dataset_statistics: [
          {
            dataset_name: "amwiki-page-links",
            file_path: "/tmp/page-links.ttl.bz2",
            triple_count: 147062,
            subject_count: 22602,
            predicate_count: 1,
            object_count: 50000,
            skipped_lines: 0,
            sample_predicates: [],
          },
        ],
        native_def_stats: {
          attempted: true,
          success: true,
          exit_code: 0,
          stdout_path: "/tmp/stdout.log",
          stderr_path: "/tmp/stderr.log",
          statistics_dir: "/tmp/native",
          error: null,
        },
        error: null,
      }),
    });
  });

  await page.goto(appPath("/statistics"));

  await expect(
    page.getByRole("heading", { name: "Latest generated extraction statistics" }),
  ).toBeVisible();
  await expect(page.getByText("600,792")).toBeVisible();
  await expect(page.getByText("DEF-native statistics: completed successfully.")).toBeVisible();
  await expect(page.getByRole("rowheader", { name: "amwiki-page-links" })).toBeVisible();
});

test("resource route keeps Amharic titles readable when endpoint has no triples", async ({
  page,
}) => {
  await page.route("**/sparql?**", async (route) => {
    await route.fulfill({
      contentType: "application/sparql-results+json",
      body: JSON.stringify({ head: { vars: ["predicate", "object"] }, results: { bindings: [] } }),
    });
  });

  await page.goto(appPath("/resource/ወርቁ_ማሞ"));

  await expect(
    page.getByRole("link", { name: "http://am.dbpedia.org/resource/ወርቁ_ማሞ" }),
  ).toBeVisible();
  await expect(page.getByText("No triples returned")).toBeVisible();
  await expect(page.getByText("%25E1")).toHaveCount(0);
});
