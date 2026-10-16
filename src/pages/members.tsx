import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  PiLockKeyDuotone, PiUserDuotone, PiPhoneDuotone, PiKeyDuotone, PiMagnifyingGlassBold,
  PiGenderIntersexDuotone, PiCalendarBlankDuotone, PiXBold, PiUsersThreeDuotone, PiCaretRightBold,
} from "react-icons/pi";

import { api, ApiError } from "../utils/api";
import { MemberInfo } from "../utils/interface";
import SelectField from "../components/reuseables/select";
import { monthsList, genderOptions } from "../constant";
import ViewMember from "../components/reuseables/view-member";
import Pagination from "../components/reuseables/pagination";
import InputField from "../components/reuseables/Input/input";
import Button from "../components/reuseables/Button/button";
import { useAlert } from "../utils/notification/alertcontext";

const initialSearchParams = {
  page: 1,
  pageSize: 10,
  month: '',
  gender: '',
  name: ''
};

const Members: React.FC = () => {
  // Short-lived session token issued by /api/access; never stored beyond this page view
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  return sessionToken
    ? <Directory token={sessionToken} onExpired={() => setSessionToken(null)} />
    : <AccessGate onGranted={setSessionToken} />;
};

const AccessGate = ({ onGranted }: { onGranted: (token: string) => void }) => {
  const { addAlert } = useAlert();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = fullName.trim();
    const phone = mobile.trim();

    if (name.length < 2) return addAlert({ message: "Please enter your full name", type: "error" });
    if (phone.length < 7) return addAlert({ message: "Please enter a valid phone number", type: "error" });
    if (!accessCode) return addAlert({ message: "Access code cannot be empty", type: "error" });

    setSubmitting(true);
    try {
      const { token } = await api<{ token: string }>("access", {
        method: "POST",
        body: { fullName: name, mobile: phone, accessCode },
      });
      addAlert({ message: `Welcome, ${name.split(" ")[0]}`, type: "success" });
      onGranted(token);
    } catch (error: any) {
      setAccessCode("");
      setSubmitting(false);
      addAlert({ message: error.message, type: "error" });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-md animate-rise rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-plum-50 text-2xl text-plum">
          <PiLockKeyDuotone />
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-plum">Members directory</h1>
        <p className="mt-2 text-muted">
          This page is restricted. Tell us who you are and enter the access code you were given.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <InputField title="Full name" type="text" icon={<PiUserDuotone />} placeholder="Your full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <InputField title="Phone number" type="number" icon={<PiPhoneDuotone />} placeholder="0803 000 0000" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          <InputField title="Access code" type="password" icon={<PiKeyDuotone />} placeholder="Enter access code" autoComplete="off" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-8 w-full">
          {submitting ? "Checking…" : "Continue"}
        </button>
        <p className="mt-4 text-center text-xs text-muted">Every access attempt is recorded.</p>
      </form>
    </div>
  );
};

const Directory = ({ token, onExpired }: { token: string; onExpired: () => void }) => {
  const { addAlert } = useAlert();
  const [viewAble, setViewAble] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalMember, setTotalMember] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [tempName, setTempName] = useState(''); // Temporary name for debounce
  const [memberList, setMemberlist] = useState<MemberInfo[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCloseModal = useCallback((value: boolean) => {
    setViewAble(value);
    setSelectedMember(null);
  }, []);

  const fetchData = useCallback(async () => {
    const query = new URLSearchParams(
      Object.entries(searchParams).map(([key, value]) => [key, String(value)])
    );

    setLoading(true);
    try {
      const { items, total } = await api<{ items: MemberInfo[]; total: number }>(`members?${query}`, { token });
      setMemberlist(items);
      setTotalMember(total);
      setTotalPage(Math.ceil(total / searchParams.pageSize));
    } catch (error: any) {
      setMemberlist([]);
      addAlert({ message: error.message, type: "error" });
      if (error instanceof ApiError && error.status === 401) onExpired();
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }

  const onPageSizeChange = (pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageSize, page: 1 }));
  }

  const handleFilterChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value, page: 1 }));
  }

  const clearFilters = () => {
    setSearchParams(initialSearchParams);
    setTempName('');
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempName(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleFilterChange('name', value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const hasFilters = Boolean(searchParams.month || searchParams.gender || searchParams.name);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {viewAble && selectedMember && (
        <ViewMember member={selectedMember} closeModal={handleCloseModal} />
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Parish register</p>
          <h1 className="mt-2 text-3xl font-semibold text-plum sm:text-4xl">Members directory</h1>
        </div>
        <p className="flex items-center gap-2 text-muted">
          <PiUsersThreeDuotone className="text-xl text-gold-dark" />
          <span className="font-medium tabular-nums text-ink">{totalMember}</span>
          {hasFilters ? "matching" : "members"}
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <InputField type="search" icon={<PiMagnifyingGlassBold />} placeholder="Search by name" value={tempName} onChange={handleNameChange} />
          <SelectField icon={<PiGenderIntersexDuotone />} value={searchParams.gender} recordList={genderOptions} onChangeText={(value) => handleFilterChange('gender', value)} placeholder="All genders" />
          <SelectField icon={<PiCalendarBlankDuotone />} value={searchParams.month} recordList={monthsList} onChangeText={(value) => handleFilterChange('month', value)} placeholder="Any birth month" />
          <Button title="Clear" icon={<PiXBold />} variant="ghost" onPress={clearFilters} className={hasFilters ? "" : "invisible"} />
        </div>

        <div className="hidden grid-cols-[3fr_2fr_1.5fr_auto] gap-4 bg-sand/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.08em] text-muted md:grid">
          <span>Name</span>
          <span>Rank</span>
          <span>Birthday</span>
          <span className="w-16" />
        </div>

        <ul className="divide-y divide-line">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-4 px-5 py-4">
              <span className="h-10 w-10 rounded-lg bg-sand" />
              <span className="h-3 w-1/3 rounded bg-sand" />
              <span className="ml-auto h-3 w-1/5 rounded bg-sand" />
            </li>
          ))}

          {!loading && memberList.length === 0 && (
            <li className="flex flex-col items-center px-6 py-16 text-center">
              <PiMagnifyingGlassBold className="text-3xl text-muted" />
              <p className="mt-3 font-serif text-xl text-ink">No members found</p>
              <p className="mt-1 text-sm text-muted">Try a different name, or clear the filters.</p>
              {hasFilters && <Button title="Clear filters" variant="secondary" onPress={clearFilters} className="mt-6" />}
            </li>
          )}

          {!loading && memberList.map((member) => (
            <li key={member._id}>
              <button
                type="button"
                onClick={() => { setSelectedMember(member); setViewAble(true); }}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 text-left transition hover:bg-plum-50/60 md:grid-cols-[3fr_2fr_1.5fr_auto]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-sand text-muted">
                    {member.imageUrl
                      ? <img src={`${member.imageUrl}?w=80&h=80&fit=crop`} alt="" loading="lazy" className="h-full w-full object-cover" />
                      : <PiUserDuotone />}
                  </span>
                  <span className="hidden truncate font-medium text-ink md:block">{member.fullName}</span>
                </span>
                <span className="min-w-0 md:hidden">
                  <span className="block truncate font-medium text-ink">{member.fullName}</span>
                  <span className="block truncate text-sm text-muted">{member.rank}</span>
                </span>
                <span className="hidden truncate text-sm text-muted md:block">{member.rank}</span>
                <span className="hidden text-sm tabular-nums text-muted md:block">{member.day ? `${member.day} ${member.month}` : '—'}</span>
                <span className="flex w-16 items-center justify-end gap-1 text-sm font-medium text-plum">
                  <span className="hidden sm:inline">View</span>
                  <PiCaretRightBold className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Pagination
          currentPage={searchParams.page}
          pageSize={searchParams.pageSize}
          totalPages={totalPage}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          totalItems={totalMember}
        />
      </div>
    </div>
  );
};

export default Members;
