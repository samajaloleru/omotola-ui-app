import React, { useEffect, useState, useCallback } from "react";

import logo from "../assets/images/logo.png";
import omotolaLogo from "../assets/images/omotola_logo.png";
import { client } from "../utils/client";
import { fetchMember, memberSearchQueryByMonth } from "../utils/data";
import { MemberInfo } from "../utils/interface";
import SelectField from "../components/reuseables/select";
import { monthsList } from "../constant";
import Spinner from "../components/reuseables/spinner";
import ViewMember from "../components/reuseables/view-member";

const Members: React.FC = () => {
  const [viewAble, setViewAble] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [memberList, setMemberlist] = useState<MemberInfo[]>([] as MemberInfo[]);
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);

  const handleCloseModal = (value: boolean) => {
    setViewAble(value);
    setSelectedMember(null);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await client.fetch(fetchMember());
      const isDataEmpty = data.length === 0;
      setIsEmpty(isDataEmpty);
      setMemberlist(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsEmpty(true);
      setMemberlist([]);
      setLoading(false);
    }
  }, []); // Stable dependencies (setters) don't cause re-renders

  const fetchMembersBySearch = useCallback(async (month: string) => {
    setLoading(true);
    try {
      const data = await client.fetch(memberSearchQueryByMonth(month));
      const isDataEmpty = data.length === 0;
      setMemberlist(data);
      setIsEmpty(isDataEmpty);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setMemberlist([]);
      setIsEmpty(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty && memberList.length === 0) {
      fetchMembers();
    }
  }, [memberList, isEmpty, fetchMembers]); // Include fetchMembers in dependencies

  return (
    <div className="flex flex-col lg:justify-center items-center w-11/12 h-full overflow-auto lg:p-10 text-primary  rounded-xl">
      {viewAble && selectedMember && <ViewMember member={selectedMember} closeModal={(value) => handleCloseModal(value)} />}
      <div className="flex flex-col items-center lg:w-3/5 w-full lg:p-10 gap-5">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="fr-ns right-0-ns">
            <img className="h-20" src={logo} alt="Logo" />
          </div>
          <div className="fr-ns right-0-ns">
            <img className="h-28" src={omotolaLogo} alt="Logo" />
          </div>
        </div>
        <div className="flex flex-col w-full bg-white p-4">
          <div className="flex md:flex-row flex-col w-full justify-between md:items-center mb-10">
            <div className="flex font-extrabold tracking-wide text-yellow lg:text-[2rem] text-2xl capitalize">
              Members List : <span className="bg-light-green px-3 ml-6">{memberList.length}</span>
            </div>
            {selectedMonth && <span onClick={() => { fetchMembers(); setSelectedMonth(null) }} className="bg-secondary p-3 w-auto cursor-pointer">clear filter</span>}
            <SelectField className="lg:w-1/3 w-full text-xs p-2" iconName="fi-sr-calendar-clock" title="Filter by Month" value={selectedMonth} recordList={monthsList} onChangeText={(value) => { setSelectedMonth(value); fetchMembersBySearch(value) }} placeholder="Month" />
          </div>
          <div className="grid grid-cols-4 w-full gap-3 border-b border-primary font-semibold text-lg pb-3">
            <div className="">Rank</div>
            <div className="col-span-2">FullName</div>
            <div className="">Date of Birth</div>
          </div>
          <div className="max-h-[20rem] w-full overflow-auto">
            {loading && <Spinner />}
            {!loading && isEmpty && <div className="w-full flex flex-col gap-5 py-10 text-center">
              <div className="">
                No records found
              </div>
              <span onClick={fetchMembers} className={`${!selectedMonth ? 'hidden' : ''} bg-secondary p-3 w-auto cursor-pointer`}>Reset Filter</span>
            </div>}
            {!loading && memberList && memberList.map((member) => (
              <div className="flex flex-col w-full gap-1 border-b border-primary py-3" key={member._id}>
                <div className="grid grid-cols-4 w-full gap-3">
                  <div className="">{member.rank}</div>
                  <div className="col-span-2">{member.fullName}</div>
                  <div className="">{member.day} of {member.month}</div>
                </div>
                <div className="w-full flex flex-row justify-end">
                  <div className="text-xs italic pr-3 cursor-pointer hover:bg-secondary" onClick={() => { setSelectedMember(member); setViewAble(true); }}>Click to view</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;