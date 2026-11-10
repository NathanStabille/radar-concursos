import {
  getNotice,
  notices,
  type ChangeCategory,
  type NoticeId,
} from "@/data/notices";

const amendmentHistory = (Object.keys(notices) as NoticeId[])
  .flatMap((noticeId) => {
    const notice = getNotice(noticeId);
    return Object.entries(notice.amendments ?? {}).map(([id, amendment]) => ({
      ...amendment,
      id: `${noticeId}/${id}`,
      noticeId,
      notice,
    }));
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const amendmentCount = amendmentHistory.length;

export function getAmendmentHistory({
  noticeId,
  opportunityId,
  category,
}: {
  noticeId?: NoticeId;
  opportunityId?: string;
  category?: ChangeCategory;
} = {}) {
  return amendmentHistory
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
    .filter((entry) => entry.changes.length > 0);
}

export type AmendmentHistoryEntry = ReturnType<
  typeof getAmendmentHistory
>[number];
