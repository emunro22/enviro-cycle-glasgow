import { sql, type Project } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Our Work | Envirocycle Glasgow",
  description:
    "Browse Envirocycle Glasgow's recent waste management, clearance, and recycling projects across Glasgow and surrounding areas.",
  alternates: { canonical: "/work" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 12;

interface PageProps {
  searchParams?: { page?: string };
}

export default async function WorkPage({ searchParams }: PageProps) {
  let projects: Project[] = [];
  try {
    projects = (await sql`
      SELECT * FROM projects ORDER BY display_order ASC, created_at DESC
    `) as Project[];
  } catch (err) {
    console.error("Failed to load projects", err);
  }

  // Parse and validate the page param
  const pageParam = searchParams?.page;
  const rawPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));

  if (
    Number.isNaN(rawPage) ||
    rawPage < 1 ||
    (projects.length > 0 && rawPage > totalPages)
  ) {
    notFound();
  }

  const currentPage = rawPage;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageProjects = projects.slice(startIndex, startIndex + PAGE_SIZE);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>Our Work</span>
        </nav>

        <p className="section-label mb-3">Portfolio</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          ALL OUR <span className="gold-text">RECENT WORK</span>
        </h1>
        <p
          className="max-w-2xl text-base md:text-lg"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
        >
          Every job handled professionally and discreetly. Browse our recent
          waste management, clearance, and recycling work across Glasgow.
          {projects.length > 0 && (
            <> Showing {pageProjects.length} of {projects.length} total.</>
          )}
        </p>
      </section>

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-16 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <p
              className="text-center py-16 uppercase tracking-widest text-xs"
              style={{ color: "rgba(245,240,232,0.5)" }}
            >
              Gallery coming soon
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pageProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative h-[280px] sm:h-[340px] lg:h-[380px] overflow-hidden rounded-sm gold-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[var(--forest-dark)] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                    <div className="absolute bottom-0 left-0 p-5 sm:p-6 md:p-7 w-full pointer-events-none">
                      <p className="text-[var(--gold)] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
                        {project.category}
                      </p>
                      <h3 className="text-lg sm:text-xl font-heading text-cream uppercase leading-tight">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ─────────────────────────────────────────── */}
              {totalPages > 1 && (
                <nav
                  className="flex items-center justify-center gap-2 sm:gap-3 mt-12 md:mt-16 flex-wrap"
                  aria-label="Gallery pagination"
                >
                  <PaginationLink
                    href={pageHref(currentPage - 1)}
                    disabled={!hasPrev}
                    ariaLabel="Previous page"
                  >
                    <span aria-hidden="true">←</span>
                    <span className="hidden sm:inline">Previous</span>
                  </PaginationLink>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {pageNumbers.map((n, i) =>
                      n === "ellipsis" ? (
                        <span
                          key={`e-${i}`}
                          className="px-2 text-cream/40"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <PaginationNumber
                          key={n}
                          href={pageHref(n)}
                          number={n}
                          isActive={n === currentPage}
                        />
                      ),
                    )}
                  </div>

                  <PaginationLink
                    href={pageHref(currentPage + 1)}
                    disabled={!hasNext}
                    ariaLabel="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span aria-hidden="true">→</span>
                  </PaginationLink>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

function pageHref(n: number): string {
  return n === 1 ? "/work" : `/work?page=${n}`;
}

function buildPageNumbers(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "ellipsis"> = [];
  pages.push(1);
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

// ── Pagination components ───────────────────────────────────────────────

function PaginationLink({
  href,
  disabled,
  ariaLabel,
  children,
}: {
  href: string;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const baseClass =
    "inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-sm transition-all";
  const enabledClass = "text-cream hover:text-[var(--gold-light)]";
  const disabledClass = "opacity-30 cursor-not-allowed";
  const baseStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,160,23,0.2)",
  };

  if (disabled) {
    return (
      <span
        className={`${baseClass} ${disabledClass}`}
        style={baseStyle}
        aria-disabled="true"
        aria-label={ariaLabel}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClass} ${enabledClass}`}
      style={baseStyle}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

function PaginationNumber({
  href,
  number,
  isActive,
}: {
  href: string;
  number: number;
  isActive: boolean;
}) {
  if (isActive) {
    return (
      <span
        className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full font-bold text-sm cursor-default"
        style={{
          background: "linear-gradient(135deg, #d4a017, #f0c040)",
          color: "#0a1f0b",
          boxShadow: "0 4px 16px rgba(212,160,23,0.3)",
        }}
        aria-current="page"
        aria-label={`Page ${number}`}
      >
        {number}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full font-semibold text-sm text-cream transition-all hover:text-[var(--gold-light)]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(212,160,23,0.2)",
      }}
      aria-label={`Page ${number}`}
    >
      {number}
    </Link>
  );
}
