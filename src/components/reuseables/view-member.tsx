import React from 'react';
import Spinner from './spinner';
import { MemberInfo } from '../../utils/interface';
import { FiX, FiDownload, FiCalendar, FiMail, FiPhone, FiUser, FiHome } from 'react-icons/fi';
import { addSuffix } from '../../utils/common';

interface ViewMemberProps {
  member: MemberInfo | null;
  loading?: boolean;
  closeModal?: (value: boolean) => void;
}

const ViewMember = ({ member, loading, closeModal }: ViewMemberProps) => {
  const handleCloseModal = () => {
    closeModal?.(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-xl font-bold text-primary mb-4">Loading Member Details...</div>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-primary to-[#e67238]">
          <h2 className="text-xl font-bold text-white">Member Details</h2>
          <button 
            onClick={handleCloseModal}
            className="text-white hover:text-gray-200 transition"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Member Image */}
            <div className="flex flex-col items-center lg:w-1/4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-square flex items-center justify-center mb-4 overflow-hidden">
                {member?.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt="member"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-gray-400 text-6xl" />
                )}
              </div>
              <a 
                href={`${member?.imageUrl}?dl=`} 
                download 
                onClick={(e) => e.stopPropagation()} 
                className="w-full flex items-center justify-center gap-2 bg-[#1e2a48] hover:bg-primary text-white px-4 py-3 rounded-lg transition"
              >
                <FiDownload size={18} />
                Download Image
              </a>
            </div>
            
            {/* Member Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailCard 
                icon={<FiUser className="text-[#e67238]" />}
                title="Rank"
                value={member?.rank || '---'}
              />
              <div className="md:col-span-2">
                <DetailCard 
                    icon={<FiUser className="text-[#e67238]" />}
                    title="Full Name"
                    value={member?.fullName || '---'}
                />
              </div>
              <DetailCard 
                icon={<FiMail className="text-[#e67238]" />}
                title="Email"
                value={member?.email || '---'}
              />
              
              <DetailCard 
                icon={<FiPhone className="text-[#e67238]" />}
                title="Mobile"
                value={member?.mobile || '---'}
              />
              
              <DetailCard 
                icon={<FiUser className="text-[#e67238]" />}
                title="Gender"
                value={member?.gender || '---'}
              />
              
              <DetailCard 
                icon={<FiCalendar className="text-[#e67238]" />}
                title="Date of Birth"
                value={member?.day ? `${addSuffix(member.day)} of ${member.month}` : '---'}
              />
              
              <div className="md:col-span-2">
                <DetailCard 
                  icon={<FiHome className="text-[#e67238]" />}
                  title="Profession/Occupation"
                  value={member?.profession || '---'}
                />
              </div>

              <div className="md:col-span-3">
                <DetailCard 
                  icon={<FiHome className="text-[#e67238]" />}
                  title="Home Address"
                  value={member?.homeAddress || '---'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
    <div className="flex items-center mb-2">
      <div className="mr-2">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
    </div>
    <p className="text-sm font-medium break-all">{value}</p>
  </div>
);

export default ViewMember;