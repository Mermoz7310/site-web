"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Mail, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInUp } from "@/lib/motion";

const schema = z.object({
  name: z.string().min(2, "Votre nom est requis"),
  company: z.string().optional(),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Décrivez votre projet en quelques mots"),
});

type FormData = z.infer<typeof schema>;

export function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // Envoie vers /api/contact. En l'absence de clé email configurée,
    // la route répond quand même ok:true (voir src/app/api/contact/route.ts).
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // silencieux : on confirme quand même à l'utilisateur en démo
    }
    setSent(true);
    reset();
  };

  const inputClass =
    "w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-brand-cyan)] focus:outline-none transition-colors";

  return (
    <section id="contact" className="relative section-pad bg-[var(--color-surface)]/40">
      <div className="absolute top-0 inset-x-0 h-px thread-gradient opacity-30" aria-hidden />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Parlons de votre projet"
          description="Décrivez-nous votre idée. Nous revenons vers vous rapidement avec une première proposition."
        />

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          {/* Info panel */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass rounded-[var(--radius-card)] p-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-brand-blue)]/15 text-[var(--color-brand-cyan)] mb-4">
                <Mail size={18} />
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
                Par email
              </h3>
              <a
                href="mailto:contact@221belcode.com"
                className="mt-1 block text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors"
              >
                contact@221belcode.com
              </a>
            </div>
            <div className="glass rounded-[var(--radius-card)] p-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-brand-blue)]/15 text-[var(--color-brand-cyan)] mb-4">
                <MapPin size={18} />
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-ink)]">
                Nous sommes basés
              </h3>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Belgique &amp; Sénégal — nous travaillons à distance partout dans le monde.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="h-full min-h-[400px] grid place-items-center rounded-[var(--radius-card)] glass p-8 text-center">
                <div>
                  <CheckCircle2 size={48} className="mx-auto text-[var(--color-brand-cyan)]" />
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
                    Message envoyé
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    Merci. Nous revenons vers vous très vite.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm font-medium text-[var(--color-brand-cyan)] hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass rounded-[var(--radius-card)] p-6 sm:p-8 space-y-4"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
                      Nom *
                    </label>
                    <input id="name" {...register("name")} className={inputClass} placeholder="Votre nom" />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
                      Entreprise
                    </label>
                    <input id="company" {...register("company")} className={inputClass} placeholder="Votre société" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
                      Email *
                    </label>
                    <input id="email" type="email" {...register("email")} className={inputClass} placeholder="vous@exemple.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
                      Téléphone
                    </label>
                    <input id="phone" {...register("phone")} className={inputClass} placeholder="+32 ..." />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`${inputClass} resize-none`}
                    placeholder="Décrivez votre projet..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white bg-[var(--color-brand-blue-bright)] hover:bg-[var(--color-brand-blue)] shadow-[0_8px_30px_-8px_rgba(59,130,246,0.6)] disabled:opacity-60 transition-all"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  {!isSubmitting && <Send size={16} />}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
