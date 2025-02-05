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
import { formDetailSearchQuery } from "../utils/data";


type searchParams = {
  day: string,
  month: string,
  mobile: string,
}

export default function Create(): JSX.Element {
  const { addAlert } = useAlert();
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [imageAsset, setImageAsset] = useState<{ url: string, _id: string } | null>(null); // Define proper type
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

    const { name, type } = file;

    if (
      ["image/png", "image/jpg", "image/jpeg"].includes(type)
    ) {
      setWrongImageType(false);
      setImageLoading(true);

      client.assets
        .upload("image", file, { contentType: type, filename: name })
        .then((document) => {
          setImageAsset(document);
          setImageLoading(false);
        })
        .catch((error) => {
          console.log("Image upload error", error);
          setImageLoading(false);
        });
    } else {
      setWrongImageType(true);
    }
  };
  
  const onSubmit = async () => {
    setLoading(true); // Set loading to true at the start
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

    const errorMessages: string[] = []; // Collect all error messages

    Object.entries(newBody).forEach(([key, value]) => {
      if (!value) {
        const msg = errorMessageMap[key as ErrorTypes]; // Map the field to the error message
        if (msg) {
          errorMessages.push(msg); // Add the error message to the list
        }
      } else {
        if (key === "email") {
          if (!validateEmail(value)) {
            errorMessages.push(ERROR_EMAIL_INVALID);
          }
        }
      }
    });

    if (!imageAsset?._id) {
      errorMessages.push(ERROR_IMAGE_REQUIRED);
    }

    if (errorMessages.length > 0) {
      // Display all error messages as individual alerts
      errorMessages.forEach((message) => {
        addAlert({ message, type: "error" });
      });
      setLoading(false); // Reset loading state after showing errors
      return; // Stop execution
    }

    const { rank, fullname, gender, homeaddress, mobile, email, day, month } = newBody;
    const ifRecordExist = await fetchNewsBySearch({day, month, mobile})
    
    if (ifRecordExist) {
      setLoading(false);
      return addAlert({ message: 'Record with same detail already exist', type: "error" });
    }
    // If no errors, proceed to create the document
    try {
      const doc = {
        _type: "formDetail",
        rank,
        fullName: fullname,
        mobile,
        homeAddress: homeaddress,
        email,
        gender,
        day,
        month,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
      };

      // Attempt to create the document
      await client.create(doc);

      // Document successfully created
      setLoading(false); // Ensure loading is turned off
      setResetForm(true); // Ensure loading is turned off
      addAlert({ message: SUCCESSFULLY_SUBMITTED, type: "success" }); // Show success alert
    } catch (error) {
      // Handle errors during document creation
      console.error("Error creating document:", error);
      addAlert({
          message: "An error occurred while submitting the form. Please try again.",
          type: "error",
      });
      setLoading(false); // Ensure loading is turned off
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
    setSelectedRank(null);
    setSelectedGender(null);
    setSelectedDay(null);
    setSelectedMonth(null);
    setWrongImageType(false);
    setImageLoading(false);
    setResetForm(false);
  };

  const fetchNewsBySearch = async (searchParams : searchParams) =>{
    const query = formDetailSearchQuery(searchParams);
    let result : [] = [];
    await client.fetch(query)
    .then((data) => {
      if (data)
      result = data
    })
    return result?.length > 0 ? true : false;
  }

  useEffect(() => {
    if (selectedGender) {
      if(selectedGender === 'Male')
        return setRankList(maleRankList)
      
      if(selectedGender === 'Female')
        return setRankList(femaleRankList)
    }
  }, [selectedGender])
  
  return (
    <div className="flex flex-col items-center w-full gap-5">
      {!resetForm ?
          <div className="flex flex-col gap-5 items-center lg:w-2/3 w-full mb-10">
            <div className="flex w-full font-extrabold tracking-wide text-yellow text-[2rem] capitalize">
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
                {!imageAsset && !imageLoading && (
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
                {imageAsset && !imageLoading && (
                  <div className="relative h-full">
                    <img
                      src={imageAsset?.url}
                      alt="uploaded-pic"
                      className="h-full w-full"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-default text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setImageAsset(null)}
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
                <SelectField iconName="fi-sr-venus-double" recordList={genderList} onChangeText={(value) => setSelectedGender(value)} placeholder="Select Gender" />
              </div>
              {selectedGender && 
                <div className="flex flex-col w-full gap-1">
                  <div className='font-medium tracking-wide'>
                    What is your rank
                  </div>
                  <SelectField iconName="fi-sr-ranking-podium" recordList={rankList} onChangeText={(value) => setSelectedRank(value)} placeholder="Select your Rank" />
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
                <div className="grid grid-cols-2 w-full gap-3">
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
                    <SelectField className="w-1/3" iconName="fi-sr-calendar-clock" title="Day" recordList={daysList} onChangeText={(value) => setSelectedDay(value)} placeholder="Day" />
                    <SelectField className="w-2/3" iconName="fi-sr-calendar-clock" title="Month" recordList={monthsList} onChangeText={(value) => setSelectedMonth(value)} placeholder="Month" />
                  </div>
                </div>
              </div>
            }
            <Button title="Submit" loading={loading} onPress={onSubmit}/>
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
