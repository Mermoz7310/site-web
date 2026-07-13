import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Endpoint de contact — 221BelCode
 *
 * Architecture :
 *  1. Envoie le lead au workflow n8n (webhook) qui orchestre tout
 *     (qualification IA, Telegram, email au prospect, Supabase).
 *  2. Garde un envoi email direct via Resend en FILET DE SÉCURITÉ :
 *     si n8n est injoignable, tu reçois quand même le lead par email.
 *
 * Variables d'environnement (Vercel + .env.local) :
 *   N8N_WEBHOOK_URL  → URL du webhook n8n (Production URL, pas Test)
 *   RESEND_API_KEY   → clé Resend (filet de sécurité)
 *   CONTACT_TO       → (optionnel) email de secours. Défaut assndiaye4@gmail.com
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, company, email, phone, message } = data ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const payload = { name, company, email, phone, message };

    // 1) Envoi vers n8n (orchestration principale)
    let n8nOk = false;
    const webhook = process.env.N8N_WEBHOOK_URL;
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        n8nOk = res.ok;
      } catch (e) {
        console.error("n8n injoignable:", e);
      }
    }

    // 2) Filet de sécurité : email direct si n8n a échoué (ou n'est pas configuré)
    if (!n8nOk) {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          const resend = new Resend(apiKey);
          const to = process.env.CONTACT_TO || "assndiaye4@gmail.com";
          await resend.emails.send({
            from: "221BelCode <onboarding@resend.dev>",
            to,
            replyTo: email,
            subject: `Nouvelle demande de devis — ${name}`,
            text:
              `Nouvelle demande depuis le site 221BelCode\n\n` +
              `Nom : ${name}\n` +
              `Entreprise : ${company || "—"}\n` +
              `Email : ${email}\n` +
              `Téléphone : ${phone || "—"}\n\n` +
              `Message :\n${message}\n\n` +
              `(⚠️ Envoyé par le filet de sécurité : n8n n'a pas répondu.)`,
          });
        } catch (e) {
          console.error("Erreur Resend (filet):", e);
          // Ni n8n ni Resend : on signale l'échec au visiteur.
          return NextResponse.json(
            { error: "L'envoi a échoué. Réessayez ou écrivez-nous par email." },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json({ error: "Service non configuré." }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur contact:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}