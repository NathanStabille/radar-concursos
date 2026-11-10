import { CircleCheck } from "lucide-react";

function RadarArt() {
  return (
    <svg className="radar-art" viewBox="0 0 430 250" aria-hidden="true">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#436623"
            strokeOpacity=".12"
          />
        </pattern>
        <linearGradient id="sweep">
          <stop stopColor="#739b2d" stopOpacity=".03" />
          <stop offset="1" stopColor="#6b932b" stopOpacity=".38" />
        </linearGradient>
      </defs>
      <rect width="430" height="250" fill="url(#grid)" />
      <g
        transform="translate(279 124)"
        fill="none"
        stroke="#4a6e24"
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
        <circle r="4" fill="#355320" />
        <circle cx="77" cy="-48" r="4.5" fill="#355320" />
        <circle cx="-53" cy="31" r="4" fill="#355320" />
        <circle cx="66" cy="63" r="3.5" fill="#355320" />
        <circle cx="-53" cy="31" r="10" />
        <circle cx="77" cy="-48" r="10" />
      </g>
      <g fill="#3a5727" fontFamily="monospace" fontSize="9" letterSpacing="2">
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
          Explore concursos e seleções por estado, município de lotação e área
          profissional. Confira a formação exigida em cada edital.
        </p>
      </div>
      <div className="hero-note">
        <CircleCheck size={15} /> Curadoria com fontes oficiais
      </div>
    </section>
  );
}
