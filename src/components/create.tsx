import React, { useEffect, useRef, useState } from "react";
import {
  PiUserDuotone, PiEnvelopeSimpleDuotone, PiPhoneDuotone, PiBriefcaseDuotone,
  PiHouseLineDuotone, PiGenderIntersexDuotone, PiMedalDuotone, PiCheckCircleDuotone, PiPlusBold,
} from "react-icons/pi";
import InputField from "./reuseables/Input/input";
import SelectField from "../components/reuseables/select";
import PhotoUpload from "./reuseables/photo-upload";
import { daysList, errorMessageMap, ErrorTypes, femaleRankList, genderOptions, maleRankList, monthsList, SUCCESSFULLY_SUBMITTED } from "../constant";
import { api, uploadPhoto } from "../utils/api";
import Button from "./reuseables/Button/button";
import { useAlert } from "../utils/notification/alertcontext";
import { validateEmail } from "../utils/common";
import { ERROR_EMAIL_INVALID, ERROR_IMAGE_REQUIRED } from "../constant/errors";
import Modal from "./reuseables/Modal/modal";

export default function Create(): JSX.Element {
  const { addAlert } = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [imageAssetLocal, setImageAssetLocal] = useState<{ url: string} | null>(null);
  const [imageAssetId, setImageAssetId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wrongimageType, setWrongImageType] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [rankList, setRankList] = useState<string[] | null>(null);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const homeAddressRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const professionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imageAssetLocal?.url) {
        URL.revokeObjectURL(imageAssetLocal.url);
      }
    };
  }, [imageAssetLocal]);

  const handleCloseModal = (value: boolean) => {
    setModal(value);
    if (!value) setLoading(false); // Reset loading state when modal closes
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (["image/png", "image/jpg", "image/jpeg", "image/svg+xml", "image/gif"].includes(file.type)) {
      setWrongImageType(false);
      setImageAssetLocal({ url: URL.createObjectURL(file) });
      setSelectedFile(file);
      setImageAssetId(null);
    } else {
      setWrongImageType(true);
    }
  };

  const clearImage = () => {
    setImageAssetLocal(null);
    setSelectedFile(null);
    setImageAssetId(null);
  };

  const validateDate = (day: string, month: string): boolean => {
    const monthIndex = monthsList.indexOf(month) + 1;
    const maxDays = new Date(2020, monthIndex, 0).getDate(); // Leap year, so 29 Feb is allowed
    return parseInt(day) <= maxDays;
  };

  const validateFormAndShowModal = async () => {
    const newBody = {
      rank: selectedRank || "",
      gender: selectedGender || "",
      fullname: fullNameRef.current?.value || "",
      homeaddress: homeAddressRef.current?.value || "",
      profession: professionRef.current?.value || "",
      mobile: mobileRef.current?.value || "",
      email: emailRef.current?.value || "",
      day: selectedDay || "",
      month: selectedMonth || "",
    };

    const errors: string[] = []; // Collect all error messages

    Object.entries(newBody).forEach(([key, value]) => {
      if (!value && key !== "email") errors.push(errorMessageMap[key as ErrorTypes]);
      if (key === "email" && value && !validateEmail(value)) errors.push(ERROR_EMAIL_INVALID);
    });

    if (selectedDay && selectedMonth && !validateDate(selectedDay, selectedMonth)) {
      errors.push("Invalid date combination");
    }

    if (!imageAssetLocal?.url) errors.push(ERROR_IMAGE_REQUIRED);

    if (errors.length > 0) {
      errors.forEach(msg => addAlert({ message: msg, type: "error" }));
      return;
    }

    setModal(true);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      // Reuse an already-uploaded photo if an earlier submit failed after uploading
      let photoId = imageAssetId;
      if (selectedFile && !photoId) {
        photoId = await uploadPhoto(selectedFile);
        setImageAssetId(photoId);
      }

      if (!photoId) {
        throw new Error(ERROR_IMAGE_REQUIRED);
      }

      // The server rejects duplicates (same phone + birthday) with a clear message
      await api("members", {
        method: "POST",
        body: {
          rank: selectedRank,
          fullName: fullNameRef.current?.value,
          mobile: mobileRef.current?.value,
          homeAddress: homeAddressRef.current?.value,
          email: emailRef.current?.value,
          profession: professionRef.current?.value,
          gender: selectedGender,
          day: selectedDay,
          month: selectedMonth,
          imageAssetId: photoId,
        },
      });

      addAlert({ message: SUCCESSFULLY_SUBMITTED, type: "success" });
      setResetForm(true);

    } catch (error: any) {
      addAlert({ message: error.message || "Submission failed", type: "error" });
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  const handleResetForm = () => {
    setImageAssetId(null);
    setImageAssetLocal(null);
    setSelectedFile(null);
    setSelectedRank(null);
    setSelectedGender(null);
    setSelectedDay(null);
    setSelectedMonth(null);
    setWrongImageType(false);
    setResetForm(false);
  };

  useEffect(() => {
    if (selectedGender === 'Male') setRankList(maleRankList);
    if (selectedGender === 'Female') setRankList(femaleRankList);
  }, [selectedGender])

  if (resetForm) {
    return (
      <div className="flex animate-rise flex-col items-center rounded-2xl bg-white px-6 py-12 text-center shadow-card">
        <PiCheckCircleDuotone className="text-6xl text-success" />
        <h2 className="mt-4 text-3xl font-semibold text-plum">You're registered</h2>
        <p className="mt-2 max-w-sm text-muted">Your details have been saved to the parish register. Thank you.</p>
        <Button title="Register another member" icon={<PiPlusBold />} variant="secondary" onPress={handleResetForm} className="mt-8" />
      </div>
    );
  }

  return (
    <div className="animate-rise">
      {modal && <Modal message="Submit your registration?" loading={loading} closeModal={handleCloseModal} onPress={onSubmit}/> }

      <p className="eyebrow">New member</p>
      <h1 className="mt-2 text-3xl font-semibold text-plum sm:text-4xl">Registration</h1>
      <p className="mt-2 text-muted">Start with your gender so we can show the right list of ranks.</p>

      <div className="mt-8 flex flex-col gap-8 rounded-2xl bg-white p-5 shadow-card sm:p-8">
        <Fieldset legend="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              title="Gender"
              icon={<PiGenderIntersexDuotone />}
              recordList={genderOptions}
              onChangeText={(value) => { setSelectedGender(value); setSelectedRank(null); }}
              placeholder="Select gender"
            />
            <SelectField
              title="Rank"
              icon={<PiMedalDuotone />}
              value={selectedRank}
              recordList={rankList}
              onChangeText={setSelectedRank}
              placeholder={selectedGender ? "Select your rank" : "Choose gender first"}
              disabled={!selectedGender}
            />
          </div>
          {selectedGender && (
            <InputField type="text" title="Full name" icon={<PiUserDuotone />} placeholder="As it should appear in the register" autoComplete="name" ref={fullNameRef} />
          )}
        </Fieldset>

        {selectedGender && (
          <>
            <Fieldset legend="Contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField type="tel" title="Phone number" icon={<PiPhoneDuotone />} placeholder="0803 000 0000" autoComplete="tel" ref={mobileRef} />
                <InputField type="email" title="Email (optional)" icon={<PiEnvelopeSimpleDuotone />} placeholder="you@example.com" autoComplete="email" ref={emailRef} />
              </div>
              <InputField type="text" title="Home address" icon={<PiHouseLineDuotone />} placeholder="Street, area, city" autoComplete="street-address" ref={homeAddressRef} />
              <InputField type="text" title="Profession / occupation" icon={<PiBriefcaseDuotone />} placeholder="e.g. Teacher" ref={professionRef} />
            </Fieldset>

            <Fieldset legend="Birthday">
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <SelectField title="Day" recordList={daysList} onChangeText={setSelectedDay} placeholder="Day" />
                <SelectField title="Month" recordList={monthsList} onChangeText={setSelectedMonth} placeholder="Month" />
              </div>
            </Fieldset>

            <PhotoUpload
              previewUrl={imageAssetLocal?.url}
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif"
              wrongType={wrongimageType}
              onSelect={uploadImage}
              onClear={clearImage}
            />
          </>
        )}

        <div className="flex justify-end border-t border-line pt-6">
          <Button title="Review & submit" onPress={validateFormAndShowModal} className="w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}

export const Fieldset = ({ legend, children }: { legend: string; children: React.ReactNode }) => (
  <fieldset className="flex flex-col gap-4">
    <legend className="mb-4 font-serif text-lg font-semibold text-ink">{legend}</legend>
    {children}
  </fieldset>
);
