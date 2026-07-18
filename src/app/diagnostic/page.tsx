"use client";

import { useState } from "react";

/* ============================================================
   221BelCode — Page Diagnostic (/diagnostic) — version 2 temps
   1. Description libre  -> /api/diagnostic-niche (Claude détecte)
   2. Écran "voici votre besoin" (corrigeable)
   3. Questions de LA niche détectée
   4. /api/diagnostic -> diagnostic complet
   ============================================================ */

type Calc = {
  volumes: { heuresSemaine: number; heuresMois: number };
  pertes: { totaleMois: number; totaleAn: number };
  gains: { tempsHeuresMois: number; fcfaMois: number; fcfaAn: number };
  roi: number;
  prixSaaS: number;
};
type ApiResult = {
  ok: boolean; niche?: string; confiance?: string; score?: number;
  calc?: Calc; apercu?: string; partiel?: boolean;
};

const CANAUX = ["WhatsApp", "Appel", "Message vocal", "Cahier", "Excel"];
const SECTEURS = [
  { v: "grossiste", l: "Grossiste / distribution" },
  { v: "quincaillerie", l: "Quincaillerie / matériaux" },
  { v: "alimentaire", l: "Alimentaire / boissons" },
  { v: "services", l: "Services / terrain" },
  { v: "btp", l: "BTP / maintenance" },
  { v: "autre", l: "Autre" },
];

const NICHE_LABELS: Record<string, { titre: string; desc: string }> = {
  commandes: { titre: "Gestion des commandes", desc: "Recevoir, saisir et suivre les commandes de vos clients" },
  interventions: { titre: "Suivi des interventions terrain", desc: "Piloter vos agents sur site et prouver le travail fait" },
  validations: { titre: "Validations internes", desc: "Autoriser et tracer les demandes de vos équipes" },
  materiel: { titre: "Gestion du matériel", desc: "Suivre vos équipements, qui les détient et où ils sont" },
  autre: { titre: "Besoin spécifique", desc: "Votre besoin sort de nos 4 solutions standard" },
};

const fcfa = (n: number) =>
  Math.round(n).toLocaleString("fr-FR").replace(/\u202f/g, " ") + " FCFA";

export default function DiagnosticPage() {
  const [step, setStep] = useState(0); // 0=description 1=niche 2=questions 3=coords 5=résultat
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [demoSent, setDemoSent] = useState(false);

  // étape 1
  const [description, setDescription] = useState("");
  const [secteur, setSecteur] = useState<string | null>(null);
  const [canaux, setCanaux] = useState<string[]>([]);

  // niche détectée
  const [niche, setNiche] = useState<string | null>(null);
  const [confiance, setConfiance] = useState<string>("");
  const [justif, setJustif] = useState<string>("");
  const [correcting, setCorrecting] = useState(false);

  // questions COMMANDES
  const [cmdJour, setCmdJour] = useState(30);
  const [minParCmd, setMinParCmd] = useState(4);
  const [tauxErreur, setTauxErreur] = useState("parfois");
  const [coutErreur, setCoutErreur] = useState(15000);
  const [credit, setCredit] = useState<string | null>(null);
  const [absence, setAbsence] = useState<string | null>(null);

  // questions INTERVENTIONS
  const [nbAgents, setNbAgents] = useState(10);
  const [intervJour, setIntervJour] = useState(12);
  const [minCoordJour, setMinCoordJour] = useState(60);
  const [tauxLitige, setTauxLitige] = useState("parfois");
  const [coutLitige, setCoutLitige] = useState(20000);
  const [retards, setRetards] = useState("parfois");
  const [heuresAgentJour, setHeuresAgentJour] = useState(8);
  const [preuve, setPreuve] = useState<string | null>(null);

  // questions VALIDATIONS
  const [demandesSemaine, setDemandesSemaine] = useState(20);
  const [delaiValidationH, setDelaiValidationH] = useState("24");
  const [nbValideurs, setNbValideurs] = useState(2);
  const [montantMoyen, setMontantMoyen] = useState(50000);
  const [minRechercheJour, setMinRechercheJour] = useState(20);
  const [oublis, setOublis] = useState("parfois");
  const [tracabilite, setTracabilite] = useState<string | null>(null);

  // coordonnées
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const toggleCanal = (c: string) =>
    setCanaux((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  // ---- étape 1 : détection ----
  async function detectNiche() {
    setDetecting(true); setErr(null);
    try {
      const r = await fetch("/api/diagnostic-niche", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, secteur, canaux }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error("Analyse impossible. Réessayez.");
      setNiche(d.niche); setConfiance(d.confiance || ""); setJustif(d.justification || "");
      setStep(1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur inconnue");
    } finally { setDetecting(false); }
  }

  // ---- payload selon la niche ----
  function buildPayload(cta: string) {
    const base = { description, secteur, canaux, niche, name, company, phone, cta };
    if (niche === "commandes") {
      return { ...base, cmdJour, minParCmd, tauxErreur, coutErreur, credit, absence };
    }
    if (niche === "interventions") {
      return { ...base, nbAgents, intervJour, minCoordJour, tauxLitige, coutLitige, retards, heuresAgentJour, preuve };
    }
    if (niche === "validations") {
      return {
        ...base,
        demandesSemaine,
        delaiValidationH: Number(delaiValidationH),
        nbValideurs,
        montantMoyen,
        minRechercheJour,
        oublis,
        tracabilite,
      };
    }
    return base;
  }

  // ---- étape finale : diagnostic ----
  async function submit(cta: string) {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/diagnostic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(cta)),
      });
      const data: ApiResult = await r.json();
      if (!r.ok || !data.ok) throw new Error("Une erreur est survenue. Réessayez.");
      setResult(data); setStep(5);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur inconnue");
    } finally { setLoading(false); }
  }

  async function bookDemo() {
    try {
      await fetch("/api/diagnostic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload("demo")),
      });
    } catch { /* on confirme quand même */ }
    setDemoSent(true);
  }

  const canStart = description.trim().length > 10 && secteur && canaux.length > 0;
  const hasEngine = niche === "commandes" || niche === "interventions" || niche === "validations";
  const railStep = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : 3;

  function resetAll() {
    setStep(0); setResult(null); setDemoSent(false); setNiche(null); setCorrecting(false);
  }

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
            <i key={i} className={railStep > i ? "done" : railStep === i ? "on" : ""} />
          ))}
        </div>

        {/* ÉTAPE 0 — description */}
        {step === 0 && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 1 · Votre activité</div>
            <h1 className="dg-h1">En 2 minutes, voyez ce que la gestion manuelle vous coûte.</h1>
            <p className="dg-lede">Décrivez avec vos mots comment ça se passe chez vous. Notre assistant identifiera votre besoin.</p>
            <div className="dg-card">
              <div className="dg-q">Racontez-nous votre quotidien</div>
              <div className="dg-hint">Ex : « J&apos;ai 10 agents qui vont chez des clients, je ne sais jamais s&apos;ils sont arrivés à l&apos;heure. » ou « Mes chefs de chantier demandent des achats par WhatsApp, je valide de tête. »</div>
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
              <div className="dg-q">Vos outils actuels (plusieurs choix)</div>
              <div className="dg-opts grid">
                {CANAUX.map((c) => (
                  <div key={c} className={"dg-opt " + (canaux.includes(c) ? "sel" : "")} onClick={() => toggleCanal(c)}>
                    <div className="dg-box"><Check /></div><div>{c}</div>
                  </div>
                ))}
              </div>
            </div>
            {err && <div className="dg-err">{err}</div>}
            <div className="dg-nav">
              <button className="dg-btn primary" disabled={!canStart || detecting} onClick={detectNiche}>
                {detecting ? <><span className="dg-spin" /> Analyse en cours…</> : "Analyser mon besoin →"}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 1 — niche détectée */}
        {step === 1 && niche && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Analyse terminée</div>
            <div className="dg-agent">
              <div className="dg-av">IA</div>
              <div className="dg-msg">
                <div className="dg-who">Assistant 221BelCode</div>
                D&apos;après votre description, votre enjeu principal concerne <b>{NICHE_LABELS[niche]?.titre.toLowerCase()}</b>.
                {justif && <div style={{ marginTop: 8, opacity: .8, fontSize: 13 }}>{justif}</div>}
                <div style={{ marginTop: 10 }}>
                  <span className="dg-tag">● {NICHE_LABELS[niche]?.titre} · confiance {confiance}</span>
                </div>
              </div>
            </div>

            {!correcting ? (
              <>
                <div className="dg-card">
                  <div className="dg-q">{NICHE_LABELS[niche]?.titre}</div>
                  <div className="dg-hint" style={{ marginBottom: 0 }}>{NICHE_LABELS[niche]?.desc}</div>
                </div>
                <div className="dg-nav" style={{ flexDirection: "column" }}>
                  <button className="dg-btn primary" onClick={() => setStep(hasEngine ? 2 : 3)}>
                    {hasEngine ? "C'est bien ça, continuer →" : "Continuer →"}
                  </button>
                  <button className="dg-btn ghost" style={{ flex: 1 }} onClick={() => setCorrecting(true)}>
                    Ce n&apos;est pas mon besoin principal
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="dg-card">
                  <div className="dg-q">Quel est votre besoin principal ?</div>
                  <div className="dg-hint">Choisissez celui qui vous correspond le mieux.</div>
                  <div className="dg-opts">
                    {Object.entries(NICHE_LABELS).map(([k, v]) => (
                      <div key={k} className={"dg-opt radio " + (niche === k ? "sel" : "")} onClick={() => setNiche(k)}>
                        <div className="dg-box"><Check /></div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{v.titre}</div>
                          <div style={{ fontSize: 12.5, opacity: .7 }}>{v.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dg-nav">
                  <button className="dg-btn ghost" onClick={() => setCorrecting(false)}>←</button>
                  <button className="dg-btn primary" onClick={() => { setCorrecting(false); setStep(hasEngine ? 2 : 3); }}>
                    Valider →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ÉTAPE 2 — questions COMMANDES */}
        {step === 2 && niche === "commandes" && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 2 · Vos chiffres</div>
            <h2 className="dg-h2">Parlons de votre volume réel.</h2>
            <p className="dg-lede">Une estimation suffit.</p>
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
              <Radio value={tauxErreur} onChange={setTauxErreur} options={[
                { v: "rare", l: "Rare — 1 sur 100" }, { v: "parfois", l: "Parfois — 3 sur 100" }, { v: "souvent", l: "Souvent — 7+ sur 100" }]} />
            </div>
            <div className="dg-card">
              <div className="dg-q">Coût moyen d&apos;une erreur ?</div>
              <div className="dg-inrow">
                <input type="number" className="dg-num" value={coutErreur} step={1000} onChange={(e) => setCoutErreur(+e.target.value || 0)} />
                <span className="dg-unit">FCFA</span>
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q">Vendez-vous à crédit ?</div>
              <Radio value={credit} onChange={setCredit} options={[
                { v: "oui_suivi", l: "Oui, et c'est dur à suivre" }, { v: "oui_ok", l: "Oui, mais je gère" }, { v: "non", l: "Non" }]} />
            </div>
            <div className="dg-card">
              <div className="dg-q">Quand vous êtes absent, les commandes…</div>
              <Radio value={absence} onChange={setAbsence} options={[
                { v: "bloque", l: "…s'arrêtent ou prennent du retard" }, { v: "erreurs", l: "…continuent avec plus d'erreurs" }, { v: "ok", l: "…tournent sans moi" }]} />
            </div>
            <div className="dg-nav">
              <button className="dg-btn ghost" onClick={() => setStep(1)}>←</button>
              <button className="dg-btn primary" disabled={!credit || !absence} onClick={() => setStep(3)}>Continuer →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — questions INTERVENTIONS */}
        {step === 2 && niche === "interventions" && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 2 · Votre équipe terrain</div>
            <h2 className="dg-h2">Parlons de vos agents et interventions.</h2>
            <p className="dg-lede">Une estimation suffit.</p>
            <div className="dg-card">
              <div className="dg-q">Combien d&apos;agents travaillent sur le terrain ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{nbAgents}</span><span className="dg-unit">agents</span></div>
              <input type="range" min={1} max={80} value={nbAgents} onChange={(e) => setNbAgents(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Combien d&apos;interventions par jour (toute l&apos;équipe) ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{intervJour}</span><span className="dg-unit">interventions / jour</span></div>
              <input type="range" min={1} max={100} value={intervJour} onChange={(e) => setIntervJour(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Temps passé chaque jour à appeler / suivre vos agents ?</div>
              <div className="dg-hint">Les appels pour savoir où ils en sont, s&apos;ils sont arrivés…</div>
              <div className="dg-inrow"><span className="dg-slideval">{minCoordJour}</span><span className="dg-unit">minutes / jour</span></div>
              <input type="range" min={0} max={300} step={10} value={minCoordJour} onChange={(e) => setMinCoordJour(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Heures payées par agent et par jour ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{heuresAgentJour}</span><span className="dg-unit">heures / jour</span></div>
              <input type="range" min={2} max={14} value={heuresAgentJour} onChange={(e) => setHeuresAgentJour(+e.target.value)} className="dg-range" />
            </div>
            <div className="dg-card">
              <div className="dg-q">Fréquence des retards ou absences non signalés ?</div>
              <Radio value={retards} onChange={setRetards} options={[
                { v: "rare", l: "Rare" }, { v: "parfois", l: "Parfois" }, { v: "souvent", l: "Souvent" }]} />
            </div>
            <div className="dg-card">
              <div className="dg-q">Fréquence des litiges clients ?</div>
              <div className="dg-hint">Travail contesté, intervention à refaire, client mécontent.</div>
              <Radio value={tauxLitige} onChange={setTauxLitige} options={[
                { v: "rare", l: "Rare" }, { v: "parfois", l: "Parfois" }, { v: "souvent", l: "Souvent" }]} />
            </div>
            <div className="dg-card">
              <div className="dg-q">Coût moyen d&apos;un litige ?</div>
              <div className="dg-hint">Reprise, déplacement supplémentaire, geste commercial.</div>
              <div className="dg-inrow">
                <input type="number" className="dg-num" value={coutLitige} step={5000} onChange={(e) => setCoutLitige(+e.target.value || 0)} />
                <span className="dg-unit">FCFA</span>
              </div>
            </div>
            <div className="dg-card">
              <div className="dg-q">Comment prouvez-vous le travail réalisé ?</div>
              <Radio value={preuve} onChange={setPreuve} options={[
                { v: "aucune", l: "Aucune preuve, on fait confiance" },
                { v: "whatsapp", l: "Photos envoyées sur WhatsApp" },
                { v: "papier", l: "Fiche papier signée" },
                { v: "app", l: "Une application dédiée" }]} />
            </div>
            <div className="dg-nav">
              <button className="dg-btn ghost" onClick={() => setStep(1)}>←</button>
              <button className="dg-btn primary" disabled={!preuve} onClick={() => setStep(3)}>Continuer →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — questions VALIDATIONS */}
        {step === 2 && niche === "validations" && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Étape 2 · Vos validations</div>
            <h2 className="dg-h2">Parlons des demandes que vous devez autoriser.</h2>
            <p className="dg-lede">Achats, avances, congés, sorties de matériel… Une estimation suffit.</p>

            <div className="dg-card">
              <div className="dg-q">Combien de demandes à valider par semaine ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{demandesSemaine}</span><span className="dg-unit">demandes / semaine</span></div>
              <input type="range" min={2} max={150} value={demandesSemaine} onChange={(e) => setDemandesSemaine(+e.target.value)} className="dg-range" />
            </div>

            <div className="dg-card">
              <div className="dg-q">Combien de temps avant qu&apos;une demande soit validée ?</div>
              <div className="dg-hint">Entre le moment où on vous la soumet et votre réponse.</div>
              <Radio value={delaiValidationH} onChange={setDelaiValidationH} options={[
                { v: "2", l: "Moins de 2 heures" },
                { v: "8", l: "Dans la journée" },
                { v: "24", l: "Environ 1 jour" },
                { v: "72", l: "2 à 3 jours" },
                { v: "120", l: "Une semaine ou plus" }]} />
            </div>

            <div className="dg-card">
              <div className="dg-q">Combien de personnes valident ces demandes ?</div>
              <div className="dg-inrow"><span className="dg-slideval">{nbValideurs}</span><span className="dg-unit">valideurs</span></div>
              <input type="range" min={1} max={15} value={nbValideurs} onChange={(e) => setNbValideurs(+e.target.value)} className="dg-range" />
            </div>

            <div className="dg-card">
              <div className="dg-q">Montant moyen d&apos;une demande ?</div>
              <div className="dg-inrow">
                <input type="number" className="dg-num" value={montantMoyen} step={5000} onChange={(e) => setMontantMoyen(+e.target.value || 0)} />
                <span className="dg-unit">FCFA</span>
              </div>
            </div>

            <div className="dg-card">
              <div className="dg-q">Arrive-t-il que des dépenses passent sans validation claire ?</div>
              <div className="dg-hint">Achat fait avant l&apos;accord, montant qui a changé, facture qu&apos;on ne peut pas justifier.</div>
              <Radio value={oublis} onChange={setOublis} options={[
                { v: "rare", l: "Rarement" }, { v: "parfois", l: "Parfois" }, { v: "souvent", l: "Souvent" }]} />
            </div>

            <div className="dg-card">
              <div className="dg-q">Temps passé chaque jour à retrouver qui a validé quoi ?</div>
              <div className="dg-hint">Remonter dans WhatsApp, chercher un cahier, redemander à quelqu&apos;un.</div>
              <div className="dg-inrow"><span className="dg-slideval">{minRechercheJour}</span><span className="dg-unit">minutes / jour</span></div>
              <input type="range" min={0} max={180} step={5} value={minRechercheJour} onChange={(e) => setMinRechercheJour(+e.target.value)} className="dg-range" />
            </div>

            <div className="dg-card">
              <div className="dg-q">Comment gardez-vous une trace des validations ?</div>
              <Radio value={tracabilite} onChange={setTracabilite} options={[
                { v: "aucun", l: "Aucune trace, c'est de mémoire" },
                { v: "oral", l: "À l'oral, on se dit oui" },
                { v: "whatsapp", l: "Messages WhatsApp" },
                { v: "papier", l: "Cahier ou fiche papier" }]} />
            </div>

            <div className="dg-nav">
              <button className="dg-btn ghost" onClick={() => setStep(1)}>←</button>
              <button className="dg-btn primary" disabled={!tracabilite} onClick={() => setStep(3)}>Continuer →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — coordonnées */}
        {step === 3 && (
          <div className="dg-fade">
            <div className="dg-eyebrow"><span className="dot" />Dernière étape</div>
            <h2 className="dg-h2">Presque terminé.</h2>
            <p className="dg-lede">Pour vous envoyer votre diagnostic et vous recontacter si vous le souhaitez.</p>
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
              <button className="dg-btn ghost" onClick={() => setStep(hasEngine ? 2 : 1)}>←</button>
              <button className="dg-btn gold" disabled={loading} onClick={() => submit("aucun")}>
                {loading ? <span className="dg-spin" /> : "Révéler mon diagnostic ✦"}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 — résultat */}
        {step === 5 && result && (
          <ResultView result={result} canal={canaux[0] || "WhatsApp"} niche={niche || ""}
            demoSent={demoSent} onRestart={resetAll} onCta={bookDemo} />
        )}

        <div className="dg-foot">Diagnostic confidentiel · Aucune donnée revendue · ~2 minutes</div>
      </div>
    </div>
  );
}

function Radio({ value, onChange, options }: {
  value: string | null; onChange: (v: string) => void; options: { v: string; l: string }[];
}) {
  return (
    <div className="dg-opts">
      {options.map((o) => (
        <div key={o.v} className={"dg-opt radio " + (value === o.v ? "sel" : "")} onClick={() => onChange(o.v)}>
          <div className="dg-box"><Check /></div><div>{o.l}</div>
        </div>
      ))}
    </div>
  );
}

function ResultView({ result, canal, niche, demoSent, onRestart, onCta }: {
  result: ApiResult; canal: string; niche: string; demoSent: boolean;
  onRestart: () => void; onCta: () => void;
}) {
  if (result.partiel || !result.calc) {
    return (
      <div className="dg-fade">
        <div className="dg-card" style={{ textAlign: "center" }}>
          <div className="dg-tag" style={{ marginBottom: 12 }}>
            Besoin identifié : {NICHE_LABELS[result.niche || "autre"]?.titre}
          </div>
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

  // Libellés adaptés à la niche
  const LIB: Record<string, { k: string; sub: string }> = {
    commandes:     { k: "Temps perdu",  sub: "par mois en saisie" },
    interventions: { k: "Coordination", sub: "par mois à suivre vos agents" },
    validations:   { k: "Temps perdu",  sub: "par mois en attente et recherche" },
  };
  const lib = LIB[niche] || { k: "Temps perdu", sub: "par mois" };

  return (
    <div className="dg-fade">
      <div className="dg-eyebrow"><span className="dot" />Votre diagnostic</div>
      <h2 className="dg-h2">Voici ce que nous avons compris de votre situation.</h2>

      <div className="dg-stats">
        <div className="dg-stat loss">
          <div className="k">{lib.k}</div>
          <div className="v">{Math.round(c.volumes.heuresMois)} h</div>
          <div className="sub">{lib.sub}</div>
        </div>
        <div className="dg-stat loss">
          <div className="k">Pertes / an</div>
          <div className="v">{(c.pertes.totaleAn / 1e6).toFixed(1)}M</div>
          <div className="sub">FCFA estimés</div>
        </div>
        <div className="dg-stat gain">
          <div className="k">Temps récupéré</div>
          <div className="v">{Math.round(c.gains.tempsHeuresMois)} h</div>
          <div className="sub">par mois avec le SaaS</div>
        </div>
        <div className="dg-stat gain">
          <div className="k">Économie / an</div>
          <div className="v">{(c.gains.fcfaAn / 1e6).toFixed(1)}M</div>
          <div className="sub">FCFA récupérables</div>
        </div>
      </div>

      <div className="dg-roi">
        <div className="k">Retour sur investissement</div>
        <div className="big">×{c.roi} <small>votre mise</small></div>
        <div className="note">Pour ~{fcfa(c.prixSaaS)}/mois, vous récupéreriez de l&apos;ordre de <b>{fcfa(c.gains.fcfaMois)}/mois</b>.</div>
      </div>

      {result.apercu && (
        <div className="dg-card">
          <div className="dg-narr">
            {result.apercu.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="dg-assume">
            <b>Comment on a calculé :</b> uniquement à partir des chiffres que vous avez indiqués, avec des hypothèses de récupération prudentes. Chiffres indicatifs, à affiner ensemble.
          </div>
        </div>
      )}

      {demoSent ? (
        <div className="dg-card" style={{ textAlign: "center" }}>
          <div className="dg-checkbig">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 6" stroke="#0B6E4F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="dg-h2" style={{ marginBottom: 6 }}>C&apos;est noté, merci !</h2>
          <p className="dg-lede" style={{ marginBottom: 0 }}>
            Un conseiller 221BelCode vous recontacte très vite au numéro que vous avez indiqué. À très bientôt.
          </p>
        </div>
      ) : (
        <div className="dg-card" style={{ textAlign: "center" }}>
          <div className="dg-tag" style={{ marginBottom: 12 }}>Score d&apos;opportunité : {sc}/30 · {interp}</div>
          <h2 className="dg-h2" style={{ marginBottom: 6 }}>Envie de voir ça sur vos vraies données ?</h2>
          <p className="dg-lede" style={{ marginBottom: 16 }}>Démo de 20 min, sans engagement.</p>
          <button className="dg-btn gold" onClick={onCta}>Réserver ma démo gratuite</button>
        </div>
      )}

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
.dg-agent{display:flex;gap:11px;margin-bottom:16px;align-items:flex-start}
.dg-av{width:34px;height:34px;border-radius:10px;flex:0 0 auto;background:linear-gradient(135deg,var(--brand),var(--brand-dk));color:#fff;display:grid;place-items:center;font-weight:800;font-size:13px;box-shadow:var(--shadow)}
.dg-msg{background:#fff;border:1px solid var(--line);border-radius:4px 15px 15px 15px;padding:13px 15px;font-size:14.5px;box-shadow:var(--shadow)}
.dg-who{font-size:11px;font-weight:700;color:var(--brand);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
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
.dg-checkbig{width:56px;height:56px;border-radius:50%;background:#f1f8f4;border:2px solid #bfe0cd;display:grid;place-items:center;margin:0 auto 14px}
.dg-checkbig svg{width:28px;height:28px}
`;