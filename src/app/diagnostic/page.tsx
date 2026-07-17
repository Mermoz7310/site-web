"use client";

import { useState } from "react";

/* ============================================================
   221BelCode — Page Diagnostic (/diagnostic)
   Appelle /api/diagnostic → workflow n8n → Claude + moteur.
   Design : vert 221 + or + terracotta (pertes), mobile-first.
   ============================================================ */

type Calc = {
  volumes: { heuresSemaine: number; heuresMois: number };
  pertes: { totaleMois: number; totaleAn: number };
  gains: { tempsHeuresMois: number; fcfaMois: number; fcfaAn: number };
  roi: number;
  prixSaaS: number;
};
type ApiResult = {
  ok: boolean;
  niche?: string;
  confiance?: string;
  score?: number;
  calc?: Calc;
  apercu?: string;
  partiel?: boolean;
};

const CANAUX = ["WhatsApp", "Appel", "Message vocal", "Cahier", "Excel"];
const SECTEURS = [
  { v: "grossiste", l: "Grossiste" },
  { v: "quincaillerie", l: "Quincaillerie" },
  { v: "alimentaire", l: "Alimentaire" },
  { v: "services", l: "Services / terrain" },
  { v: "autre", l: "Autre" },
];

const fcfa = (n: number) =>
  Math.round(n).toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";

export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // état du formulaire
  const [description, setDescription] = useState("");
  const [secteur, setSecteur] = useState<string | null>(null);
  const [canaux, setCanaux] = useState<string[]>([]);
  const [cmdJour, setCmdJour] = useState(30);
  const [minParCmd, setMinParCmd] = useState(4);
  const [tauxErreur, setTauxErreur] = useState("parfois");
  const [coutErreur, setCoutErreur] = useState(15000);
  const [credit, setCredit] = useState<string | null>(null);
  const [absence, setAbsence] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const toggleCanal = (c: string) =>
    setCanaux((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  async function submit(cta: string) {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description, secteur, canaux,
          cmdJour, minParCmd, tauxErreur, coutErreur,
          credit, absence,
          name, company, phone, cta,
        }),
      });
      const data: ApiResult = await r.json();
      if (!r.ok || !data.ok) throw new Error("Une erreur est survenue. Réessayez.");
      setResult(data);
      setStep(5);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  const canStart = description.trim() && secteur && canaux.length > 0;

  return (
    <div className="dg-page-bg">
      <style>{css}</style>
      <div className="dg-wrap">
        <div className="dg-brand">
          <div className="dg-logo">221</div>
          <div><b>221BelCode</b> · <span>Diagnostic gratuit</span></div>
        </div>
        <div className="dg-rail">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={step > i ? "done" : step === i ? "on" : ""} />
          ))}
        </div>

        {/* STEP 0 — description libre */}
        {step === 0 && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 1 · Votre activité</div>
            <h1 className="dg-h1">En 2 minutes, voyez ce que la gestion manuelle vous coûte.</h1>
            <p className="dg-lede">Décrivez avec vos mots comment ça se passe chez vous. Notre assistant identifiera votre besoin.</p>
            <div className="dg-card">
              <div className="dg-q">Racontez-nous votre quotidien</div>
              <div className="dg-hint">Ex : « Je vends du matériel, mes clients commandent sur WhatsApp, je recopie tout à la main et j&apos;oublie parfois des commandes. »</div>
              <textarea className="dg-ta" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre activité et ce qui vous fait perdre du temps…" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Votre secteur</div>
              <div className="dg-opts grid">
                {SECTEURS.map((s) => (
                  <div key={s.v} className={"dg-opt radio " + (secteur === s.v ? "sel" : "")} onClick={() => setSecteur(s.v)}>
                    <div className="dg-box"><Check /></div><div>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q">Vos canaux (plusieurs choix)</div>
              <div className="dg-opts grid">
                {CANAUX.map((c) => (
                  <div key={c} className={"dg-opt " + (canaux.includes(c) ? "sel" : "")} onClick={() => toggleCanal(c)}>
                    <div className="dg-box"><Check /></div><div>{c}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-nav">
              <button className="dg-btn primary" disabled={!canStart} onClick={() => setStep(2)}>Analyser mon besoin →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — questions chiffrées */}
        {step === 2 && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 2 · Vos chiffres</div>
            <h2 className="dg-h2">Parlons de votre volume réel.</h2>
            <p className="dg-lede">Une estimation suffit. Ces réponses calculent vos pertes.</p>
            <div className="dg-card">
              <div className="dg-q">Combien de commandes par jour ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{cmdJour}</span><span className="dg-unit">commandes / jour</span></div>
              <input type="range" min={3} max={120} value={cmdJour} onChange={(e) => setCmdJour(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Temps pour traiter une commande ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{minParCmd}</span><span className="dg-unit">minutes / commande</span></div>
              <input type="range" min={1} max={20} value={minParCmd} onChange={(e) => setMinParCmd(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Fréquence des erreurs ?</div>
              <div className="dg-hint">Mauvaise quantité, mauvais produit, oubli.</div>
              <div className="dg-opts">
                {[{ v: "rare", l: "Rare — 1 sur 100" }, { v: "parfois", l: "Parfois — 3 sur 100" }, { v: "souvent", l: "Souvent — 7+ sur 100" }].map((o) => (
                  <div key={o.v} className={"dg-opt radio " + (tauxErreur === o.v ? "sel" : "")} onClick={() => setTauxErreur(o.v)}>
                    <div className="dg-box"><Check /></div><div>{o.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q">Coût moyen d&apos;une erreur ?</div>
              <div className="dg-hint">Reprise, re-livraison, produit perdu.</div>
              <div className="dg-inrow">
                <input type="number" className="dg-num" value={coutErreur} step={1000} onChange={(e) => setCoutErreur(+e.target.value || 0)} />
                <span className="dg-unit">FCFA</span>
              </div>
            </div>
            <div className="dg-nav">
              <button className="dg-btn ghost" onClick={() => setStep(0)}>←</button>
              <button className="dg-btn primary" onClick={() => setStep(3)}>Continuer →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — contexte + coordonnées */}
        {step === 3 && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 3 · Contexte & coordonnées</div>
            <h2 className="dg-h2">Presque terminé.</h2>
            <div className="dg-card">
              <div className="dg-q">Vendez-vous parfois à crédit ?</div>
              <div className="dg-opts">
                {[{ v: "oui_suivi", l: "Oui, et c'est dur à suivre" }, { v: "oui_ok", l: "Oui, mais je gère" }, { v: "non", l: "Non, paiement à la commande" }].map((o) => (
                  <div key={o.v} className={"dg-opt radio " + (credit === o.v ? "sel" : "")} onClick={() => setCredit(o.v)}>
                    <div className="dg-box"><Check /></div><div>{o.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q">Quand vous êtes absent, les commandes…</div>
              <div className="dg-opts">
                {[{ v: "bloque", l: "…s'arrêtent ou prennent du retard" }, { v: "erreurs", l: "…continuent mais avec plus d'erreurs" }, { v: "ok", l: "…tournent sans moi" }].map((o) => (
                  <div key={o.v} className={"dg-opt radio " + (absence === o.v ? "sel" : "")} onClick={() => setAbsence(o.v)}>
                    <div className="dg-box"><Check /></div><div>{o.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q" style={{ marginBottom: 12 }}>Vos informations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="dg-text" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="dg-text" placeholder="Nom de l'entreprise" value={company} onChange={(e) => setCompany(e.target.value)} />
                <input className="dg-text" placeholder="Téléphone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            {err && <div className="dg-err">{err}</div>}
            <div className="dg-nav">
              <button className="dg-btn ghost" onClick={() => setStep(2)}>←</button>
              <button className="dg-btn gold" disabled={loading || !credit || !absence} onClick={() => submit("aucun")}>
                {loading ? <span className="dg-spin" /> : "Révéler mon diagnostic ✦"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — résultat */}
        {step === 5 && result && (
          <ResultView result={result} secteurCanal={canaux[0] || "WhatsApp"} cmdJour={cmdJour} minParCmd={minParCmd} tauxErreur={tauxErreur} coutErreur={coutErreur}
            onRestart={() => { setStep(0); setResult(null); }} onCta={() => submit("demo")} />
        )}

        <div className="dg-foot">Diagnostic confidentiel · Aucune donnée revendue · ~2 minutes</div>
      </div>
    </div>
  );
}

function ResultView({
  result, secteurCanal, cmdJour, minParCmd, tauxErreur, coutErreur, onRestart, onCta,
}: {
  result: ApiResult; secteurCanal: string; cmdJour: number; minParCmd: number;
  tauxErreur: string; coutErreur: number; onRestart: () => void; onCta: () => void;
}) {
  // niche autre que commandes → message simple
  if (result.partiel || !result.calc) {
    return (
      <div className="dg-fade">
        <div className="dg-card" style={{ textAlign: "center" }}>
          <div className="dg-tag" style={{ marginBottom: 12 }}>Besoin identifié : {result.niche}</div>
          <h2 className="dg-h2">Votre demande a bien été transmise.</h2>
          <p className="dg-lede">Un conseiller 221BelCode vous recontacte très vite pour un diagnostic détaillé.</p>
          <button className="dg-btn primary" onClick={onRestart}>↺ Refaire le diagnostic</button>
        </div>
      </div>
    );
  }
  const c = result.calc;
  const sc = result.score ?? 0;
  const interp = sc >= 28 ? "client prioritaire" : sc >= 24 ? "très bonne opportunité" : sc >= 18 ? "bonne opportunité" : "à creuser";

  return (
    <div className="dg-fade">
      <div className="dg-eyebrow"><span className="dot" />Votre diagnostic</div>
      <h2 className="dg-h2">Voici ce que nous avons compris de votre situation.</h2>

      <div className="dg-mirror">
        <div className="dg-li"><Check /><div>Vous traitez <b>~{cmdJour} commandes/jour</b>, surtout par {secteurCanal}.</div></div>
        <div className="dg-li"><Check /><div>Les traiter à la main vous prend <b>~{c.volumes.heuresSemaine} h/semaine</b>.</div></div>
        <div className="dg-li"><Check /><div>Sur un an, près de <b>{fcfa(c.pertes.totaleAn)}</b> de temps et d&apos;erreurs.</div></div>
      </div>

      <div className="dg-stats">
        <div className="dg-stat loss"><div className="k">Temps perdu</div><div className="v">{Math.round(c.volumes.heuresMois)} h</div><div className="sub">par mois en saisie</div></div>
        <div className="dg-stat loss"><div className="k">Pertes / an</div><div className="v">{(c.pertes.totaleAn / 1e6).toFixed(1)}M</div><div className="sub">FCFA (temps + erreurs)</div></div>
        <div className="dg-stat gain"><div className="k">Temps récupéré</div><div className="v">{Math.round(c.gains.tempsHeuresMois)} h</div><div className="sub">par mois avec le SaaS</div></div>
        <div className="dg-stat gain"><div className="k">Économie / an</div><div className="v">{(c.gains.fcfaAn / 1e6).toFixed(1)}M</div><div className="sub">FCFA récupérables</div></div>
      </div>

      <div className="dg-roi">
        <div className="k">Retour sur investissement</div>
        <div className="big">×{c.roi} <small>votre mise</small></div>
        <div className="note">Pour ~{fcfa(c.prixSaaS)}/mois, vous récupéreriez de l&apos;ordre de <b>{fcfa(c.gains.fcfaMois)}/mois</b> de temps et d&apos;erreurs évitées.</div>
      </div>

      {result.apercu && (
        <div className="dg-card">
          <div className="dg-narr">
            {result.apercu.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="dg-assume">
            <b>Comment on a calculé :</b> sur la base de {cmdJour} commandes/jour × {minParCmd} min, un taux d&apos;erreur « {tauxErreur} » et {fcfa(coutErreur)} par erreur que vous avez indiqués. Chiffres indicatifs.
          </div>
        </div>
      )}

      <div className="dg-card" style={{ textAlign: "center" }}>
        <div className="dg-tag" style={{ marginBottom: 12 }}>Score d&apos;opportunité : {sc}/30 · {interp}</div>
        <h2 className="dg-h2" style={{ marginBottom: 6 }}>Envie de voir ça sur vos vraies commandes ?</h2>
        <p className="dg-lede" style={{ marginBottom: 16 }}>Démo de 20 min, sans engagement.</p>
        <button className="dg-btn gold" onClick={onCta}>Réserver ma démo gratuite</button>
      </div>

      <div className="dg-nav">
        <button className="dg-btn ghost" style={{ flex: 1 }} onClick={onRestart}>↺ Recommencer</button>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="dg-check">
      <path d="M5 12l5 5L20 6" stroke="#0B6E4F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const css = `
.dg-page-bg{background:#F7F4EC;min-height:100vh;width:100%}
.dg-wrap{--ink:#0E1B16;--paper:#F7F4EC;--card:#fff;--line:#DDD6C5;--brand:#0B6E4F;--brand-dk:#084d37;--gold:#C9A227;--gold-soft:#F2E6C2;--alert:#B4451F;--muted:#6B7268;--shadow:0 1px 2px rgba(14,27,22,.06),0 8px 30px rgba(14,27,22,.08);
  max-width:680px;margin:0 auto;padding:20px 18px 80px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);line-height:1.5}
.dg-wrap *{box-sizing:border-box}
.dg-brand{display:flex;align-items:center;gap:10px;padding:8px 0 18px}
.dg-logo{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,var(--brand),var(--brand-dk));display:grid;place-items:center;color:#fff;font-weight:800;font-size:17px;box-shadow:var(--shadow)}
.dg-brand b{font-weight:700}.dg-brand span{color:var(--muted);font-size:13px}
.dg-rail{display:flex;gap:6px;margin:6px 0 22px}
.dg-rail i{height:4px;border-radius:99px;background:var(--line);flex:1;transition:.4s}
.dg-rail i.on{background:var(--brand)}.dg-rail i.done{background:var(--gold)}
.dg-eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin-bottom:10px;display:flex;align-items:center;gap:8px}
.dg-eyebrow .dot{width:5px;height:5px;border-radius:99px;background:var(--gold)}
.dg-h1{font-size:26px;line-height:1.18;letter-spacing:-.02em;font-weight:800;margin-bottom:8px}
.dg-h2{font-size:21px;line-height:1.22;font-weight:800;margin-bottom:6px}
.dg-lede{color:var(--muted);font-size:15px;margin-bottom:22px}
.dg-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:var(--shadow);margin-bottom:16px}
.dg-q{font-size:17px;font-weight:700;margin-bottom:4px}
.dg-hint{font-size:13px;color:var(--muted);margin-bottom:14px}
.dg-ta{width:100%;min-height:110px;resize:vertical;font-family:inherit;font-size:15px;padding:13px 14px;border:1.5px solid var(--line);border-radius:11px;line-height:1.5}
.dg-text,.dg-num{width:100%;font-family:inherit;font-size:15px;padding:13px 14px;border:1.5px solid var(--line);border-radius:11px}
.dg-num{font-size:20px;font-weight:700}
.dg-ta:focus,.dg-text:focus,.dg-num:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px #0b6e4f22}
.dg-opts{display:flex;flex-direction:column;gap:9px}
.dg-opts.grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
@media(max-width:460px){.dg-opts.grid{grid-template-columns:1fr}}
.dg-opt{display:flex;align-items:center;gap:11px;padding:13px 14px;cursor:pointer;border:1.5px solid var(--line);border-radius:12px;background:#fff;font-size:14.5px;font-weight:500;transition:.15s}
.dg-opt:hover{border-color:#c3bca8;background:#fffdf7}
.dg-box{width:20px;height:20px;border-radius:6px;border:1.5px solid #c3bca8;display:grid;place-items:center;transition:.15s;flex:0 0 auto}
.dg-opt.radio .dg-box{border-radius:99px}
.dg-check{width:12px;height:12px;opacity:0;transform:scale(.6);transition:.15s}
.dg-opt.sel{border-color:var(--brand);background:#f1f8f4}
.dg-opt.sel .dg-box{background:var(--brand);border-color:var(--brand)}
.dg-opt.sel .dg-check{opacity:1;transform:scale(1)}
.dg-opt.sel .dg-check path{stroke:#fff}
.dg-slideval{font-size:22px;font-weight:800;color:var(--brand)}
.dg-range{width:100%;accent-color:var(--brand);height:26px;margin-top:4px}
.dg-unit{font-size:13px;color:var(--muted);font-weight:600}
.dg-inrow{display:flex;align-items:center;gap:10px}
.dg-nav{display:flex;gap:10px;margin-top:6px}
.dg-btn{font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;padding:14px 20px;border-radius:12px;border:1.5px solid transparent;transition:.15s;flex:1;display:flex;align-items:center;justify-content:center;gap:8px}
.dg-btn.primary{background:var(--brand);color:#fff;box-shadow:var(--shadow)}
.dg-btn.primary:hover{background:var(--brand-dk)}
.dg-btn.primary:disabled,.dg-btn.gold:disabled{opacity:.4;cursor:not-allowed}
.dg-btn.ghost{background:transparent;color:var(--ink);border-color:var(--line);flex:0 0 auto;padding:14px 18px}
.dg-btn.gold{background:var(--gold);color:#2a2205}
.dg-btn.gold:hover{background:#b8931f}
.dg-mirror{border-left:3px solid var(--gold);padding:2px 0 2px 16px;margin:16px 0}
.dg-li{display:flex;gap:9px;padding:6px 0;font-size:14.5px;align-items:flex-start}
.dg-li .dg-check{width:17px;height:17px;opacity:1;transform:none;flex:0 0 auto;margin-top:2px}
.dg-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}
@media(max-width:460px){.dg-stats{grid-template-columns:1fr}}
.dg-stat{border:1px solid var(--line);border-radius:14px;padding:16px;background:#fff}
.dg-stat.loss{background:linear-gradient(180deg,#fff,#fdf3ee);border-color:#eccbbd}
.dg-stat.gain{background:linear-gradient(180deg,#fff,#f0f8f3);border-color:#bfe0cd}
.dg-stat .k{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:7px}
.dg-stat .v{font-size:26px;font-weight:800;line-height:1}
.dg-stat.loss .v{color:var(--alert)}.dg-stat.gain .v{color:var(--brand)}
.dg-stat .sub{font-size:12.5px;color:var(--muted);margin-top:6px}
.dg-roi{background:linear-gradient(135deg,var(--brand-dk),var(--brand));color:#fff;border-radius:16px;padding:22px;margin:18px 0;box-shadow:var(--shadow);position:relative;overflow:hidden}
.dg-roi:after{content:"";position:absolute;right:-40px;top:-40px;width:160px;height:160px;background:radial-gradient(circle,#ffffff22,transparent 70%)}
.dg-roi .k{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.85;margin-bottom:8px}
.dg-roi .big{font-size:40px;font-weight:800;line-height:1}
.dg-roi .big small{font-size:18px;font-weight:600;opacity:.8}
.dg-roi .note{font-size:13px;opacity:.9;margin-top:10px;max-width:92%}
.dg-narr{font-size:15px;line-height:1.65;color:#26302a}
.dg-narr p{margin-bottom:12px}
.dg-assume{font-size:12px;color:var(--muted);background:#faf8f1;border:1px dashed var(--line);border-radius:10px;padding:12px 14px;margin-top:14px}
.dg-assume b{color:var(--ink)}
.dg-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:5px 11px;border-radius:99px;background:var(--gold-soft);color:#6b5610;border:1px solid #e6d49b}
.dg-err{background:#fdf3ee;border:1px solid #eccbbd;color:var(--alert);font-size:13px;padding:12px 14px;border-radius:11px;margin-bottom:12px}
.dg-foot{text-align:center;font-size:12px;color:var(--muted);margin-top:26px}
.dg-fade{animation:dgfade .45s ease both}
@keyframes dgfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.dg-spin{display:inline-block;width:16px;height:16px;border:2px solid #fff5;border-top-color:#fff;border-radius:50%;animation:dgsp .7s linear infinite}
@keyframes dgsp{to{transform:rotate(360deg)}}
`;