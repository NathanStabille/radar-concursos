import { localDateTime } from "@/lib/catalog";
import { searchIoerj } from "@/lib/official-notices/ioerj";

export const maxDuration = 15;

const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const term = params.get("q")?.trim() ?? "";
  const currentMonth = localDateTime().slice(0, 7);
  const month = params.get("month") ?? currentMonth;

  if (term.length < 3 || term.length > 80 || /[\u0000-\u001f]/.test(term)) {
    return Response.json(
      { error: "Digite um termo de busca com 3 a 80 caracteres." },
      { status: 400, headers },
    );
  }
  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    month < "2005-01" ||
    month > currentMonth
  ) {
    return Response.json(
      {
        error: "Selecione um mês válido, entre janeiro de 2005 e o mês atual.",
      },
      { status: 400, headers },
    );
  }

  try {
    return Response.json(await searchIoerj(term, month), { headers });
  } catch (error) {
    const timeout = error instanceof Error && error.name === "TimeoutError";
    return Response.json(
      {
        error: timeout
          ? "O Diário Oficial do RJ demorou a responder. Tente novamente."
          : "Não foi possível consultar o Diário Oficial do RJ agora. Tente novamente ou abra a busca oficial.",
      },
      { status: timeout ? 504 : 502, headers },
    );
  }
}
