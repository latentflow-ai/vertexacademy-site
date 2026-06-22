import { Prisma } from '@prisma/client';

// Institutional ID generation with gap-filling: the next ID is always the
// LOWEST unused number for its prefix, so deleting an entry frees its number
// for reuse (e.g. delete the only faculty VA-FAC-0001 → next add is 0001 again).
// Existing IDs are never changed. Faculty: VA-FAC-####. Student: VA-<YY>-####.
//
// Reads happen inside the caller's transaction, so sequential bulk inserts see
// prior rows and fill consecutively. The `idNumber` unique constraint is the
// concurrency backstop — callers retry on a unique violation.

type Tx = Prisma.TransactionClient;

function pad4(n: number): string {
  return String(n).padStart(4, '0');
}

async function lowestFreeForPrefix(tx: Tx, prefix: string): Promise<number> {
  const rows = await tx.user.findMany({
    where: { idNumber: { startsWith: prefix } },
    select: { idNumber: true },
  });
  const taken = new Set<number>();
  for (const r of rows) {
    const n = parseInt((r.idNumber || '').slice(prefix.length), 10);
    if (!Number.isNaN(n)) taken.add(n);
  }
  let i = 1;
  while (taken.has(i)) i++;
  return i;
}

export async function nextFacultyId(tx: Tx): Promise<string> {
  const n = await lowestFreeForPrefix(tx, 'VA-FAC-');
  return `VA-FAC-${pad4(n)}`;
}

export async function nextStudentId(tx: Tx, admissionYear: number): Promise<string> {
  const yy = String(admissionYear % 100).padStart(2, '0');
  const prefix = `VA-${yy}-`;
  const n = await lowestFreeForPrefix(tx, prefix);
  return `${prefix}${pad4(n)}`;
}

// Retry a create that generates an idNumber: if two concurrent creates pick the
// same gap-filled number, the unique constraint throws P2002 — recompute & retry.
export async function withIdRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const isIdClash =
        e?.code === 'P2002' && String(e?.meta?.target ?? '').toLowerCase().includes('idnumber');
      if (isIdClash && i < attempts - 1) continue;
      throw e;
    }
  }
}
