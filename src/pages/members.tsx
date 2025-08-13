import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiX, FiFilter, FiUser, FiRefreshCw, FiSearch } from "react-icons/fi";

import logo from "../assets/images/logo.png";
import omotolaLogo from "../assets/images/omotola_logo.png";
import { client } from "../utils/client";
import { fetchMember } from "../utils/data";
import { MemberInfo } from "../utils/interface";
import SelectField from "../components/reuseables/select";
import { monthsList, genderOptions } from "../constant";
import Spinner from "../components/reuseables/spinner";
import ViewMember from "../components/reuseables/view-member";
import Pagination from "../components/reuseables/pagination";
import InputField from "../components/reuseables/Input/input";

const Members: React.FC = () => {
  const [viewAble, setViewAble] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [totalMember, setTotalMember] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    month: '',
    gender: '',
    name: ''
  });
  
  const [tempName, setTempName] = useState(''); // Temporary name for debounce
  const [memberList, setMemberlist] = useState<MemberInfo[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);
  
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCloseModal = (value: boolean) => {
    setViewAble(value);
    setSelectedMember(null);
  };

  // Consolidated fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [data, count] = await Promise.all([
        client.fetch(fetchMember(searchParams)),
        client.fetch(`count(*[_type == "member" ${buildFilterQuery()}])`)
      ]);
      
      setIsEmpty(data.length === 0);
      setMemberlist(data);
      setTotalMember(count);
      setTotalPage(Math.ceil(count / searchParams.pageSize));
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsEmpty(true);
      setMemberlist([]);
      setLoading(false);
    }
  }, [searchParams]);

  // Build filter query based on searchParams
  const buildFilterQuery = () => {
    const filters = [];
    if (searchParams.month) filters.push(`month == "${searchParams.month}"`);
    if (searchParams.gender) filters.push(`gender == "${searchParams.gender}"`);
    if (searchParams.name) filters.push(`fullName match "${searchParams.name}*"`);
    
    return filters.length > 0 ? `&& (${filters.join(' && ')})` : '';
  };

  // Fetch data whenever searchParams change
  useEffect(() => {
    fetchData();
  }, [searchParams, fetchData]);

  // Handler for pagination
  const onPageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }

  // Handler for page size change
  const onPageSizeChange = (pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageSize, page: 1 }));
  }

  // Handler for filter changes
  const handleFilterChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value, page: 1 }));
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      page: 1,
      pageSize: 10,
      month: '',
      gender: '',
      name: ''
    });
    setTempName('');
  }

  // Debounced name search handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempName(value);
    
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      handleFilterChange('name', value);
    }, 500); // 500ms debounce
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full overflow-auto p-4 md:p-8 text-primary">
      {viewAble && selectedMember && (
        <ViewMember member={selectedMember} closeModal={(value) => handleCloseModal(value)} />
      )}
      
      <div className="flex flex-col items-center w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-visible md:overflow-hidden">
        {/* Header Section */}
        <div className="w-full bg-gradient-to-l from-primary to-[#e67238] p-4 flex flex-wrap justify-around md:justify-between items-center">
          <div className="flex items-center space-x-4">
            <img className="h-12 md:h-16" src={logo} alt="Logo" />
            <h1 className="text-xl md:text-2xl font-bold text-white">Members Directory</h1>
          </div>
          <div className="flex items-center mb-4 md:mb-0">
            <FiUser className="text-white mr-2" />
            <h2 className="text-lg font-semibold mr-2">
              {/* Total Members:  */}
              <span className="ml-2 bg-primary text-white px-3 py-1 rounded-full">
                {totalMember}
              </span>
            </h2>
            <img className="h-16 md:h-20" src={omotolaLogo} alt="Omotola Logo" />
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full p-4 bg-gray-50 border-b flex flex-col">
          <div className="flex md:flex-row flex-col justify-between items-center mb-4">
            
            
            <button 
              onClick={clearFilters}
              className="md:flex hidden items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition"
            >
              <FiX className="mr-1" /> Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Name Search - Fixed to use tempName */}
            <InputField
              type="text"
              iconName="fi-sr-search"
              placeholder="Search by name..."
              value={tempName}
              onChange={handleNameChange}
            />
            
            {/* Gender Filter */}
            <SelectField 
              iconName="fi-sr-venus-double"
              value={searchParams.gender}
              recordList={genderOptions}
              onChangeText={(value) => handleFilterChange('gender', value)}
              placeholder="Filter by Gender"
            />
            
            {/* Month Filter */}
            <SelectField 
              iconName="fi-sr-calendar"
              value={searchParams.month}
              recordList={monthsList}
              onChangeText={(value) => handleFilterChange('month', value)}
              placeholder="Filter by Month"
            />

            <button 
              onClick={clearFilters}
              className="flex md:hidden items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition"
            >
              <FiX className="mr-1" /> Clear Filters
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="w-full text-sm">
          <div className="grid grid-cols-3 md:grid-cols-12 gap-2 p-2 bg-gray-100 border-b font-semibold text-primary">
            <div className="md:col-span-3 hidden md:block">Rank</div>
            <div className="col-span-2 md:col-span-6">Full Name</div>
            <div className="col-span-2 hidden md:block">Date of Birth</div>
            <div className=" text-center">Actions</div>
          </div>
          
          <div className="h-auto md:h-[320px] overflow-auto w-full">
            {loading && (
              <div className="w-full py-10 flex justify-center">
                <Spinner />
              </div>
            )}
            
            {!loading && isEmpty && (
              <div className="w-full flex flex-col items-center py-10 text-center">
                <FiFilter className="text-4xl text-gray-400 mb-3" />
                <div className="text-gray-500 mb-4">No records found</div>
                <button 
                  onClick={clearFilters}
                  className="flex items-center bg-[#2e3c61] text-white px-4 py-2 rounded-lg hover:bg-[#1e2a48] transition"
                >
                  <FiRefreshCw className="mr-2" /> Reset Filters
                </button>
              </div>
            )}
            
            {!loading && memberList.map((member) => (
              <div 
                key={member._id}
                className="grid grid-cols-3 md:grid-cols-12 gap-2 p-2 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="md:col-span-3 font-medium hidden md:block">{member.rank}</div>
                <div className="col-span-2 md:col-span-6 truncate"><div className="block md:hidden font-semibold">{member.rank}</div>{member.fullName}</div>
                <div className="col-span-2 text-gray-600 hidden md:block">{member.day} of {member.month}</div>
                <div className="flex justify-center">
                  <button
                    onClick={() => { setSelectedMember(member); setViewAble(true); }}
                    className="text-sm bg-[#e67238] hover:bg-[#d16228] text-white px-3 py-1 rounded-lg transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
        {/* Pagination */}
        <Pagination 
          currentPage={searchParams.page} 
          pageSize={searchParams.pageSize} 
          totalPages={totalPage} 
          onPageSizeChange={onPageSizeChange} 
          onPageChange={onPageChange}
          totalItems={totalMember}
        />
      </div>
    </div>
  );
};

export default Members;