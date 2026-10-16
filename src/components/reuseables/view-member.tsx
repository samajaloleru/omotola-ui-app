import React, { useEffect } from 'react';
import {
  PiXBold, PiDownloadSimpleBold, PiCakeDuotone, PiEnvelopeSimpleDuotone, PiPhoneDuotone,
  PiGenderIntersexDuotone, PiBriefcaseDuotone, PiHouseLineDuotone, PiUserDuotone,
} from 'react-icons/pi';
import { MemberInfo } from '../../utils/interface';
import { addSuffix } from '../../utils/common';

interface ViewMemberProps {
  member: MemberInfo | null;
  closeModal?: (value: boolean) => void;
}

const ViewMember = ({ member, closeModal }: ViewMemberProps) => {
  const handleCloseModal = () => closeModal?.(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal?.(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={handleCloseModal}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-name"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-3xl animate-rise flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
          <div>
            <p className="eyebrow">{member?.rank || 'Member'}</p>
            <h2 id="member-name" className="mt-1 text-2xl font-semibold sm:text-3xl">{member?.fullName || '—'}</h2>
          </div>
          <button type="button" onClick={handleCloseModal} aria-label="Close" className="rounded-lg p-2 text-muted transition hover:bg-sand hover:text-ink">
            <PiXBold size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col gap-3 md:w-56 md:shrink-0">
              <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-sand">
                {member?.imageUrl ? (
                  <img src={member.imageUrl} alt={`Portrait of ${member.fullName}`} className="h-full w-full object-cover" />
                ) : (
                  <PiUserDuotone className="text-6xl text-muted" />
                )}
              </div>
              {member?.imageUrl && (
                <a href={`${member.imageUrl}?dl=`} download className="btn-secondary w-full">
                  <PiDownloadSimpleBold />
                  Download photo
                </a>
              )}
            </div>

            <dl className="grid flex-1 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <Detail icon={<PiEnvelopeSimpleDuotone />} title="Email" value={member?.email} />
              <Detail icon={<PiPhoneDuotone />} title="Phone" value={member?.mobile} />
              <Detail icon={<PiGenderIntersexDuotone />} title="Gender" value={member?.gender} />
              <Detail
                icon={<PiCakeDuotone />}
                title="Birthday"
                value={member?.day ? `${addSuffix(member.day)} of ${member.month}` : undefined}
              />
              <Detail icon={<PiBriefcaseDuotone />} title="Profession" value={member?.profession} wide />
              <Detail icon={<PiHouseLineDuotone />} title="Home address" value={member?.homeAddress} wide />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ icon, title, value, wide }: { icon: React.ReactNode, title: string, value?: string, wide?: boolean }) => (
  <div className={`border-b border-line pb-4 ${wide ? 'sm:col-span-2' : ''}`}>
    <dt className="flex items-center gap-2 text-sm text-muted">
      <span className="text-base text-gold-dark">{icon}</span>
      {title}
    </dt>
    <dd className="mt-1 break-words font-medium text-ink">{value || '—'}</dd>
  </div>
);

export default ViewMember;
