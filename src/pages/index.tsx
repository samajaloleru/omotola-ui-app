import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import omotolaLogo from "../assets/images/omotola_logo.png";
import Button from "../components/reuseables/Button/button";
import Create from "../components/create";
import Update from "../components/update";


export default function Home(): JSX.Element {
  const [viewMode, setViewMode] = useState<"home" | "create" | "update">("home");
 
  return (
    <div className={`flex flex-col items-center w-11/12 z-30 text-white pt-10`} >
        <div className="flex flex-col items-center lg:w-3/5 w-full lg:p-10 gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="fr-ns right-0-ns">
              <img className="h-20" src={logo} alt="Logo" />
            </div>
            <div className="fr-ns right-0-ns">
              <img className="h-28" src={omotolaLogo} alt="Logo" />
            </div>
          </div>
          {viewMode === 'home' &&
            <div className="w-full flex flex-col gap-5">
              <div className="flex w-full font-extrabold tracking-wide text-[2rem] justify-center capitalize">
                Welcome To C.C.C. Omotola Cathedral Member Portal
              </div>
              <div className="w-full flex flex-row gap-5">
                <Button title="Create" onPress={() => setViewMode('create')}/>
                <Button title="Update" onPress={() => setViewMode('update')}/>
              </div>
              <div className="">
                To add a new member, click the "Create" button. To update the information for an existing member, click the "Update" button.
              </div>
            </div>
          }
          {viewMode === 'create' &&
            <div className="w-full flex flex-col gap-5 h-full overflow-auto">
              <div className="lg:w-1/3 w-1/4">
                <Button title="Cancel" onPress={() => setViewMode('home')}/>
              </div>
              <Create/>
            </div>
          }
          {viewMode === 'update' &&
            <div className="w-full flex flex-col gap-5">
              <div className="lg:w-1/3 w-1/4">
                <Button title="Cancel" onPress={() => setViewMode('home')}/>
              </div>
              <Update/>
            </div>
          }
        </div>      
    </div>
  );
}
