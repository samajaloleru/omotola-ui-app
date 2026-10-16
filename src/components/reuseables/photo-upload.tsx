import React from "react";
import { PiCameraPlusDuotone, PiTrashBold, PiArrowsClockwiseBold } from "react-icons/pi";

interface PhotoUploadProps {
  previewUrl?: string | null;
  existingUrl?: string | null;
  accept: string;
  wrongType?: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const PhotoUpload = ({ previewUrl, existingUrl, accept, wrongType, onSelect, onClear }: PhotoUploadProps) => {
  const shownUrl = previewUrl || existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">Photo</span>
      <div className="flex items-center gap-5 rounded-xl border border-dashed border-line bg-sand/60 p-4">
        <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-card">
          {shownUrl ? (
            <img src={shownUrl} alt="Selected member" className="h-full w-full object-cover" />
          ) : (
            <PiCameraPlusDuotone className="text-4xl text-muted" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">A clear, front-facing garment photo of you. JPG or PNG, under 20 MB.</p>
          {wrongType && <p className="text-sm font-medium text-danger">That file type isn't supported.</p>}
          <div className="flex flex-wrap gap-2">
            <label className="btn-secondary cursor-pointer px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-gold">
              {shownUrl ? <PiArrowsClockwiseBold /> : <PiCameraPlusDuotone />}
              {shownUrl ? "Change photo" : "Choose photo"}
              <input type="file" accept={accept} onChange={onSelect} className="sr-only" />
            </label>
            {previewUrl && (
              <button type="button" onClick={onClear} className="btn-ghost px-3 py-2 text-sm">
                <PiTrashBold />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
