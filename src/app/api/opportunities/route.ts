import {
  InvalidCatalogRequest,
  parseCatalogRequest,
} from "@/lib/catalog-db/request";
import { queryCatalog } from "@/lib/catalog-db/service";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
export async function GET(request: Request) {
  try {
    return Response.json(
      await queryCatalog(
        parseCatalogRequest(new URL(request.url).searchParams),
      ),
      { headers },
    );
  } catch (error) {
    if (error instanceof InvalidCatalogRequest)
      return Response.json({ error: error.message }, { status: 400, headers });
    return Response.json(
      {
        error: "O catálogo está temporariamente indisponível. Tente novamente.",
      },
      { status: 503, headers },
    );
  }
}
