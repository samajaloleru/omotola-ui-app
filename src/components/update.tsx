import React, { useEffect, useRef, useState } from "react";
import {
  PiUserDuotone, PiEnvelopeSimpleDuotone, PiPhoneDuotone, PiBriefcaseDuotone,
  PiHouseLineDuotone, PiGenderIntersexDuotone, PiMedalDuotone, PiArrowsClockwiseBold, PiShieldCheckDuotone,
} from "react-icons/pi";
import InputField from "./reuseables/Input/input";
import SelectField from "../components/reuseables/select";
import PhotoUpload from "./reuseables/photo-upload";
import { daysList, errorMessageMap, ErrorTypes, femaleRankList, genderOptions, maleRankList, monthsList, SUCCESSFULLY_UPDATED } from "../constant";
import { api, ApiError, uploadPhoto } from "../utils/api";
import Button from "./reuseables/Button/button";
import { useAlert } from "../utils/notification/alertcontext";
import { validateEmail } from "../utils/common";
import { ERROR_EMAIL_INVALID } from "../constant/errors";
import { MemberInfo } from "../utils/interface";
import Modal from "./reuseables/Modal/modal";
import { Fieldset } from "./create";


export default function Update(): JSX.Element {
  const { addAlert } = useAlert();
  const [modal, setModal] = useState(false);
  const [member, setFormDetail] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageAssetLocal, setImageAssetLocal] = useState<{ url: string} | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);
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

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      setWrongImageType(false);
      setImageAssetLocal({ url: URL.createObjectURL(file) });
      setSelectedFile(file);
    } else {
      setWrongImageType(true);
    }
  };

  const clearImage = () => {
    setImageAssetLocal(null);
    setSelectedFile(null);
  };

  const validateDate = (day: string, month: string): boolean => {
    const monthIndex = monthsList.indexOf(month) + 1;
    const maxDays = new Date(2020, monthIndex, 0).getDate(); // Leap year, so 29 Feb is allowed
    return parseInt(day) <= maxDays;
  };

  const handleCloseModal = (value: boolean) => {
    setModal(value);
    if (!value) setLoading(false); // Reset loading state when modal closes
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

    if (errors.length > 0) {
      errors.forEach(msg => addAlert({ message: msg, type: "error" }));
      return;
    }

    setModal(true);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!member?._id) {
        throw new Error("No document ID found for update");
      }

      // Upload new image only if a file was selected
      const imageAssetId = selectedFile ? await uploadPhoto(selectedFile) : undefined;

      await api(`members/${member._id}`, {
        method: "PATCH",
        token: editToken,
        body: {
          rank: selectedRank,
          fullName: fullNameRef.current?.value,
          homeAddress: homeAddressRef.current?.value,
          profession: professionRef.current?.value,
          email: emailRef.current?.value?.trim(),
          day: selectedDay,
          month: selectedMonth,
          imageAssetId,
        },
      });

      addAlert({ message: SUCCESSFULLY_UPDATED, type: "success" });
      handleResetForm();
      setModal(false);

    } catch (error: any) {
      if (error instanceof ApiError && error.status === 401) {
        setModal(false);
        handleResetForm();
      }
      addAlert({
        message: error.message || "Failed to update record. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setEditToken(null);
    setImageAssetLocal(null);
    setSelectedFile(null);
    setSelectedRank(null);
    setSelectedGender(null);
    setSelectedDay(null);
    setSelectedMonth(null);
    setWrongImageType(false);
    setFormDetail(null);
  };

  const verifyMember = async () =>{
    const newBody = {
      mobile: mobileRef.current?.value || "",
      day: selectedDay || "",
      month: selectedMonth || "",
    };

    const errorMessages = Object.entries(newBody)
      .filter(([, value]) => !value)
      .map(([key]) => errorMessageMap[key as ErrorTypes])
      .filter(Boolean);

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => addAlert({ message, type: "error" }));
      return;
    }

    setLoading(true);
    try {
      const data = await api<{ member: MemberInfo; editToken: string }>("members/verify", { method: "POST", body: newBody });
      setEditToken(data.editToken);
      setFormDetail(data.member);
      addAlert({ message: "We found your record. You can now update it.", type: "success" });
    } catch (error: any) {
      addAlert({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (member) {
      fullNameRef.current && (fullNameRef.current.value = member.fullName || "");
      emailRef.current && (emailRef.current.value = member.email || "");
      mobileRef.current && (mobileRef.current.value = member.mobile || "");
      homeAddressRef.current && (homeAddressRef.current.value = member.homeAddress || "");
      professionRef.current && (professionRef.current.value = member.profession || "");

      if (member.gender) setSelectedGender(member.gender);
      if (member.rank) setSelectedRank(member.rank);
      if (member.day) setSelectedDay(member.day);
      if (member.month) setSelectedMonth(member.month);
    }
  }, [member]);

  useEffect(() => {
    if (selectedGender === 'Male') setRankList(maleRankList);
    if (selectedGender === 'Female') setRankList(femaleRankList);
  }, [selectedGender])

  if (!member) {
    return (
      <div className="animate-rise">
        <p className="eyebrow">Existing member</p>
        <h1 className="mt-2 text-3xl font-semibold text-plum sm:text-4xl">Find your record</h1>
        <p className="mt-2 text-muted">Enter the birthday and phone number you registered with.</p>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card sm:p-8">
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <SelectField title="Day of birth" recordList={daysList} onChangeText={setSelectedDay} placeholder="Day" />
            <SelectField title="Month of birth" recordList={monthsList} onChangeText={setSelectedMonth} placeholder="Month" />
          </div>
          <InputField
            type="tel"
            title="Phone number"
            icon={<PiPhoneDuotone />}
            placeholder="0803 000 0000"
            autoComplete="tel"
            ref={mobileRef}
            onKeyDown={(e) => e.key === "Enter" && verifyMember()}
          />
          <div className="flex justify-end border-t border-line pt-6">
            <Button title="Find my record" icon={<PiShieldCheckDuotone />} loading={loading} onPress={verifyMember} className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      {modal && <Modal message="Save these changes?" loading={loading} closeModal={handleCloseModal} onPress={onSubmit}/> }

      <p className="eyebrow">Existing member</p>
      <h1 className="mt-2 text-3xl font-semibold text-plum sm:text-4xl">Update your details</h1>
      <p className="mt-2 text-muted">Change anything that's out of date, then save.</p>

      <div className="mt-8 flex flex-col gap-8 rounded-2xl bg-white p-5 shadow-card sm:p-8">
        <PhotoUpload
          previewUrl={imageAssetLocal?.url}
          existingUrl={member.imageUrl}
          accept="image/png, image/jpeg, image/jpg"
          wrongType={wrongimageType}
          onSelect={uploadImage}
          onClear={clearImage}
        />

        <Fieldset legend="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField title="Gender" icon={<PiGenderIntersexDuotone />} disabled recordList={genderOptions} value={selectedGender} placeholder="Gender" />
            <SelectField title="Rank" icon={<PiMedalDuotone />} recordList={rankList} value={selectedRank} onChangeText={setSelectedRank} placeholder="Select your rank" />
          </div>
          <InputField type="text" title="Full name" icon={<PiUserDuotone />} placeholder="Your full name" autoComplete="name" ref={fullNameRef} />
        </Fieldset>

        <Fieldset legend="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField type="tel" title="Phone number" readonly icon={<PiPhoneDuotone />} ref={mobileRef} />
            <InputField type="email" title="Email (optional)" icon={<PiEnvelopeSimpleDuotone />} placeholder="you@example.com" autoComplete="email" ref={emailRef} />
          </div>
          <InputField type="text" title="Home address" icon={<PiHouseLineDuotone />} placeholder="Street, area, city" autoComplete="street-address" ref={homeAddressRef} />
          <InputField type="text" title="Profession / occupation" icon={<PiBriefcaseDuotone />} placeholder="e.g. Teacher" ref={professionRef} />
        </Fieldset>

        <Fieldset legend="Birthday">
          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <SelectField title="Day" value={selectedDay} recordList={daysList} onChangeText={setSelectedDay} placeholder="Day" />
            <SelectField title="Month" value={selectedMonth} recordList={monthsList} onChangeText={setSelectedMonth} placeholder="Month" />
          </div>
        </Fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <Button title="Look up someone else" icon={<PiArrowsClockwiseBold />} variant="ghost" onPress={handleResetForm} />
          <Button title="Review & save" onPress={validateFormAndShowModal} />
        </div>
      </div>
    </div>
  );
}
