import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Spinner from "../components/reuseables/spinner"; // Import your spinner component
import InputField from "./reuseables/Input/input";
import SelectField from "../components/reuseables/select";
import { daysList, errorMessageMap, ErrorTypes, femaleRankList, genderList, maleRankList, monthsList, SUCCESSFULLY_UPDATED } from "../constant";
import { client } from "../utils/client";
import Button from "./reuseables/Button/button";
import { useAlert } from "../utils/notification/alertcontext";
import { validateEmail } from "../utils/common";
import { ERROR_EMAIL_INVALID, ERROR_IMAGE_REQUIRED } from "../constant/errors";
import { formDetailSearchQuery } from "../utils/data";
import { MemberInfo } from "../utils/interface";
import Modal from "./reuseables/Modal/modal";


export default function Update(): JSX.Element {
  const { addAlert } = useAlert();
  const [modal, setModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formDetail, setFormDetail] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(false);
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
    
    // if (!imageAssetLocal?.url) errors.push(ERROR_IMAGE_REQUIRED);

    if (errors.length > 0) {
      errors.forEach(msg => addAlert({ message: msg, type: "error" }));
      return;
    }

    setModal(true);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!formDetail?._id) {
        throw new Error("No document ID found for update");
      }

      let uploadedImageAsset = imageAsset;

      // Upload new image only if a file was selected
      if (selectedFile) {
        const { name, type } = selectedFile;
        uploadedImageAsset = await client.assets.upload("image", selectedFile, {
          contentType: type,
          filename: name,
        });
        setImageAsset(uploadedImageAsset);
      }

      // Prepare base update payload
      const updatePayload: Record<string, any> = {
        rank: selectedRank,
        fullName: fullNameRef.current?.value,
        homeAddress: homeAddressRef.current?.value,
        email: emailRef.current?.value?.trim(),
        day: selectedDay,
        month: selectedMonth,
      };

      // Only add image field if new image was uploaded
      if (imageAssetLocal?.url) {
        // Validate image reference
        if (!uploadedImageAsset?._id) {
          throw new Error(ERROR_IMAGE_REQUIRED);
        }
        
        updatePayload.image = {
          _type: "image",
          asset: { 
            _type: "reference", 
            _ref: uploadedImageAsset._id 
          }
        };
      }

      // Clean undefined/null values
      const cleanPayload = Object.fromEntries(
        Object.entries(updatePayload).filter(([_, v]) => v !== null && v !== undefined)
      );

      // Execute update
      const updatedDoc = await client
        .patch(formDetail._id)
        .set(cleanPayload)
        .commit();

      // Handle success
      addAlert({ message: SUCCESSFULLY_UPDATED, type: "success" });
      handleResetForm();
      setModal(false);

    } catch (error: any) {
      addAlert({
        message: error.message || "Failed to update record. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetForm = () => {
    // Clear input fields
    if (fullNameRef.current) fullNameRef.current.value = "";
    if (homeAddressRef.current) homeAddressRef.current.value = "";
    if (mobileRef.current) mobileRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";

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
    setFormDetail(null);
  };

  const verifyMember = async () =>{
    setLoading(true);
    const newBody = {
      mobile: mobileRef.current?.value || "",
      day: selectedDay || "",
      month: selectedMonth || "",
    };

    const errorMessages: string[] = []; // Collect all error messages

    Object.entries(newBody).forEach(([key, value]) => {
      if (!value) {
          const msg = errorMessageMap[key as ErrorTypes]; // Map the field to the error message
          if (msg) {
              errorMessages.push(msg); // Add the error message to the list
          }
      }
    });

    if (errorMessages.length > 0) {
      // Display all error messages as individual alerts
      errorMessages.forEach((message) => {
        addAlert({ message, type: "error" });
      });
      setLoading(false); // Reset loading state after showing errors
      return; // Stop execution
    }

    try {
      const query = formDetailSearchQuery(newBody);
      await client.fetch(query)
      .then((data) => {
        if (data[0]){
          setFormDetail(data[0])
          addAlert({ message: 'Your record have been verified sucessfully', type: "success" });
        }else {
          addAlert({ message: 'No record found for the information you provided', type: "error" });
        }
      })
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error verifying the record:", error);
      addAlert({
          message: "An error occurred while verifying your record. Please try again.",
          type: "error",
      });
    }
  }

  useEffect(() => {
    if (formDetail) {
      fullNameRef.current && (fullNameRef.current.value = formDetail.fullName || "");
      emailRef.current && (emailRef.current.value = formDetail.email || "");
      mobileRef.current && (mobileRef.current.value = formDetail.mobile || "");
      homeAddressRef.current && (homeAddressRef.current.value = formDetail.homeAddress || "");
      
      if (formDetail.gender) setSelectedGender(formDetail.gender);
      if (formDetail.rank) setSelectedRank(formDetail.rank);
      if (formDetail.day) setSelectedDay(formDetail.day);
      if (formDetail.month) setSelectedMonth(formDetail.month);
    }
  }, [formDetail]);
  
  useEffect(() => {
    if (selectedGender) {
      // setSelectedRank(null)
      if(selectedGender === 'Male')
        return setRankList(maleRankList)
      
      if(selectedGender === 'Female')
        return setRankList(femaleRankList)
    }
  }, [selectedGender])
  
  return (
    <div className="flex flex-col items-center w-full gap-5">
      {!formDetail &&
        <div className="flex flex-col gap-5 items-center lg:w-2/3 w-full mb-10">
          <div className="flex w-full font-extrabold tracking-wide text-yellow lg:text-[2rem] text-2xl capitalize">
            Verify Your Details
          </div>
          <div className="flex flex-col w-full oswald-font">Please fill the form below to verify your account</div>
          <div className="flex flex-col w-full gap-1">
            <div className='font-medium tracking-wide'>
              Date of Birth
            </div>
            <div className="flex flex-row w-full gap-3 mb-4">
              <SelectField className="lg:w-1/3 w-1/2" iconName="fi-sr-calendar-clock" title="Day" recordList={daysList} onChangeText={(value) => setSelectedDay(value)} placeholder="Day" />
              <SelectField className="lg:w-2/3 w-1/2" iconName="fi-sr-calendar-clock" title="Month" recordList={monthsList} onChangeText={(value) => setSelectedMonth(value)} placeholder="Month" />
            </div>
            <InputField
              type="tel"
              title="Phone Number"
              iconName="fi-sr-phone-call"
              placeholder="Enter your phone no."
              ref={mobileRef}
            />
          </div>
          
          <Button title="Verify me" loading={loading} onPress={verifyMember}/>
        </div> 
      }
      {formDetail && <div className="bg-white flex flex-col gap-2 w-full lg:p-10 p-3 text-primary items-center mb-10 relative">
        {modal && <Modal message="Are you sure you want to proceed" loading={loading} closeModal={(value) => handleCloseModal(value)} onPress={onSubmit}/> }
        <div className="bg-secondary text-primary mb-5 p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted p-3 w-full h-420">
            {imageLoading && <Spinner />}
            {wrongimageType && (
              <p className="text-red mb-5 text-xl transition-all duration-150 ease-in">
                Wrong image type
              </p>
            )}
            {!imageAssetLocal && !imageLoading && (
              <label>
                <div className="relative">
                  <img
                    // src={formDetail?.image && urlFor(pinDetail.image).url()}
                    src={formDetail?.imageUrl}
                    alt="uploaded-pic"
                    className="w-full"
                  />
                  <div
                    className="absolute bottom-[-2rem] mx-auto  p-3 bg-default text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  >
                    <div className="flex flex-col cursor-pointer text-sm items-center justify-items-center h-full">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-2xl">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-lg">Click to update</p>
                      </div>
                      <p className="mt-2 text-center">
                        Use high-quality JPG, SVG, PNG, GIF less than 20 MB 
                      </p>
                      <p className="text-center font-bold">
                        Please upload only garment picture
                      </p>
                    </div>
                  </div>
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
        <div className="grid lg:grid-cols-2 w-full gap-3">
          <div className="flex flex-col w-full gap-1">
            <div className='font-medium tracking-wide'>
              Gender
            </div>
            <SelectField iconName="fi-sr-venus-double" disabled={true} recordList={genderList} value={selectedGender} onChangeText={(value) => setSelectedGender(value)} placeholder="Select Gender" />
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className='font-medium tracking-wide'>
              What is your rank
            </div>
            <SelectField iconName="fi-sr-ranking-podium" recordList={rankList} value={selectedRank} onChangeText={(value) => setSelectedRank(value)} placeholder="Select your Rank" />
          </div>
        </div>
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
            placeholder="Enter your Email"
            ref={emailRef}
          />
          <InputField
            type="tel"
            title="Phone Number"
            readonly
            iconName="fi-sr-phone-call"
            placeholder="Enter your phone no."
            ref={mobileRef}
          />
        </div>
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
            <SelectField className="lg:w-1/3 w-1/2" iconName="fi-sr-calendar-clock" title="Day" value={selectedDay} recordList={daysList} onChangeText={(value) => setSelectedDay(value)} placeholder="Day" />
            <SelectField className="lg:w-2/3 w-1/2" iconName="fi-sr-calendar-clock" title="Month" value={selectedMonth} recordList={monthsList} onChangeText={(value) => setSelectedMonth(value)} placeholder="Month" />
          </div>
        </div>
          
        <Button title="Submit" onPress={validateFormAndShowModal}/>
        <div onClick={handleResetForm} className="bg-primary py-3 mt-3 w-full text-center rounded-lg text-white text-sm cursor-pointer font-medium">
          <i className="fi fi-sr-refresh pr-2 text-[.7rem]" />
          Update Another Record
        </div>
    </div>}
    </div>
  );
}
