import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Spinner from "../reuseables/spinner"; // Import your spinner component
import logo from "../../assets/images/logo.png";
import InputField from "../reuseables/input";
import SelectField from "../reuseables/select";
import { daysList, errorMessageMap, ErrorTypes, monthsList, SUCCESSFULLY_SUBMITTED } from "../../constant";
import { client } from "../../utils/client";
import Button from "../reuseables/button";
import { useAlert } from "../../utils/notification/alertcontext";
import { validateEmail } from "../../utils/common";
import { ERROR_EMAIL_INVALID, ERROR_IMAGE_REQUIRED } from "../../constant/errors";

export default function Home(): JSX.Element {
  const { addAlert } = useAlert();
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [imageAsset, setImageAsset] = useState<{ url: string, _id: string } | null>(null); // Define proper type
  const [wrongimageType, setWrongImageType] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const rankRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
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
        rank: rankRef.current?.value || "",
        fullname: fullNameRef.current?.value || "",
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

    // If no errors, proceed to create the document
    try {
        const { rank, fullname, mobile, email, day, month } = newBody;
        const doc = {
            _type: "formDetail",
            rank,
            fullName: fullname,
            mobile,
            email,
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
    if (rankRef.current) rankRef.current.value = "";
    if (fullNameRef.current) fullNameRef.current.value = "";
    if (mobileRef.current) mobileRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";

    // Reset state variables
    setImageAsset(null);
    setSelectedDay(null);
    setSelectedMonth(null);
    setWrongImageType(false);
    setImageLoading(false);
    setResetForm(false);
  };


  return (
    <div className={`${resetForm ? 'justify-center' : ''} flex flex-col items-center lg:w-11/12 h-screen overflow-auto z-30 text-white`} >
      {!resetForm ?
        <div className="flex flex-col items-center lg:w-2/5 lg:p-10 p-3 gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <Link
              to="/games"
              className="fl mt3 no-underline oswald-font hover:bg-secondary hover:text-primary w-auto p-3 font-semibold br2"
            >
              Play Games
            </Link>
            <div className="fr-ns right-0-ns">
              <img className="h-20" src={logo} alt="Logo" />
            </div>
          </div>
          <div className="flex w-full font-extrabold tracking-wide text-yellow text-[2rem] justify-center capitalize">
            C.C.C Omotola Cathedral Member Registration
          </div>

          <div className="flex flex-col gap-5 items-center lg:w-2/3 w-full mb-10">
            <div className="flex flex-col w-full oswald-font">Please fill the form below</div>
            <div className="bg-secondary text-primary p-3 flex flex-0.7 w-full">
              <div className="flex justify-center items-center flex-col border-2 border-dotted p-3 w-full h-420">
                {imageLoading && <Spinner />}
                {wrongimageType && (
                  <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
                    Wrong image type
                  </p>
                )}
                {!imageAsset ? (
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
                ) : (
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
            <InputField
              type="text"
              title="What is your rank"
              iconName="fi-sr-ranking-podium"
              placeholder="What is your rank? (e.g Cape. Eld.)"
              ref={rankRef}
            />
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
            <div className="flex flex-col w-full gap-1">
              <div className='font-medium tracking-wide'>
                Date of Birth
              </div>
              <div className="flex flex-row w-full gap-3">
                <SelectField className="w-1/3" iconName="fi-sr-calendar-clock" title="Day" recordList={daysList} onChangeText={(value) => setSelectedDay(value)} placeholder="Day" />
                <SelectField className="w-2/3" iconName="fi-sr-calendar-clock" title="Month" recordList={monthsList} onChangeText={(value) => setSelectedMonth(value)} placeholder="Month" />
              </div>
            </div>
            <Button title="Submit" loading={loading} onPress={onSubmit}/>
          </div>
        </div> :
        <div className="bg-secondary flex flex-col gap-2 lg:w-2/5 lg:p-10 p-3 text-primary items-center">
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
