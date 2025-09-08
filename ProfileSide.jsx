import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {LogOut} from 'lucide-react';
import {useStore} from '@/store/useStore';
import defaultProfileImg from '../../assets/images/default-profile-img.svg';

export default function ProfileSide({profileImage, onImageUpload, isEditing}) {
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center gap-[14px]">
      <div
        className={`w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-gray-200 ${
          isEditing ? 'cursor-pointer hover:opacity-80' : ''
        }`}
        onClick={handleImageClick}
      >
        <img
          src={profileImage || defaultProfileImg} // ← imageUrl이 props로 전달됨
          alt="프로필 이미지"
          className="w-full h-full object-cover"
        />
      </div>

      {isEditing && (
        <button
          type="button"
          onClick={handleImageClick}
          className="px-[12px] py-[6px] text-[15px] border border-black/30 rounded-full hover:border-black/60"
          title="프로필 이미지 변경"
        >
          프로필 변경
        </button>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <button onClick={handleLogout} className="flex items-center gap-[8px] text-black/50 hover:text-black/80">
        <LogOut size={12} />
        <span className="text-[12px]">로그아웃</span>
      </button>
    </div>
  );
}
