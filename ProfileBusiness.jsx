import {useEffect, useState} from 'react';
import useProfile from '@/hooks/useProfile';
import {useSaveBusiness, useUploadImage} from './hooks';
import ProfileSide from './ProfileSide';
import ProfileForm from './ProfileForm';

export default function ProfileBusiness() {
  const {profile} = useProfile();
  const {save: saveBusiness} = useSaveBusiness();
  const {upload} = useUploadImage(); // 내부에서 userType 분기(또는 api에서 분기)

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    imageUrl: '',
    email: '',
    nickname: '',
    phoneNumber: '',
  });

  // 서버 응답 반영 (nickname 혼용 가드)
  useEffect(() => {
    if (profile) {
      setProfileData((prev) => ({
        ...prev,
        imageUrl: profile.imageUrl ?? '',
        email: profile.email ?? '', // 표시용(읽기 전용)
        nickname: profile.nickName ?? profile.nickname ?? '',
        phoneNumber: profile.phoneNumber ?? '',
      }));
    }
  }, [profile]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setProfileData((prev) => ({
        ...prev,
        imageUrl: profile.imageUrl ?? '',
        email: profile.email ?? '',
        nickname: profile.nickName ?? profile.nickname ?? '',
        phoneNumber: profile.phoneNumber ?? '',
      }));
    }
  };

  const handleSave = async () => {
    // email과 nickname은 제외해서 전송
    const {email, nickname, ...payload} = profileData;
    try {
      await saveBusiness(payload);
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || '프로필 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      // 업로드 응답이 { profileImageUrl } 또는 { imageUrl }로 올 수 있음
      const res = await upload(file);
      const url = res?.imageUrl ?? res?.profileImageUrl ?? '';
      if (url) {
        // ✅ 화면은 imageUrl만 본다
        setProfileData((p) => ({...p, imageUrl: url}));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || '이미지 업로드에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const updateField = (field, value) => {
    if (field === 'email' || field === 'nickname') return; // 이메일과 닉네임은 변경 불가
    setProfileData((p) => ({...p, [field]: value}));
  };

  return (
    <div className="min-w-[1000px] px-[140px] py-[26px]">
      <div className="flex justify-between mb-[32px]">
        <h3 className="text-[18px] font-[600]">내 정보</h3>
        <div className="flex gap-[12px]">
          {!isEditing ? (
            <button onClick={handleEdit} className="text-[#4B83E3]">
              수정
            </button>
          ) : (
            <>
              <button onClick={handleCancel} className="text-[#4B83E3]">
                취소
              </button>
              <button onClick={handleSave} className="text-[#4B83E3]">
                저장
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-[52px]">
        {/* 프로필 이미지 영역 */}
        <div className="flex-shrink-0">
          <ProfileSide
            profileImage={profileData.imageUrl} // ← imageUrl 표시
            onImageUpload={handleImageUpload} // ← 업로드 핸들러
            isEditing={isEditing}
          />
        </div>

        {/* 폼 영역 (드롭다운 없음) */}
        <div className="flex-1">
          <ProfileForm
            profileData={profileData}
            isEditing={isEditing}
            onFieldChange={updateField}
            userType="BUSINESS"
          />
        </div>
      </div>
    </div>
  );
}
