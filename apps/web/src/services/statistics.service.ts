import { backendUrl } from "./backend.service";

export interface DatasetStatistic {
  readonly dataset_name: string;
  readonly triple_count: number;
  readonly subject_count: number;
  readonly predicate_count: number;
  readonly object_count: number;
  readonly skipped_lines: number;
}

export interface NativeDefStatistics {
  readonly attempted: boolean;
  readonly success: boolean;
  readonly error: string | null;
}

export interface StatisticsReport {
  readonly run_id: string;
  readonly source_dir: string;
  readonly generated_at: string;
  readonly success: boolean;
  readonly engine: string;
  readonly file_count: number;
  readonly total_triples: number;
  readonly unique_subjects: number;
  readonly unique_predicates: number;
  readonly unique_objects: number;
  readonly mapping_based_triples: number;
  readonly raw_infobox_triples: number;
  readonly dataset_statistics: readonly DatasetStatistic[];
  readonly native_def_stats: NativeDefStatistics;
  readonly error: string | null;
}

export async function getLatestStatistics(signal?: AbortSignal): Promise<StatisticsReport> {
  const response = await fetch(backendUrl("/api/statistics/latest"), {
    headers: { Accept: "application/json" },
    signal: signal ?? null,
  });
  if (!response.ok) {
    throw new Error(`Statistics API returned HTTP ${response.status}`);
  }
  return (await response.json()) as StatisticsReport;
}
