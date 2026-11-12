import { CircleCheck } from "lucide-react";

function RadarArt() {
  return (
    <svg className="radar-art" viewBox="0 0 430 250" aria-hidden="true">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".12"
          />
        </pattern>
        <linearGradient id="sweep">
          <stop stopColor="currentColor" stopOpacity=".03" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".38" />
        </linearGradient>
      </defs>
      <rect width="430" height="250" fill="url(#grid)" />
      <g
        transform="translate(279 124)"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".44"
      >
        <circle r="33" />
        <circle r="62" />
        <circle r="91" />
        <circle r="120" />
        <circle r="148" strokeDasharray="3 6" />
        <path d="M-166 0H166M0-135V135M-98 98 98-98" strokeDasharray="3 5" />
        <path
          d="M0 0L30-116A120 120 0 0 1 102-64Z"
          fill="url(#sweep)"
          stroke="none"
        />
        <path d="M0 0 103-64" strokeOpacity=".85" />
        <circle r="4" fill="currentColor" />
        <circle cx="77" cy="-48" r="4.5" fill="currentColor" />
        <circle cx="-53" cy="31" r="4" fill="currentColor" />
        <circle cx="66" cy="63" r="3.5" fill="currentColor" />
        <circle cx="-53" cy="31" r="10" />
        <circle cx="77" cy="-48" r="10" />
      </g>
      <g
        fill="currentColor"
        fontFamily="monospace"
        fontSize="9"
        letterSpacing="2"
      >
        <text x="26" y="39">
          RADAR / BR
        </text>
      </g>
    </svg>
  );
}

export function RadarHero() {
  return (
    <section className="hero">
      <RadarArt />
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="signal"></span> RADAR DE EDITAIS / BR
        </div>
        <h1>
          Concursos públicos
          <br />
          para várias profissões<span>.</span>
        </h1>
        <p>
          Encontre oportunidades por estado, área e formação. Compare os
          requisitos e acompanhe os prazos.
        </p>
      </div>
      <div className="hero-note">
        <CircleCheck size={15} /> Curadoria com fontes oficiais
      </div>
    </section>
  );
}
