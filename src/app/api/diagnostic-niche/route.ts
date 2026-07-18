import { NextResponse } from "next/server";

/**
 * Étape 1 du diagnostic : détection de la niche par Claude.
 * La page appelle cette route avec la description libre du prospect,
 * et reçoit la niche détectée + le niveau de confiance.
 *
 * Variable d'environnement (Vercel) :
 *   N8N_NICHE_WEBHOOK_URL = https://n8n.srv766759.hstgr.cloud/webhook/diagnostic-niche
 */

export const runtime = "nodejs";

const WEBHOOK_URL =
  process.env.N8N_NICHE_WEBHOOK_URL ||
  "https://n8n.srv766759.hstgr.cloud/webhook/diagnostic-niche";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      description: String(body.description || "").slice(0, 4000),
      secteur: String(body.secteur || ""),
      canaux: Array.isArray(body.canaux) ? body.canaux.slice(0, 10) : [],
    };

    const r = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
