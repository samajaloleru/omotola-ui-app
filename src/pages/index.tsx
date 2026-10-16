import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PiArrowLeftBold, PiArrowRightBold, PiUserPlusDuotone, PiPencilSimpleLineDuotone } from "react-icons/pi";
import omotolaLogo from "../assets/images/omotola_logo.png";
import Create from "../components/create";
import Update from "../components/update";
import { harvest, nextOccurrence, timeLeft, useNow, formatDate } from "./countdown";

type ViewMode = "home" | "create" | "update";

export default function Home(): JSX.Element {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  if (viewMode !== "home") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <button type="button" onClick={() => setViewMode("home")} className="btn-ghost -ml-3 mb-6 px-3 py-2 text-sm">
          <PiArrowLeftBold />
          Back to portal
        </button>
        {viewMode === "create" ? <Create /> : <Update />}
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <section className="animate-rise">
        <p className="eyebrow">Celestial Church of Christ</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.05] text-plum sm:text-5xl lg:text-6xl">
          Omotola Cathedral member portal
        </h1>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
          Keep the parish register up to date. New members can register in a few minutes, and
          existing members can confirm or correct their details using their birthday and phone number.
        </p>
        <div className="mt-10 flex items-center gap-5">
          <img src={omotolaLogo} alt="" className="hidden h-20 w-auto opacity-90 lg:block" />
          <HarvestCountdown />
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-label="Choose an action">
        <ActionCard
          icon={<PiUserPlusDuotone />}
          title="Register as a member"
          description="First time here? Add your name, rank, birthday and a photo."
          onClick={() => setViewMode("create")}
          featured
        />
        <ActionCard
          icon={<PiPencilSimpleLineDuotone />}
          title="Update my details"
          description="Already registered? Verify yourself, then change anything that's out of date."
          onClick={() => setViewMode("update")}
        />
      </section>
    </div>
  );
}

const HarvestCountdown = () => {
  const now = useNow();
  const { start, isToday } = nextOccurrence(harvest, now);
  const { days, hours, minutes, seconds } = timeLeft(start.getTime() - now.getTime());
  const units = [
    { label: "days", value: days },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  return (
    <Link
      to="/countdown"
      className="group flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 shadow-card transition hover:shadow-lift"
    >
      <span className="flex items-center gap-2 text-sm text-muted">
        <span className="text-lg text-gold-dark">{harvest.icon}</span>
        <span>
          <span className="font-medium text-ink">{harvest.name}</span>
          {" · "}
          {formatDate(start).replace(/ \d{4}$/, "")}
        </span>
      </span>
      {isToday ? (
        <span className="font-serif text-2xl font-semibold text-plum">Harvest is today</span>
      ) : (
        <>
          <span className="sr-only">{days} days and {hours} hours to go</span>
          <span aria-hidden className="flex items-baseline gap-3">
            {units.map(({ label, value }) => (
              <span key={label} className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-semibold tabular-nums text-plum">{String(value).padStart(2, "0")}</span>
                <span className="text-xs text-muted">{label}</span>
              </span>
            ))}
          </span>
        </>
      )}
    </Link>
  );
};

const ActionCard = ({ icon, title, description, onClick, featured }: {
  icon: React.ReactNode; title: string; description: string; onClick: () => void; featured?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex animate-rise items-center gap-5 rounded-2xl p-6 text-left transition duration-300 hover:-translate-y-0.5 active:scale-[0.99] sm:p-7 ${
      featured ? "bg-plum text-white shadow-lift hover:bg-plum-600" : "bg-white text-ink shadow-card hover:shadow-lift"
    }`}
  >
    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-3xl ${featured ? "bg-white/10 text-gold-soft" : "bg-plum-50 text-plum"}`}>
      {icon}
    </span>
    <span className="flex-1">
      <span className="block font-serif text-xl font-semibold">{title}</span>
      <span className={`mt-1 block text-sm leading-relaxed ${featured ? "text-white/75" : "text-muted"}`}>{description}</span>
    </span>
    <PiArrowRightBold className={`shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1 ${featured ? "text-gold-soft" : "text-muted"}`} />
  </button>
);
