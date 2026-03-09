import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Facebook,
  Handshake,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Quote,
  Star,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { EventType, TestimonyCategory } from "./backend.d";
import {
  useGetAllGivingFunds,
  useGetAllSermons,
  useGetAllUpcomingEvents,
  useGetApprovedTestimonies,
  useSubmitPrayerRequest,
  useSubmitTestimony,
  useSubscribeNewsletter,
} from "./hooks/useQueries";

// ── Sample Data ───────────────────────────────────────────────────────────────

const SAMPLE_SERMONS = [
  {
    id: BigInt(1),
    title: "Walking in Victory",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 7 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["victory", "faith"],
    description:
      "Discover how to walk in daily victory through the power of God.",
    seriesName: "Conquerors Series",
  },
  {
    id: BigInt(2),
    title: "The Power of the Apostolic",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 14 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["apostolic", "power"],
    description:
      "Understanding the apostolic anointing and its impact for today's church.",
    seriesName: "Apostolic Foundations",
  },
  {
    id: BigInt(3),
    title: "More Than Conquerors",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 21 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["conquerors", "romans"],
    description:
      "Romans 8:37 — a declaration for every believer in every season.",
    seriesName: "Conquerors Series",
  },
  {
    id: BigInt(4),
    title: "Unshakeable Faith",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 28 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["faith", "endurance"],
    description: "How to stand firm when everything around you is shifting.",
    seriesName: "Faith Foundations",
  },
  {
    id: BigInt(5),
    title: "Called to Conquer",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 35 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["calling", "purpose"],
    description: "Every believer is called — discover your divine assignment.",
    seriesName: "Conquerors Series",
  },
  {
    id: BigInt(6),
    title: "The Legacy of Faith",
    speaker: "Apostle Steve Green",
    date: BigInt(Date.now() - 42 * 86400000),
    youtubeId: "dQw4w9WgXcQ",
    tags: ["legacy", "faith"],
    description: "Building a legacy of faith that outlasts a lifetime.",
    seriesName: "Legacy Series",
  },
];

const SAMPLE_EVENTS = [
  {
    id: BigInt(1),
    title: "Sunday Worship Service",
    description:
      "Come experience powerful apostolic worship and the Word of God. All are welcome to join us.",
    dateTime: BigInt(Date.now()),
    location: "Main Sanctuary, Birmingham, AL",
    eventType: "sundayService" as EventType,
    registrationLink: "#visit",
    recurring: "Every Sunday 8:00 AM & 11:00 AM",
  },
  {
    id: BigInt(2),
    title: "Wednesday Bible Study",
    description:
      "Deep dive into the Word with Apostle Green. Grow your understanding of Scripture.",
    dateTime: BigInt(Date.now() + 3 * 86400000),
    location: "Fellowship Hall, Birmingham, AL",
    eventType: "bibleStudy" as EventType,
    registrationLink: "#contact",
    recurring: "Every Wednesday 7:00 PM",
  },
  {
    id: BigInt(3),
    title: "Youth Night",
    description:
      "A generation being raised for the Kingdom. Dynamic worship, relevant teaching, community.",
    dateTime: BigInt(Date.now() + 5 * 86400000),
    location: "Youth Center, Birmingham, AL",
    eventType: "youth" as EventType,
    registrationLink: "#contact",
    recurring: "Every Friday 7:00 PM",
  },
  {
    id: BigInt(4),
    title: "Kingdom Conference 2026",
    description:
      "Annual conference featuring Apostle Green and special guest ministers from across the nation.",
    dateTime: BigInt(new Date("2026-08-15").getTime()),
    location: "Main Sanctuary, Birmingham, AL",
    eventType: "conference" as EventType,
    registrationLink: "#contact",
    recurring: "August 15–17, 2026",
  },
  {
    id: BigInt(5),
    title: "Community Day",
    description:
      "Free community cookout and ministry outreach in Birmingham neighborhoods. Bring the family!",
    dateTime: BigInt(new Date("2026-09-06").getTime()),
    location: "Outdoor Pavilion, Birmingham, AL",
    eventType: "community" as EventType,
    registrationLink: "#contact",
    recurring: "September 6, 2026",
  },
];

const SAMPLE_TESTIMONIES = [
  {
    id: BigInt(1),
    name: "Marcus T.",
    category: "faith" as TestimonyCategory,
    approved: true,
    storyText:
      "I came to More Than Conquerors broken and without direction. Through the preaching of Apostle Green and the love of this community, I found my purpose and my faith has never been stronger. This ministry truly changed my life.",
  },
  {
    id: BigInt(2),
    name: "Sister Patricia W.",
    category: "healing" as TestimonyCategory,
    approved: true,
    storyText:
      "After a devastating diagnosis, the prayer and support of this church carried me through the darkest season of my life. God healed me and this ministry was His instrument. I will never stop praising Him for what He did.",
  },
  {
    id: BigInt(3),
    name: "David M.",
    category: "restoration" as TestimonyCategory,
    approved: true,
    storyText:
      "My marriage was falling apart and I had lost all hope. The counseling and pastoral care from Apostle Green and the team here restored our home completely. We are forever grateful to this ministry for standing with us.",
  },
];

const SAMPLE_GIVING_FUNDS = [
  {
    fundName: "General Fund",
    description:
      "Support the ongoing ministry and operations of the church. Your giving keeps the mission moving.",
    goalAmount: BigInt(50000),
  },
  {
    fundName: "Building Fund",
    description:
      "Help us expand our facilities to reach more of Birmingham with the Gospel of Jesus Christ.",
    goalAmount: BigInt(250000),
  },
  {
    fundName: "Missions Fund",
    description:
      "Send the Gospel beyond Birmingham to the nations. Partner with us in reaching the world.",
    goalAmount: BigInt(25000),
  },
];

// ── Helper Functions ──────────────────────────────────────────────────────────

function formatDate(timestamp: bigint): string {
  const date = new Date(
    Number(timestamp) > 1e12 ? Number(timestamp) : Number(timestamp) * 1000,
  );
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getEventTypeLabel(type: EventType | string): string {
  const labels: Record<string, string> = {
    sundayService: "Sunday Service",
    bibleStudy: "Bible Study",
    youth: "Youth",
    conference: "Conference",
    community: "Community",
  };
  return labels[type as string] || String(type);
}

function getCategoryLabel(cat: TestimonyCategory | string): string {
  const labels: Record<string, string> = {
    faith: "Faith",
    healing: "Healing",
    restoration: "Restoration",
    growth: "Growth",
  };
  return labels[cat as string] || String(cat);
}

// ── Navigation ────────────────────────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home", ocid: "nav.home_link" },
    { href: "#about", label: "About", ocid: "nav.about_link" },
    { href: "#leadership", label: "Leadership", ocid: "nav.leadership_link" },
    { href: "#messages", label: "Watch Messages", ocid: "nav.messages_link" },
    { href: "#events", label: "Events", ocid: "nav.events_link" },
    { href: "#give", label: "Give", ocid: "nav.give_link" },
    { href: "#contact", label: "Contact", ocid: "nav.contact_link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md border-b border-gold/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#home"
          className="flex flex-col leading-none group"
          data-ocid="nav.home_link"
        >
          <span className="text-gold font-display font-bold text-sm sm:text-base tracking-widest uppercase">
            More Than Conquerors
          </span>
          <span className="text-white font-body text-xs sm:text-sm tracking-widest uppercase font-medium">
            Faith Church
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-ocid={link.ocid}
                className="px-3 py-2 text-sm font-body font-medium text-white/80 hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#give"
              className="ml-2 px-5 py-2 btn-gold rounded text-sm uppercase tracking-widest font-bold"
            >
              Give
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          data-ocid="nav.mobile_toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-charcoal/98 backdrop-blur-md border-b border-gold/20"
          >
            <ul className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid={link.ocid}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-base font-body font-medium text-white/80 hover:text-gold transition-colors border-b border-white/5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    document
                      .getElementById("give")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full px-5 py-3 btn-gold rounded text-sm uppercase tracking-widest font-bold text-center"
                >
                  Give Online
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-worship.dim_1920x1080.jpg')",
        }}
      />
      {/* Cinematic layered overlay */}
      <div className="absolute inset-0 bg-black/55" />
      {/* Radial vignette — dark edges, lighter center to breathe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Vertical gradient: darker top (nav legibility) + very dark bottom (content) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85" />
      {/* Subtle warm gold atmosphere at center */}
      <div
        className="absolute inset-0 opacity-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.55 0.14 65 / 0.18), transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Eyebrow — enlarged and gold-glowing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-10 bg-gold/60" />
          <span className="hero-eyebrow text-gold font-body font-bold">
            Birmingham, Alabama
          </span>
          <div className="h-px w-10 bg-gold/60" />
        </motion.div>

        {/* H1 — staggered two-line cinematic treatment */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display font-black text-white hero-title leading-none mb-0">
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
              More Than
            </span>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display font-black text-white hero-title leading-none mb-4">
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
              Conquerors
            </span>
          </h1>
        </motion.div>

        {/* "Faith Church" — gold shimmer headline */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.92 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <h2 className="font-display font-bold gold-shimmer-text hero-subtitle-gold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 tracking-[0.2em] uppercase">
            Faith Church
          </h2>
        </motion.div>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="gold-divider w-32 mx-auto mb-7"
          style={{ transformOrigin: "center" }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="font-body text-white hero-tagline text-lg sm:text-xl md:text-2xl font-semibold tracking-wide mb-2"
        >
          A Ministry of Faith, Power, and Victory
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="font-body text-white/65 hero-tagline text-sm sm:text-base md:text-lg tracking-wider mb-12"
        >
          Serving Birmingham with the Gospel of Jesus Christ
        </motion.p>

        {/* CTAs — bigger, more air */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#messages"
            data-ocid="hero.watch_live_button"
            className="btn-gold px-10 py-4 rounded text-sm uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2.5 shadow-gold"
          >
            <Play size={16} fill="currentColor" />
            Watch Live
          </a>
          <a
            href="#visit"
            data-ocid="hero.visit_button"
            className="btn-outline-white px-10 py-4 rounded text-sm uppercase tracking-widest inline-flex items-center justify-center gap-2.5"
          >
            Plan Your Visit
            <ChevronRight size={16} />
          </a>
          <a
            href="#give"
            data-ocid="hero.give_button"
            className="btn-outline-gold px-10 py-4 rounded text-sm uppercase tracking-widest inline-flex items-center justify-center gap-2.5"
          >
            Give Online
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs font-body tracking-widest uppercase">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-px h-12 bg-gradient-to-b from-transparent to-gold/60"
        />
        <span>Scroll</span>
      </div>

      {/* Diagonal wave transition into next section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
          aria-hidden="true"
        >
          <path
            d="M0,80 L0,40 Q360,0 720,35 Q1080,70 1440,20 L1440,80 Z"
            fill="oklch(0.12 0 0)"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Legacy Section ────────────────────────────────────────────────────────────

function LegacySection() {
  return (
    <section
      id="about"
      className="relative bg-charcoal noise-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-eyebrow">Our Story</p>
            <h2 className="font-display font-bold text-white text-4xl sm:text-5xl leading-tight mb-10 heading-underline">
              Rooted in Faith.
              <br />
              Built for Birmingham.
            </h2>
            <div className="space-y-5 text-white/75 font-body leading-relaxed">
              <p>
                More Than Conquerors Faith Church was founded on a singular,
                powerful conviction — that the Gospel of Jesus Christ has the
                power to transform every life it touches. Born in the heart of
                Birmingham, Alabama, this ministry was established to be a
                spiritual home for those seeking authentic faith, biblical
                truth, and genuine community.
              </p>
              <p>
                For decades, this church has stood as a pillar of apostolic
                faith in Birmingham — preaching the uncompromised Word, building
                families, developing leaders, and reaching the community with
                the love of Christ. What began as a small gathering of believers
                has grown into a powerful ministry that continues to expand its
                impact across the city and beyond.
              </p>
              <p>
                Under the leadership of Apostle Steve Green, More Than
                Conquerors Faith Church continues to fulfill its God-given
                mandate: to raise up a people who do not merely survive life's
                challenges, but who walk in total victory — more than conquerors
                through Him who loved us.
              </p>
            </div>
          </motion.div>

          {/* Right: Scripture pullquote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-charcoal-mid border border-gold/20 rounded-lg p-8 sm:p-10 relative overflow-hidden">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold" />

              <Quote className="text-gold/30 w-16 h-16 mb-4" />
              <blockquote className="font-display italic text-white text-2xl sm:text-3xl leading-relaxed mb-6 font-bold">
                "Yet in all these things we are more than conquerors through Him
                who loved us."
              </blockquote>
              <cite className="font-body text-gold text-sm tracking-widest uppercase font-semibold not-italic">
                — Romans 8:37
              </cite>

              <div className="mt-8 pt-8 border-t border-gold/20 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-display font-bold text-gold text-3xl">
                    30+
                  </div>
                  <div className="font-body text-white/60 text-xs mt-1 uppercase tracking-wider">
                    Years
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-gold text-3xl">
                    1000+
                  </div>
                  <div className="font-body text-white/60 text-xs mt-1 uppercase tracking-wider">
                    Members
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-gold text-3xl">
                    BHM
                  </div>
                  <div className="font-body text-white/60 text-xs mt-1 uppercase tracking-wider">
                    Alabama
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed banner */}
      <div className="relative h-72 sm:h-88 overflow-hidden">
        <img
          src="/assets/generated/birmingham-skyline.dim_1920x800.jpg"
          alt="Birmingham skyline"
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: "center 30%" }}
          loading="lazy"
        />
        {/* Richer overlay with gold tint at center */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/75" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.72 0.12 75), transparent 65%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="gold-divider w-20 mx-auto mb-6" />
            <h3
              className="font-display font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic"
              style={{
                textShadow:
                  "0 2px 12px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)",
              }}
            >
              Serving Birmingham for Generations
            </h3>
            <div className="gold-divider w-20 mx-auto mt-6" />
          </div>
        </div>
        {/* Bottom wave into Leadership */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-12 sm:h-16"
            aria-hidden="true"
          >
            <path
              d="M0,60 L0,30 Q360,60 720,25 Q1080,-10 1440,30 L1440,60 Z"
              fill="oklch(0.16 0 0)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Leadership Section ────────────────────────────────────────────────────────

function LeadershipSection() {
  return (
    <section id="leadership" className="bg-charcoal-mid py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-eyebrow">Apostolic Leadership</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl">
            Our Senior Leader
          </h2>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        {/* Leader card */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-sm mx-auto lg:mx-0"
          >
            <div className="relative">
              {/* Gold border frame */}
              <div className="absolute -inset-3 border-2 border-gold/40 rounded-lg transform translate-x-3 translate-y-3" />
              <div className="absolute -inset-1 border border-gold/20 rounded-lg" />
              <img
                src="/assets/generated/apostle-green.dim_600x800.jpg"
                alt="Apostle Steve Green"
                className="relative w-full rounded-lg object-cover object-top shadow-2xl"
                style={{ maxHeight: "520px" }}
                loading="lazy"
              />
              {/* Name overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-lg">
                <div className="text-gold font-body text-xs tracking-widest uppercase font-semibold">
                  Senior Pastor & Apostle
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-display font-bold text-white text-4xl sm:text-5xl mb-2">
              Apostle Steve Green
            </h3>
            <div className="text-gold font-body text-sm tracking-widest uppercase font-semibold mb-6">
              Senior Pastor & Apostle — More Than Conquerors Faith Church
            </div>
            <div className="gold-divider w-12 mb-8" />

            <div className="space-y-4 text-white/75 font-body leading-relaxed">
              <p>
                Apostle Steve Green is a man of God whose life and ministry have
                been marked by an unwavering commitment to the apostolic call.
                Born and raised in Birmingham, Alabama, Apostle Green has
                dedicated his life to the work of the Gospel — not simply within
                the walls of a church, but in the streets, homes, and
                communities of the city he loves.
              </p>
              <p>
                Called to the apostolic office, Apostle Green carries a divine
                mandate to build the local church, establish the foundations of
                biblical truth, and raise up a generation of believers who are
                equipped to walk in kingdom authority. His preaching is
                anointed, direct, and life-changing — delivered with the kind of
                spiritual power that only comes through years of consecrated
                prayer and dedication to the Word.
              </p>
              <p>
                Under his leadership, More Than Conquerors Faith Church has
                grown from a small congregation into a thriving ministry that
                impacts Birmingham and reaches beyond the city. Apostle Green is
                committed to seeing every member of this church walk in their
                God-given destiny — truly living as more than conquerors.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#messages"
                data-ocid="leadership.watch_sermons_button"
                className="btn-gold px-7 py-3 rounded text-sm uppercase tracking-widest font-bold inline-flex items-center gap-2"
              >
                <Play size={14} fill="currentColor" />
                Watch Apostle Green Preach
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Sermon Archive Grid ───────────────────────────────────────────────────────

interface SermonData {
  id: bigint;
  title: string;
  speaker: string;
  date: bigint;
  youtubeId: string;
  tags: string[];
  description: string;
  seriesName: string;
}

function SermonCard({
  sermon,
  index,
  ocid,
}: {
  sermon: SermonData;
  index: number;
  ocid: string;
}) {
  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-charcoal-light border border-white/10 rounded-lg overflow-hidden group hover:border-gold/40 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative bg-charcoal aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${sermon.youtubeId}/mqdefault.jpg`}
          alt={sermon.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-2 border-gold/80 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Play size={22} className="text-gold ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-gold font-body text-xs tracking-widest uppercase font-semibold mb-2">
          {sermon.seriesName}
        </div>
        <h4 className="font-display font-bold text-white text-xl mb-1 group-hover:text-gold transition-colors">
          {sermon.title}
        </h4>
        <p className="font-body text-white/60 text-sm mb-3">{sermon.speaker}</p>
        <p className="font-body text-white/50 text-xs mb-4 line-clamp-2">
          {sermon.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-body text-white/40 text-xs">
            {formatDate(sermon.date)}
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-4 py-1.5 rounded text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1"
          >
            Watch Now
            <ChevronRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function MessagesSection() {
  const { data: sermons, isLoading } = useGetAllSermons();
  const displaySermons = (
    sermons && sermons.length > 0 ? sermons : SAMPLE_SERMONS
  ).slice(0, 6);

  return (
    <section id="messages" className="bg-charcoal py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-eyebrow">Sermons & Teaching</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            Watch & Listen
          </h2>
          <p className="font-body text-white/60 max-w-xl mx-auto">
            Experience the life-changing Word of God through the messages of
            Apostle Steve Green and our guest ministers.
          </p>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        {/* Featured Sermon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gold/20">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Faith That Overcomes — Apostle Steve Green"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <Badge className="bg-gold/20 text-gold border border-gold/30 font-bold text-xs tracking-wider uppercase mb-3">
                  Latest Message
                </Badge>
                <h3 className="font-display font-bold text-white text-2xl sm:text-3xl featured-sermon-title mb-1">
                  Faith That Overcomes
                </h3>
                <p className="font-body text-gold/80 text-sm tracking-wide font-semibold">
                  Apostle Steve Green
                </p>
              </div>
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold inline-flex items-center gap-1.5 shrink-0 mt-1"
              >
                <Play size={12} fill="currentColor" />
                Watch
              </a>
            </div>
          </div>
        </motion.div>

        {/* Sermon Archive Grid */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-white text-2xl mb-8 heading-underline inline-block">
            Sermon Archive
          </h3>
          <div className="mb-8" />
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-72 rounded-lg bg-charcoal-light"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySermons.map((sermon, i) => (
                <SermonCard
                  key={String(sermon.id)}
                  sermon={sermon}
                  index={i}
                  ocid={`messages.sermon.item.${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="messages.sermon_archive_button"
            className="btn-gold px-8 py-4 rounded text-sm uppercase tracking-widest font-bold inline-flex items-center gap-2"
          >
            View Full Sermon Archive
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Wave into Events */}
      <div className="relative overflow-hidden pointer-events-none mt-16">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 block"
          aria-hidden="true"
        >
          <path
            d="M0,0 Q360,60 720,20 Q1080,-20 1440,40 L1440,60 L0,60 Z"
            fill="oklch(0.16 0 0)"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Events Section ────────────────────────────────────────────────────────────

interface EventData {
  id: bigint;
  title: string;
  description: string;
  dateTime: bigint;
  location: string;
  eventType: EventType | string;
  registrationLink: string;
  recurring?: string;
}

function EventCard({
  event,
  index,
  ocid,
  registerOcid,
}: {
  event: EventData;
  index: number;
  ocid: string;
  registerOcid: string;
}) {
  const typeColors: Record<string, string> = {
    sundayService: "bg-gold/20 text-gold",
    bibleStudy: "bg-blue-900/40 text-blue-300",
    youth: "bg-purple-900/40 text-purple-300",
    conference: "bg-red-900/40 text-red-300",
    community: "bg-green-900/40 text-green-300",
  };

  const colorClass =
    typeColors[event.eventType as string] || "bg-gold/20 text-gold";

  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-charcoal-mid border border-white/10 rounded-lg p-6 event-card-gold-top hover:border-gold/30 transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider ${colorClass}`}
        >
          {getEventTypeLabel(event.eventType)}
        </span>
        <Calendar className="text-gold/50 w-5 h-5 flex-shrink-0" />
      </div>

      <h4 className="font-display font-bold text-white text-xl mb-2">
        {event.title}
      </h4>

      <div className="flex items-center gap-1.5 text-gold text-sm font-body mb-3">
        <Clock size={14} />
        <span className="font-semibold">
          {(event as (typeof SAMPLE_EVENTS)[0]).recurring ||
            formatDate(event.dateTime)}
        </span>
      </div>

      <div className="flex items-start gap-1.5 text-white/50 text-sm font-body mb-4">
        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
        <span>{event.location}</span>
      </div>

      <p className="font-body text-white/65 text-sm leading-relaxed flex-1 mb-5">
        {event.description}
      </p>

      <a
        href={event.registrationLink || "#contact"}
        data-ocid={registerOcid}
        className="btn-outline-gold px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 mt-auto"
      >
        Learn More
        <ChevronRight size={14} />
      </a>
    </motion.div>
  );
}

function EventsSection() {
  const { data: events } = useGetAllUpcomingEvents();
  const displayEvents = (
    events && events.length > 0
      ? events.map((e) => ({ ...e, recurring: undefined }))
      : SAMPLE_EVENTS
  ).slice(0, 5);

  return (
    <section id="events" className="bg-charcoal-mid py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-eyebrow">Join Us</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            Gatherings & Events
          </h2>
          <p className="font-body text-white/60 max-w-xl mx-auto">
            There's always something happening at More Than Conquerors. Find
            your place and join us as we gather, grow, and go together.
          </p>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event, i) => (
            <EventCard
              key={String(event.id)}
              event={event}
              index={i}
              ocid={`events.event.item.${i + 1}`}
              registerOcid={`events.event.register_button.${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Community Impact ──────────────────────────────────────────────────────────

function CommunitySection() {
  const pillars = [
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      title: "Youth Ministry",
      desc: "Raising the next generation in faith and purpose. Our youth ministry provides mentorship, discipleship, and community for young people across Birmingham.",
    },
    {
      icon: <Heart className="w-8 h-8 text-gold" />,
      title: "Family Programs",
      desc: "Strengthening homes and marriages through Biblical principles. We offer counseling, workshops, and support for families at every stage.",
    },
    {
      icon: <Handshake className="w-8 h-8 text-gold" />,
      title: "Community Outreach",
      desc: "Meeting needs and sharing hope in Birmingham neighborhoods. From food drives to community events, we serve our city with the love of Christ.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gold" />,
      title: "Faith Counseling",
      desc: "Restoring lives through faith-based guidance and support. Our pastoral care team is available to walk alongside you through life's challenges.",
    },
  ];

  return (
    <section
      id="community"
      className="relative bg-charcoal overflow-hidden py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-lg overflow-hidden"
          >
            <img
              src="/assets/generated/community-outreach.dim_1200x800.jpg"
              alt="Community outreach"
              className="w-full h-80 lg:h-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </motion.div>

          {/* Right: Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="section-eyebrow">Our Mission</p>
            <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
              Impacting Birmingham
            </h2>
            <p className="font-body text-white/65 mb-10">
              More Than Conquerors Faith Church is more than a place of worship
              — we are an active force for transformation in the city of
              Birmingham.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-charcoal-mid border border-white/10 rounded-lg p-5 hover:border-gold/30 transition-colors"
                >
                  <div className="mb-3">{pillar.icon}</div>
                  <h4 className="font-display font-bold text-white text-lg mb-2">
                    {pillar.title}
                  </h4>
                  <p className="font-body text-white/55 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave into Visit */}
      <div className="relative overflow-hidden pointer-events-none mt-12">
        <svg
          viewBox="0 0 1440 50"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-12 block"
          aria-hidden="true"
        >
          <path
            d="M0,50 L0,20 Q480,50 720,15 Q960,-20 1440,25 L1440,50 Z"
            fill="oklch(0.16 0 0)"
          />
        </svg>
      </div>
    </section>
  );
}

// ── Plan Your Visit ───────────────────────────────────────────────────────────

function VisitSection() {
  return (
    <section id="visit" className="bg-charcoal-mid py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-eyebrow">First Time?</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            We'd Love to Have You
          </h2>
          <p className="font-body text-white/60 max-w-2xl mx-auto text-lg">
            No matter where you are in your journey, there is a place for you
            here.
          </p>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <Clock className="w-6 h-6 text-gold" />,
                  title: "Service Times",
                  content: "Sundays 8:00 AM & 11:00 AM\nWednesdays 7:00 PM",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-gold" />,
                  title: "Location",
                  content: "Birmingham, Alabama\n(Contact us for directions)",
                },
                {
                  icon: <Star className="w-6 h-6 text-gold" />,
                  title: "What to Expect",
                  content:
                    "Authentic worship, powerful preaching, and a community that cares",
                },
                {
                  icon: <Users className="w-6 h-6 text-gold" />,
                  title: "Children's Ministry",
                  content:
                    "Safe, fun, and faith-filled for ages infant through 12",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-charcoal border border-gold/15 rounded-lg p-5"
                >
                  <div className="mb-3">{item.icon}</div>
                  <h4 className="font-display font-semibold text-white text-base mb-2">
                    {item.title}
                  </h4>
                  <p className="font-body text-white/60 text-sm whitespace-pre-line">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://maps.google.com/?q=Birmingham,Alabama"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-6 py-3 rounded text-sm uppercase tracking-widest font-bold inline-flex items-center gap-2"
              >
                <MapPin size={14} />
                Get Directions
              </a>
              <a
                href="#contact"
                className="btn-outline-gold px-6 py-3 rounded text-sm uppercase tracking-widest font-bold inline-flex items-center gap-2"
              >
                Contact Us
                <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-charcoal border border-gold/15 rounded-lg overflow-hidden"
          >
            <div className="h-80 flex flex-col items-center justify-center text-center p-8 relative">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, oklch(0.72 0.12 75) 0, oklch(0.72 0.12 75) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(0.72 0.12 75) 0, oklch(0.72 0.12 75) 1px, transparent 1px, transparent 40px)",
                }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full border-2 border-gold/50 flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-8 h-8 text-gold" />
                </div>
                <h4 className="font-display font-bold text-white text-xl mb-2">
                  More Than Conquerors Faith Church
                </h4>
                <p className="font-body text-white/60 text-sm mb-1">
                  Birmingham, Alabama
                </p>
                <p className="font-body text-gold text-sm font-semibold mb-6">
                  Contact us for our exact address
                </p>
                <a
                  href="https://maps.google.com/?q=Birmingham,Alabama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold px-6 py-2.5 rounded text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2"
                >
                  Open in Maps
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Giving Section ────────────────────────────────────────────────────────────

function GivingSection() {
  const { data: funds } = useGetAllGivingFunds();
  const displayFunds = funds && funds.length > 0 ? funds : SAMPLE_GIVING_FUNDS;

  return (
    <section
      id="give"
      className="bg-charcoal py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 75), transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-eyebrow">Sow Into the Kingdom</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            Partner With the Ministry
          </h2>
          <div className="max-w-2xl mx-auto bg-charcoal-mid border border-gold/20 rounded-lg p-6 mt-6">
            <Quote className="text-gold/40 w-8 h-8 mx-auto mb-3" />
            <p className="font-display italic text-white/85 text-lg sm:text-xl">
              "Honor the Lord with your wealth and with the firstfruits of all
              your produce."
            </p>
            <cite className="font-body text-gold text-sm tracking-widest uppercase font-semibold not-italic mt-3 block">
              — Proverbs 3:9
            </cite>
          </div>
        </motion.div>

        {/* Giving fund cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayFunds.map((fund, i) => (
            <motion.div
              key={fund.fundName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal-mid border border-gold/20 rounded-lg p-6 text-center hover:border-gold/50 hover:shadow-gold transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                {i === 0 && <Heart className="w-6 h-6 text-gold" />}
                {i === 1 && <MapPin className="w-6 h-6 text-gold" />}
                {i === 2 && <ArrowRight className="w-6 h-6 text-gold" />}
              </div>
              <h4 className="font-display font-bold text-white text-xl mb-3">
                {fund.fundName}
              </h4>
              <p className="font-body text-white/60 text-sm leading-relaxed">
                {fund.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              type="button"
              data-ocid="give.give_button"
              className="btn-gold px-10 py-5 rounded text-base uppercase tracking-widest font-bold inline-flex items-center gap-3 shadow-gold-lg"
              onClick={() => {
                toast.success(
                  "You will be redirected to our secure giving portal.",
                );
              }}
            >
              Give Online Now
              <ArrowRight size={18} />
            </button>
            <p className="font-body text-white/40 text-sm mt-4 flex items-center justify-center gap-1.5">
              <Check size={14} className="text-gold/60" />
              Secure online giving. Your generosity makes a difference.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonies Section ───────────────────────────────────────────────────────

interface TestimonyData {
  id: bigint;
  name: string;
  category: TestimonyCategory | string;
  approved: boolean;
  storyText: string;
}

function TestimonyCard({
  testimony,
  index,
  ocid,
}: {
  testimony: TestimonyData;
  index: number;
  ocid: string;
}) {
  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-charcoal-mid border border-white/10 rounded-lg p-6 flex flex-col hover:border-gold/30 transition-colors"
    >
      <Quote className="text-gold/30 w-10 h-10 mb-4 flex-shrink-0" />
      <p className="font-body text-white/75 text-base leading-relaxed italic flex-1 mb-6">
        "{testimony.storyText}"
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div>
          <div className="font-display font-bold text-white text-base">
            {testimony.name}
          </div>
        </div>
        <Badge
          className={`text-xs font-body font-semibold uppercase tracking-wider ${
            testimony.category === "healing"
              ? "bg-blue-900/50 text-blue-300 border-blue-700/30"
              : testimony.category === "restoration"
                ? "bg-purple-900/50 text-purple-300 border-purple-700/30"
                : testimony.category === "growth"
                  ? "bg-green-900/50 text-green-300 border-green-700/30"
                  : "bg-gold/20 text-gold border-gold/30"
          }`}
        >
          {getCategoryLabel(testimony.category)}
        </Badge>
      </div>
    </motion.div>
  );
}

function TestimoniesSection() {
  const { data: testimonies } = useGetApprovedTestimonies();
  const displayTestimonies = (
    testimonies && testimonies.length > 0 ? testimonies : SAMPLE_TESTIMONIES
  ).slice(0, 3);

  // Testimony form state
  const [testimonyName, setTestimonyName] = useState("");
  const [testimonyCategory, setTestimonyCategory] = useState<
    TestimonyCategory | ""
  >("");
  const [testimonyStory, setTestimonyStory] = useState("");
  const [testimonyErrors, setTestimonyErrors] = useState<
    Record<string, string>
  >({});

  const submitTestimony = useSubmitTestimony();

  function validateTestimony() {
    const errs: Record<string, string> = {};
    if (!testimonyName.trim()) errs.name = "Name is required";
    if (!testimonyCategory) errs.category = "Please select a category";
    if (!testimonyStory.trim()) errs.story = "Your story is required";
    else if (testimonyStory.trim().length < 30)
      errs.story = "Please share at least a few sentences";
    return errs;
  }

  async function handleTestimonySubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateTestimony();
    if (Object.keys(errs).length > 0) {
      setTestimonyErrors(errs);
      return;
    }
    setTestimonyErrors({});
    try {
      await submitTestimony.mutateAsync({
        id: BigInt(Date.now()),
        name: testimonyName,
        category: testimonyCategory as TestimonyCategory,
        storyText: testimonyStory,
        approved: false,
      });
      toast.success(
        "Thank you for sharing your story! It will be reviewed by our team.",
      );
      setTestimonyName("");
      setTestimonyCategory("");
      setTestimonyStory("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="testimonies" className="bg-charcoal-mid py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-eyebrow">Transformed Lives</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            Lives Transformed
          </h2>
          <p className="font-body text-white/60 max-w-xl mx-auto">
            Real stories of faith, healing, and restoration from our
            congregation.
          </p>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        {/* Testimony cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayTestimonies.map((testimony, i) => (
            <TestimonyCard
              key={String(testimony.id)}
              testimony={testimony}
              index={i}
              ocid={`testimonies.item.${i + 1}`}
            />
          ))}
        </div>

        {/* Share Your Story Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-charcoal border border-gold/15 rounded-lg p-8"
        >
          <h3 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2 text-center">
            Share Your Story
          </h3>
          <p className="font-body text-white/55 text-sm text-center mb-8">
            Has God moved in your life through this ministry? We'd love to hear
            from you.
          </p>

          <form onSubmit={handleTestimonySubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="testimony-name"
                className="text-white/70 font-body text-sm mb-2 block"
              >
                Your Name
              </Label>
              <Input
                id="testimony-name"
                data-ocid="testimony_form.name_input"
                value={testimonyName}
                onChange={(e) => setTestimonyName(e.target.value)}
                placeholder="Enter your name"
                className="bg-charcoal-light border-white/20 text-white placeholder:text-white/30 focus:border-gold/60"
              />
              {testimonyErrors.name && (
                <p className="text-destructive text-xs mt-1">
                  {testimonyErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="testimony-category"
                className="text-white/70 font-body text-sm mb-2 block"
              >
                Category
              </Label>
              <Select
                value={testimonyCategory}
                onValueChange={(v) =>
                  setTestimonyCategory(v as TestimonyCategory)
                }
              >
                <SelectTrigger
                  id="testimony-category"
                  data-ocid="testimony_form.category_select"
                  className="bg-charcoal-light border-white/20 text-white focus:border-gold/60"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-mid border-white/20">
                  <SelectItem
                    value="faith"
                    className="text-white hover:text-gold"
                  >
                    Faith
                  </SelectItem>
                  <SelectItem
                    value="healing"
                    className="text-white hover:text-gold"
                  >
                    Healing
                  </SelectItem>
                  <SelectItem
                    value="restoration"
                    className="text-white hover:text-gold"
                  >
                    Restoration
                  </SelectItem>
                  <SelectItem
                    value="growth"
                    className="text-white hover:text-gold"
                  >
                    Growth
                  </SelectItem>
                </SelectContent>
              </Select>
              {testimonyErrors.category && (
                <p className="text-destructive text-xs mt-1">
                  {testimonyErrors.category}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="testimony-story"
                className="text-white/70 font-body text-sm mb-2 block"
              >
                Your Story
              </Label>
              <Textarea
                id="testimony-story"
                data-ocid="testimony_form.story_textarea"
                value={testimonyStory}
                onChange={(e) => setTestimonyStory(e.target.value)}
                placeholder="Share how God has worked in your life through this ministry..."
                rows={5}
                className="bg-charcoal-light border-white/20 text-white placeholder:text-white/30 focus:border-gold/60 resize-none"
              />
              {testimonyErrors.story && (
                <p className="text-destructive text-xs mt-1">
                  {testimonyErrors.story}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="testimony_form.submit_button"
              disabled={submitTestimony.isPending}
              className="w-full btn-gold py-4 rounded text-sm uppercase tracking-widest font-bold"
            >
              {submitTestimony.isPending
                ? "Submitting..."
                : "Submit Your Story"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ── Prayer Request Section ────────────────────────────────────────────────────

function PrayerSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prayerText, setPrayerText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const submitPrayer = useSubmitPrayerRequest();

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email";
    if (!prayerText.trim()) errs.prayer = "Please share your prayer request";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await submitPrayer.mutateAsync({
        id: BigInt(Date.now()),
        submittedDate: BigInt(Date.now()),
        name,
        email,
        prayerText,
      });
      setSubmitted(true);
      toast.success(
        "Your prayer request has been received. We are standing with you in faith.",
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="prayer"
      className="bg-charcoal py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Gold glow bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 75), transparent)",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="section-eyebrow">Prayer</p>
          <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4">
            We're Believing With You
          </h2>
          <p className="font-body text-white/60">
            Submit your prayer request and our pastoral team will stand in faith
            with you.
          </p>
          <div className="gold-divider w-16 mx-auto mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-charcoal-mid border border-gold/15 rounded-lg p-8"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                data-ocid="prayer_form.success_state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display font-bold text-white text-2xl mb-3">
                  Prayer Received
                </h3>
                <p className="font-body text-white/65 mb-6">
                  Your request has been submitted. Our pastoral team will be
                  lifting you up in prayer. You are not alone in this.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setPrayerText("");
                  }}
                  className="btn-outline-gold px-6 py-2.5 rounded text-sm uppercase tracking-widest font-bold"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <Label
                    htmlFor="prayer-name"
                    className="text-white/70 font-body text-sm mb-2 block"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="prayer-name"
                    data-ocid="prayer_form.name_input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-charcoal border-white/20 text-white placeholder:text-white/30 focus:border-gold/60"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="prayer-email"
                    className="text-white/70 font-body text-sm mb-2 block"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="prayer-email"
                    type="email"
                    data-ocid="prayer_form.email_input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-charcoal border-white/20 text-white placeholder:text-white/30 focus:border-gold/60"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="prayer-text"
                    className="text-white/70 font-body text-sm mb-2 block"
                  >
                    Prayer Request
                  </Label>
                  <Textarea
                    id="prayer-text"
                    data-ocid="prayer_form.prayer_textarea"
                    value={prayerText}
                    onChange={(e) => setPrayerText(e.target.value)}
                    placeholder="Share your prayer request with us..."
                    rows={5}
                    className="bg-charcoal border-white/20 text-white placeholder:text-white/30 focus:border-gold/60 resize-none"
                  />
                  {errors.prayer && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.prayer}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  data-ocid="prayer_form.submit_button"
                  disabled={submitPrayer.isPending}
                  className="w-full btn-gold py-4 rounded text-sm uppercase tracking-widest font-bold"
                >
                  {submitPrayer.isPending
                    ? "Submitting..."
                    : "Submit Prayer Request"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="bg-charcoal-mid py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5 text-gold" />
            </div>
            <h4 className="font-display font-semibold text-white text-lg mb-1">
              Location
            </h4>
            <p className="font-body text-white/60 text-sm">
              Birmingham, Alabama
            </p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-5 h-5 text-gold" />
            </div>
            <h4 className="font-display font-semibold text-white text-lg mb-1">
              Phone
            </h4>
            <p className="font-body text-white/60 text-sm">(205) 555-0100</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5 text-gold" />
            </div>
            <h4 className="font-display font-semibold text-white text-lg mb-1">
              Email
            </h4>
            <p className="font-body text-white/60 text-sm">
              info@mtcfaithchurch.org
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const subscribeNewsletter = useSubscribeNewsletter();

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (
      !newsletterEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      await subscribeNewsletter.mutateAsync(newsletterEmail);
      toast.success(
        "You're subscribed! Welcome to the More Than Conquerors community.",
      );
      setNewsletterEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Church info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="font-display font-black text-gold text-lg tracking-widest uppercase leading-tight">
                More Than Conquerors
              </div>
              <div className="font-body font-medium text-white text-sm tracking-widest uppercase">
                Faith Church
              </div>
            </div>
            <div className="gold-divider w-10 mb-4" />
            <p className="font-body text-white/55 text-sm leading-relaxed">
              A Ministry of Faith, Power, and Victory. Serving Birmingham with
              the Gospel of Jesus Christ.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4 tracking-wide uppercase">
              Quick Links
            </h5>
            <ul className="space-y-2">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About the Ministry" },
                { href: "#leadership", label: "Leadership" },
                { href: "#messages", label: "Watch Messages" },
                { href: "#events", label: "Events" },
                { href: "#give", label: "Give" },
                { href: "#prayer", label: "Prayer Request" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-white/55 text-sm hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-gold/50" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service times + contact */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4 tracking-wide uppercase">
              Service Times
            </h5>
            <div className="space-y-3 mb-6">
              <div className="font-body text-white/55 text-sm">
                <div className="text-gold font-semibold mb-0.5">Sunday</div>
                8:00 AM & 11:00 AM
              </div>
              <div className="font-body text-white/55 text-sm">
                <div className="text-gold font-semibold mb-0.5">Wednesday</div>
                Bible Study — 7:00 PM
              </div>
              <div className="font-body text-white/55 text-sm">
                <div className="text-gold font-semibold mb-0.5">Friday</div>
                Youth Night — 7:00 PM
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/55 text-sm font-body">
                <MapPin size={13} className="text-gold/60" />
                Birmingham, Alabama
              </div>
              <div className="flex items-center gap-2 text-white/55 text-sm font-body">
                <Phone size={13} className="text-gold/60" />
                (205) 555-0100
              </div>
              <div className="flex items-center gap-2 text-white/55 text-sm font-body">
                <Mail size={13} className="text-gold/60" />
                info@mtcfaithchurch.org
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter + Social */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4 tracking-wide uppercase">
              Stay Connected
            </h5>
            <p className="font-body text-white/55 text-sm mb-4">
              Get the latest updates, sermon releases, and event announcements.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
              <Input
                type="email"
                data-ocid="footer.newsletter_input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                className="bg-charcoal-light border-white/20 text-white placeholder:text-white/30 focus:border-gold/60 text-sm flex-1"
              />
              <Button
                type="submit"
                data-ocid="footer.subscribe_button"
                disabled={subscribeNewsletter.isPending}
                className="btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-bold shrink-0"
              >
                {subscribeNewsletter.isPending ? "..." : "Subscribe"}
              </Button>
            </form>

            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.facebook_link"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/60 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.instagram_link"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/60 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.youtube_link"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/60 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/40 text-sm text-center sm:text-left">
            © {currentYear} More Than Conquerors Faith Church | Birmingham,
            Alabama. All rights reserved.
          </p>
          <p className="font-body text-white/30 text-xs text-center">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/50 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  // Set page title
  useEffect(() => {
    document.title = "More Than Conquerors Faith Church | Birmingham, Alabama";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "More Than Conquerors Faith Church — A Ministry of Faith, Power, and Victory. Serving Birmingham, Alabama with the Gospel of Jesus Christ under the leadership of Apostle Steve Green.",
      );
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content =
        "More Than Conquerors Faith Church — A Ministry of Faith, Power, and Victory. Serving Birmingham, Alabama with the Gospel of Jesus Christ under the leadership of Apostle Steve Green.";
      document.head.appendChild(m);
    }
  }, []);

  return (
    <div className="min-h-screen bg-charcoal font-body">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0 0)",
            border: "1px solid oklch(0.72 0.12 75 / 0.3)",
            color: "white",
          },
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <LegacySection />
        <LeadershipSection />
        <MessagesSection />
        <EventsSection />
        <CommunitySection />
        <VisitSection />
        <GivingSection />
        <TestimoniesSection />
        <PrayerSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
