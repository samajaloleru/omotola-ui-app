import React, { useEffect, useState } from "react";
import { PiTreeEvergreenDuotone, PiSparkleDuotone, PiGrainsDuotone } from "react-icons/pi";

export type Celebration = {
  name: string;
  greeting: string;
  month: number; // 0-based, like Date
  day: number;
  icon: React.ReactNode;
};

export const harvest: Celebration = {
  name: "Church Harvest", greeting: "Happy Harvest", month: 10, day: 8, icon: <PiGrainsDuotone />,
};

const celebrations: Celebration[] = [
  harvest,
  { name: "Christmas", greeting: "Merry Christmas", month: 11, day: 25, icon: <PiTreeEvergreenDuotone /> },
  { name: "New Year", greeting: "Happy New Year", month: 0, day: 1, icon: <PiSparkleDuotone /> },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// Next occurrence of the date in the visitor's local time. The whole day itself counts as "today".
export const nextOccurrence = ({ month, day }: Celebration, now: Date) => {
  const thisYear = new Date(now.getFullYear(), month, day);
  const start = now.getTime() < thisYear.getTime() + DAY_MS ? thisYear : new Date(now.getFullYear() + 1, month, day);
  return { start, isToday: now >= start };
};

export const timeLeft = (ms: number) => ({
  days: Math.floor(ms / DAY_MS),
  hours: Math.floor((ms / (60 * 60 * 1000)) % 24),
  minutes: Math.floor((ms / (60 * 1000)) % 60),
  seconds: Math.floor((ms / 1000) % 60),
});

export const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

export default function Countdown(): JSX.Element {
  const now = useNow();
  const [featured, ...others] = celebrations
    .map((c) => ({ ...c, ...nextOccurrence(c, now) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-20">
      <p className="eyebrow">Omotola Cathedral</p>
      <h1 className="mt-3 text-4xl font-semibold leading-[1.05] text-plum sm:text-5xl">
        {featured.isToday ? featured.greeting : `Counting down to ${featured.name}`}
      </h1>

      <section className="relative mt-10 overflow-hidden rounded-3xl bg-plum px-6 py-10 text-white shadow-lift sm:px-10 sm:py-14">
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 text-[14rem] leading-none text-white/5">
          {featured.icon}
        </span>
        <div className="relative">
          <p className="flex items-center gap-2 text-gold-soft">
            <span className="text-2xl">{featured.icon}</span>
            {featured.name} · {formatDate(featured.start)}
          </p>
          {featured.isToday ? (
            <p className="mt-6 font-serif text-5xl font-semibold sm:text-7xl">{featured.greeting}!</p>
          ) : (
            <Timer target={featured.start} now={now} size="lg" />
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6">
        {others.map((c) => (
          <section key={c.name} className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-plum-50 text-2xl text-plum">{c.icon}</span>
              <div>
                <h2 className="text-2xl font-semibold text-ink">{c.isToday ? c.greeting : c.name}</h2>
                <p className="text-sm text-muted">{formatDate(c.start)}</p>
              </div>
            </div>
            {!c.isToday && <Timer target={c.start} now={now} size="sm" />}
          </section>
        ))}
      </div>
    </div>
  );
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const Timer = ({ target, now, size }: { target: Date; now: Date; size: "lg" | "sm" }) => {
  const { days, hours, minutes, seconds } = timeLeft(target.getTime() - now.getTime());
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
  const large = size === "lg";

  return (
    <div className={large ? "mt-8" : ""}>
      {/* Screen readers get a calm summary instead of a value changing every second */}
      <p className="sr-only">{days} days and {hours} hours to go</p>
      <dl aria-hidden className={`grid grid-cols-4 ${large ? "gap-3 sm:gap-6" : "gap-2 sm:gap-4"}`}>
        {units.map(({ label, value }) => (
          <div
            key={label}
            className={`flex flex-col items-center rounded-xl ${large ? "bg-white/10 px-2 py-4 sm:py-6" : "bg-sand px-3 py-2 sm:min-w-[4.5rem]"}`}
          >
            <dd className={`font-serif font-semibold tabular-nums ${large ? "text-4xl sm:text-7xl" : "text-2xl text-plum"}`}>
              {String(value).padStart(2, "0")}
            </dd>
            <dt className={`order-last mt-1 text-[11px] uppercase tracking-[0.12em] ${large ? "text-white/70" : "text-muted"}`}>
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
};
