import type {
  Notice,
  ChangeCategory,
  AmendmentHistoryEntry,
} from "@/types/catalog";
export type { AmendmentHistoryEntry } from "@/types/catalog";
export function getAmendmentHistory(
  notices: Record<string, Notice>,
  {
    noticeId,
    opportunityId,
    category,
  }: {
    noticeId?: string;
    opportunityId?: string;
    category?: ChangeCategory;
  } = {},
): AmendmentHistoryEntry[] {
  return Object.entries(notices)
    .flatMap(([id, notice]) =>
      Object.entries(notice.amendments ?? {}).map(
        ([amendmentId, amendment]) => ({
          ...amendment,
          id: `${id}/${amendmentId}`,
          noticeId: id,
          notice,
        }),
      ),
    )
    .filter((entry) => !noticeId || entry.noticeId === noticeId)
    .map((entry) => ({
      ...entry,
      changes: entry.changes.filter(
        (change) =>
          (!category || change.category === category) &&
          (!opportunityId ||
            !change.opportunityIds ||
            change.opportunityIds.includes(opportunityId)),
      ),
    }))
    .filter((entry) => entry.changes.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}
