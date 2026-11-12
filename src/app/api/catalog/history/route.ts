import { queryHistory } from "@/lib/catalog-db/service";
import { changeCategories, type ChangeCategory } from "@/types/catalog";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category") ?? "";
  if (category && !changeCategories.includes(category as ChangeCategory))
    return Response.json(
      { error: "Tipo de alteração inválido." },
      { status: 400, headers },
    );
  try {
    const entries = (await queryHistory())
      .map((entry) => ({
        ...entry,
        changes: entry.changes.filter(
          (change) => !category || change.category === category,
        ),
      }))
      .filter((entry) => entry.changes.length);
    return Response.json({ entries }, { headers });
  } catch {
    return Response.json(
      { error: "Não foi possível carregar o histórico. Tente novamente." },
      { status: 503, headers },
    );
  }
}
