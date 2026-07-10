"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/data/site";
import { staggerContainer, fadeInUp } from "@/lib/motion";

/** En-tête visuel d'une carte : image si dispo, sinon dégradé + fils tissés. */
function ProjectVisual({ project }: { project: Project }) {
  const [imgOk, setImgOk] = useState(Boolean(project.image));

  return (
    <div className={`relative h-40 bg-gradient-to-br ${project.accent} overflow-hidden`}>
      {imgOk && project.image ? (
        <>
          <Image
            src={project.image}
            alt={`Aperçu du projet ${project.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgOk(false)}
          />
          {/* Dégradé bas pour la lisibilité du titre */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)] via-transparent to-transparent" aria-hidden />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
          <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
            <line x1="0" y1="120" x2="400" y2="40" stroke="url(#pg)" strokeWidth="1" />
            <line x1="0" y1="140" x2="400" y2="60" stroke="url(#pg)" strokeWidth="1" strokeOpacity="0.6" />
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="400" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" /><stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}
      <span className="absolute bottom-4 left-5 z-10 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {project.title}
      </span>
    </div>
  );
}

export function Projects() {
  return (
    <section id="realisations" className="relative section-pad bg-[var(--color-surface)]/40">
      <div className="absolute top-0 inset-x-0 h-px thread-gradient opacity-30" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos réalisations"
          title="Des produits pensés pour de vrais usages"
          description="Un aperçu des plateformes que nous concevons, de l'éducation à l'immobilier en passant par l'IA."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project) => (
            <motion.article
              key={project.slug}
              variants={fadeInUp}
              className="group card-lift relative rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] overflow-hidden flex flex-col"
            >
              <ProjectVisual project={project} />

              <div className="flex flex-col flex-1 p-5">
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-ink-faint)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)]">
                  {project.available && project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-cyan)] hover:gap-2.5 transition-all"
                    >
                      Voir le projet <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-faint)]">
                      <Lock size={13} /> Bientôt disponible
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
