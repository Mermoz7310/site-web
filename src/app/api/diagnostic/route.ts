import { NextResponse } from "next/server";

/**
 * Route intermédiaire : la page appelle /api/diagnostic,
 * qui relaie vers le webhook n8n. L'URL n8n reste côté serveur.
 *
 * Variable d'environnement à définir sur Vercel :
 *   N8N_DIAGNOSTIC_WEBHOOK_URL = https://n8n.srv766759.hstgr.cloud/webhook/diagnostic
 */

export const runtime = "nodejs";

const WEBHOOK_URL =
  process.env.N8N_DIAGNOSTIC_WEBHOOK_URL ||
  "https://n8n.srv766759.hstgr.cloud/webhook/diagnostic";

// Champs autorisés, toutes niches confondues.
// Ajouter ici les nouveaux champs quand une niche est ajoutée.
const CHAMPS_TEXTE = [
  "secteur", "niche", "cta",
  // commandes
  "tauxErreur", "credit", "absence", "exemple",
  // interventions
  "retards", "tauxLitige", "preuve",
  // validations
  "oublis", "tracabilite",
  // materiel
  "tauxPerte", "suiviMaintenance", "suiviParc",
];

const CHAMPS_NOMBRE = [
  // commandes
  "cmdJour", "minParCmd", "coutErreur",
  // interventions
  "nbAgents", "intervJour", "minCoordJour", "heuresAgentJour", "coutLitige",
  // validations
  "demandesSemaine", "delaiValidationH", "nbValideurs", "montantMoyen", "minRechercheJour",
  // materiel
  "nbEquipements", "valeurParc", "rechercheSemaine", "minParRecherche",
  "freqInventaireAn", "heuresInventaire", "blocagesMois", "coutBlocage",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload: Record<string, unknown> = {
      description: String(body.description || "").slice(0, 4000),
      canaux: Array.isArray(body.canaux) ? body.canaux.slice(0, 10) : [],
      name: String(body.name || "").slice(0, 120),
      company: String(body.company || "").slice(0, 160),
      email: String(body.email || "").slice(0, 160),
      phone: String(body.phone || "").slice(0, 40),
    };

    for (const k of CHAMPS_TEXTE) {
      if (body[k] !== undefined && body[k] !== null && body[k] !== "") {
        payload[k] = String(body[k]).slice(0, 60);
      }
    }

    for (const k of CHAMPS_NOMBRE) {
      const n = Number(body[k]);
      if (Number.isFinite(n)) payload[k] = n;
    }

    if (!payload.cta) payload.cta = "aucun";

    const r = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // le workflow répond de façon synchrone (respondToWebhook)
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "n8n_error", detail: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}