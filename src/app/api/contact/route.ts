import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Endpoint de contact — envoie un email via Resend.
 *
 * Variables d'environnement nécessaires (dans Vercel et en local .env.local) :
 *   RESEND_API_KEY   → ta clé Resend (re_...)
 *   CONTACT_TO       → (optionnel) email de réception. Défaut : assndiaye4@gmail.com
 *   CONTACT_FROM     → (optionnel) expéditeur. Défaut : onboarding@resend.dev (mode test)
 *
 * En mode test (onboarding@resend.dev), les emails n'arrivent QUE sur
 * l'adresse de ton compte Resend (assndiaye4@gmail.com).
 * Une fois le domaine 221belcode.com vérifié, passe CONTACT_FROM à
 * contact@221belcode.com pour envoyer vers n'importe quelle adresse.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, company, email, phone, message } = data ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Pas de clé configurée : on log et on renvoie une erreur claire.
      console.error("RESEND_API_KEY manquante.");
      return NextResponse.json(
        { error: "Service email non configuré." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const to = process.env.CONTACT_TO || "assndiaye4@gmail.com";
    const from = process.env.CONTACT_FROM || "221BelCode <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nouvelle demande de devis — ${name}`,
      text:
        `Nouvelle demande depuis le site 221BelCode\n\n` +
        `Nom : ${name}\n` +
        `Entreprise : ${company || "—"}\n` +
        `Email : ${email}\n` +
        `Téléphone : ${phone || "—"}\n\n` +
        `Message :\n${message}\n`,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Réessayez." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur contact:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
