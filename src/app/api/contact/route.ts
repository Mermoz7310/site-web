import { NextResponse } from "next/server";

/**
 * Endpoint de contact — prêt à brancher.
 *
 * Pour activer l'envoi d'email, décommentez l'un des blocs ci-dessous
 * et ajoutez la clé correspondante dans .env.local :
 *
 *  - Resend  : RESEND_API_KEY
 *  - Brevo   : BREVO_API_KEY
 *  - Supabase: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Côté client, remplacez le setTimeout de Contact.tsx par :
 *   await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) })
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data?.email || !data?.name || !data?.message) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // --- Option A : Resend ---
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "contact@221belcode.com",
    //   to: "contact@221belcode.com",
    //   subject: `Nouveau projet — ${data.name}`,
    //   replyTo: data.email,
    //   text: `${data.name} (${data.company ?? "—"})\n${data.email} · ${data.phone ?? "—"}\n\n${data.message}`,
    // });

    // --- Option B : Brevo (API transactionnelle) ---
    // await fetch("https://api.brevo.com/v3/smtp/email", {
    //   method: "POST",
    //   headers: {
    //     "api-key": process.env.BREVO_API_KEY!,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     sender: { email: "contact@221belcode.com", name: "221BelCode" },
    //     to: [{ email: "contact@221belcode.com" }],
    //     subject: `Nouveau projet — ${data.name}`,
    //     textContent: data.message,
    //   }),
    // });

    // --- Option C : Supabase (insertion en base) ---
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
    // await supabase.from("leads").insert(data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
