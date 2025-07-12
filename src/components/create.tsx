import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Spinner from "../components/reuseables/spinner"; // Import your spinner component
import InputField from "./reuseables/Input/input";
import SelectField from "../components/reuseables/select";
import { daysList, errorMessageMap, ErrorTypes, femaleRankList, genderList, maleRankList, monthsList, SUCCESSFULLY_SUBMITTED } from "../constant";
import { client } from "../utils/client";
import Button from "./reuseables/Button/button";
import { useAlert } from "../utils/notification/alertcontext";
import { validateEmail } from "../utils/common";
import { ERROR_EMAIL_INVALID, ERROR_IMAGE_REQUIRED } from "../constant/errors";
import { formDetailSearchQueryByDayMonthAndMobile } from "../utils/data";
import Modal from "./reuseables/Modal/modal";

type SearchParams = {
  day: string,
  month: string,
  mobile: string,
}

export default function Create(): JSX.Element {
  const { addAlert } = useAlert();
  const [modal, setModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [imageAssetLocal, setImageAssetLocal] = useState<{ url: string} | null>(null); // Define proper type
  const [imageAsset, setImageAsset] = useState<{ url: string, _id: string } | null>(null); // Define proper type
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

    if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      setWrongImageType(false);
      setImageLoading(true);
      const previewURL = URL.createObjectURL(file);
      setImageAssetLocal({ url: previewURL });
      setSelectedFile(file);
      setImageLoading(false);
    } else {
      setWrongImageType(true);
    }
  };

  const validateDate = (day: string, month: string): boolean => {
    const monthIndex = monthsList.indexOf(month) + 1;
    const maxDays = new Date(2020, monthIndex, 0).getDate(); // Non-leap year
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
    let uploadedImageAsset = imageAsset;

    try {
      // Check for existing records
      const exists = await fetchMembersBySearch({
        day: selectedDay!,
        month: selectedMonth!,
        mobile: mobileRef.current!.value
      });

      if (exists) {
        setModal(false);
        setLoading(false);
        throw new Error("Record with same details already exists");
      }
      
      // Upload image if needed
      if (selectedFile && !uploadedImageAsset?._id) {
        const { name, type } = selectedFile;
        const document = await client.assets.upload("image", selectedFile, { 
          contentType: type, 
          filename: name 
        });
        uploadedImageAsset = document;
        setImageAsset(document);
      }

      // Final validation check
      if (!uploadedImageAsset?._id) {
        setModal(false);
        setLoading(false);
        throw new Error(ERROR_IMAGE_REQUIRED);
      }


      // Create document
      await client.create({
        _type: "formDetail",
        ...Object.fromEntries(
          Object.entries({
            rank: selectedRank,
            fullName: fullNameRef.current?.value,
            mobile: mobileRef.current?.value,
            homeAddress: homeAddressRef.current?.value,
            email: emailRef.current?.value,
            profession: professionRef.current?.value,
            gender: selectedGender,
            day: selectedDay,
            month: selectedMonth,
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: uploadedImageAsset._id }
            }
          }).filter(([_, v]) => v !== null && v !== undefined)
        )
      });

      // Success handling
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
    // Clear input fields
    if (fullNameRef.current) fullNameRef.current.value = "";
    if (homeAddressRef.current) homeAddressRef.current.value = "";
    if (mobileRef.current) mobileRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (professionRef.current) professionRef.current.value = "";

    // Reset state variables
    setImageAsset(null);
    setImageAssetLocal(null);
    setSelectedFile(null);
    setSelectedRank(null);
    setSelectedGender(null);
    setSelectedDay(null);
    setSelectedMonth(null);
    setWrongImageType(false);
    setImageLoading(false);
    setResetForm(false);
  };

  const fetchMembersBySearch = async (params: SearchParams): Promise<boolean> => {
    try {
      const data = await client.fetch(formDetailSearchQueryByDayMonthAndMobile(params));
      return data?.length > 0;
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (selectedGender) {
      if(selectedGender === 'Male')
        return setRankList(maleRankList)
      
      if(selectedGender === 'Female')
        return setRankList(femaleRankList)
    }
  }, [selectedGender])
  
  return (
    <div className="flex flex-col items-center relative w-full gap-5">
      {!resetForm ?
        <div className="flex flex-col relative gap-5 items-center lg:w-2/3 w-full mb-10">
          {modal && <Modal message="Are you sure you want to proceed" loading={loading} closeModal={(value) => handleCloseModal(value)} onPress={onSubmit}/> }
          <div className="flex w-full font-extrabold tracking-wide text-yellow lg:text-[2rem] text-2xl capitalize">
            Registration
          </div>
          <div className="flex flex-col w-full oswald-font">Please fill the form below</div>
          <div className="bg-secondary text-primary p-3 flex flex-0.7 w-full">
            <div className="flex justify-center items-center flex-col border-2 border-dotted p-3 w-full h-420">
              {imageLoading && <Spinner />}
              {wrongimageType && (
                <p className="text-red mb-5 text-xl transition-all duration-150 ease-in">
                  Wrong image type
                </p>
              )}
              {!imageAssetLocal && !imageLoading && (
                <label>
                  <div className="flex flex-col cursor-pointer items-center justify-items-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-lg">Click to upload</p>
                    </div>
                    <p className="mt-32 text-center text-gray-400">
                      Use high-quality JPG, SVG, PNG, GIF less than 20 MB 
                    </p>
                    <p className="text-center text-gray-400 font-bold">
                      Please upload only garment picture
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              )}
              {imageAssetLocal && !imageLoading && (
                <div className="relative h-full">
                  <img
                    src={imageAssetLocal?.url}
                    alt="uploaded-pic"
                    className="h-full w-full"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-default text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAssetLocal(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={`${selectedGender ? 'lg:grid-cols-2' : ''} grid  w-full gap-3`}>
            <div className="flex flex-col w-full gap-1">
              <div className='font-medium tracking-wide'>
                Gender
              </div>
              <SelectField iconName="fi-sr-venus-double" recordList={genderList} onChangeText={(value) => setSelectedGender(value)} placeholder="Select gender" />
            </div>
            {selectedGender && 
              <div className="flex flex-col w-full gap-1">
                <div className='font-medium tracking-wide'>
                  What is your rank
                </div>
                <SelectField iconName="fi-sr-ranking-podium" recordList={rankList} onChangeText={(value) => setSelectedRank(value)} placeholder="Select your rank" />
              </div>
            }
          </div>
          {selectedGender && 
            <div className="flex flex-col gap-5 w-full">
              <InputField
                type="text"
                title="Full Name"
                iconName="fi-ss-user"
                placeholder="Enter your full name"
                ref={fullNameRef}
              />
              <div className="grid lg:grid-cols-2 w-full gap-3">
                <InputField
                  type="email"
                  title="Email Address"
                  iconName="fi-sr-envelopes"
                  placeholder="Enter your email"
                  ref={emailRef}
                />
                <InputField
                  type="tel"
                  title="Phone Number"
                  iconName="fi-sr-phone-call"
                  placeholder="Enter your phone no."
                  ref={mobileRef}
                />
              </div>
              <InputField
                type="text"
                title="Profession/Occupation"
                iconName="fi-sr-briefcase"
                placeholder="Enter your profession/occupation"
                ref={professionRef}
              />
              <InputField
                type="text"
                title="Home Address"
                iconName="fi-sr-address-book"
                placeholder="Enter your home address"
                ref={homeAddressRef}
              />
              <div className="flex flex-col w-full gap-1">
                <div className='font-medium tracking-wide'>
                  Date of Birth
                </div>
                <div className="flex flex-row w-full gap-3">
                  <SelectField className="lg:w-1/3 w-1/2" iconName="fi-sr-calendar-clock" title="Day" recordList={daysList} onChangeText={(value) => setSelectedDay(value)} placeholder="Day" />
                  <SelectField className="lg:w-2/3 w-1/2" iconName="fi-sr-calendar-clock" title="Month" recordList={monthsList} onChangeText={(value) => setSelectedMonth(value)} placeholder="Month" />
                </div>
              </div>
            </div>
          }
          <Button title="Submit" onPress={validateFormAndShowModal}/>
        </div> :
        <div className="bg-secondary flex flex-col gap-2 w-full lg:p-10 p-3 text-primary items-center">
          <div className="font-semibold text-[2rem] w-full text-center">Thanks for filling the form</div>
          <div className="">Your Information has been Saved</div>
          <div onClick={handleResetForm} className="bg-primary p-2 px-3 rounded-lg text-white text-sm cursor-pointer font-medium">
            <i className="fi fi-sr-plus pr-2 text-[.7rem]" />
            Add Another Record
          </div>
        </div>
      }
    </div>
  );
}
