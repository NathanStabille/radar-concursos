import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  GitCompareArrows,
  History,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import { reviewDate, type Opportunity } from "@/data/opportunities";
import {
  currency,
  locationLabel,
  period,
  status,
  statusNames,
} from "@/lib/catalog";
import { Timeline } from "./timeline";

export type Modal =
  | { type: "details"; item: Opportunity }
  | { type: "compare" }
  | { type: "criteria" };

type RadarDialogProps = {
  modal: Modal | null;
  compared: Opportunity[];
  today: string;
  onClose: () => void;
};

export function RadarDialog({
  modal,
  compared,
  today,
  onClose,
}: RadarDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    if (!modal && dialog.current?.open) dialog.current?.close();
  }, [modal]);

  const comparisonFields: {
    name: string;
    value: (item: Opportunity) => string;
  }[] = [
    {
      name: "Lotação",
      value: (item) =>
        item.locations.map(locationLabel).join("; ") || "Não confirmada",
    },
    {
      name: "Local de prova",
      value: (item) => item.examLocation || "Não informado ou não se aplica",
    },
    { name: "Área profissional", value: (item) => item.professionalArea },
    { name: "Especialidade", value: (item) => item.specialty },
    {
      name: "Remuneração",
      value: (item) =>
        item.salary === null
          ? "Não confirmada"
          : currency.format(item.salary) + " · " + item.salaryLabel,
    },
    { name: "Escolaridade e requisitos", value: (item) => item.requirement },
    {
      name: "Banca / organização",
      value: (item) => item.board || "Não confirmada",
    },
    { name: "Situação", value: (item) => statusNames[status(item, today)] },
    { name: "Inscrições", value: period },
  ];

  return (
    <dialog
      ref={dialog}
      className={modal?.type === "compare" ? "wide" : ""}
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {modal && (
        <div className="dialog-content">
          <button
            className="icon-button close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={21} />
          </button>
          {modal.type === "criteria" && (
            <>
              <div className="eyebrow">
                <ShieldCheck size={17} /> METODOLOGIA
              </div>
              <h2 id="dialog-title">Critérios do radar</h2>
              <p>
                O catálogo reúne concursos públicos e seleções de diferentes
                áreas profissionais no Brasil. A cobertura inicial é parcial. Os
                filtros de UF e município usam a lotação prevista no edital. O
                local de prova aparece separadamente.
              </p>
              <ul className="criteria">
                <li>
                  Consultamos editais e retificações para identificar a formação
                  exigida para cada cargo e sinalizar quando a aceitação de um
                  diploma está expressa no edital.
                </li>
                <li>
                  Os detalhes registram requisitos adicionais publicados, como
                  experiência. Informações faltantes aparecem sinalizadas.
                </li>
                <li>
                  A curadoria foi conferida em {reviewDate}. As datas alteram a
                  situação das inscrições no painel, e novas publicações
                  oficiais precisam de revisão da curadoria.
                </li>
              </ul>
            </>
          )}
          {modal.type === "details" && (
            <>
              <div className="eyebrow">
                <Building2 size={16} /> {modal.item.org} · {modal.item.kind}
              </div>
              <h2 id="dialog-title">{modal.item.role}</h2>
              <div className="dialog-tags">
                <span className={"status " + status(modal.item, today)}>
                  {statusNames[status(modal.item, today)]}
                </span>
              </div>
              <dl className="details-grid">
                {comparisonFields
                  .filter((field) => field.name !== "Situação")
                  .map((field) => (
                    <div
                      key={field.name}
                      className={
                        field.name === "Escolaridade e requisitos" ||
                        field.name === "Lotação"
                          ? "full"
                          : ""
                      }
                    >
                      <dt>{field.name}</dt>
                      <dd>{field.value(modal.item)}</dd>
                    </div>
                  ))}
              </dl>
              {modal.item.note && (
                <p className="callout">
                  <Info size={17} /> {modal.item.note}
                </p>
              )}
              <a
                className="primary"
                href={modal.item.url}
                target="_blank"
                rel="noreferrer"
              >
                Abrir fonte oficial <ExternalLink size={16} />
              </a>
              <div className="dialog-history">
                <h3>
                  <History size={18} /> Histórico do cargo
                </h3>
                <Timeline
                  entries={[...modal.item.changes].sort((a, b) =>
                    b.date.localeCompare(a.date),
                  )}
                />
              </div>
            </>
          )}
          {modal.type === "compare" && (
            <>
              <div className="eyebrow">
                <GitCompareArrows size={16} /> LADO A LADO
              </div>
              <h2 id="dialog-title">Comparar oportunidades</h2>
              <p>Compare as condições publicadas nas fontes oficiais.</p>
              <div
                className="table-scroll"
                tabIndex={0}
                aria-label="Tabela de comparação"
              >
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Informação</th>
                      {compared.map((item) => (
                        <th scope="col" key={item.id}>
                          <small>{item.org}</small>
                          {item.role}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFields.map((field) => (
                      <tr key={field.name}>
                        <th scope="row">{field.name}</th>
                        {compared.map((item) => (
                          <td key={item.id}>{field.value(item)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">Dados a confirmar</th>
                      {compared.map((item) => (
                        <td key={item.id}>
                          {item.note || "Nenhum campo sinalizado"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">Fonte oficial</th>
                      {compared.map((item) => (
                        <td key={item.id}>
                          <a href={item.url} target="_blank" rel="noreferrer">
                            Consultar <ArrowUpRight size={14} />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
