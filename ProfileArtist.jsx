import {useEffect, useState} from 'react';
import useProfile from '@/hooks/useProfile';
import {useSaveDesigner, useUploadImage} from './hooks';
import ProfileSide from './ProfileSide';
import ProfileForm from './ProfileForm';
import ExtraFields from './ExtraFields';
import {CATEGORY_OPTIONS, STYLE_OPTIONS, toValueArray} from '@/api/utils/mapper';

export default function ProfileArtist() {
  const {profile} = useProfile();
  const {save: saveDesigner} = useSaveDesigner();
  const {upload} = useUploadImage();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    imageUrl: '',
    email: '',
    nickname: '',
    phoneNumber: '',
    education: '',
    major: '',
    designCategories: [],
    designStyles: [],
  });

  useEffect(() => {
    if (profile) {
      setProfileData((prev) => ({
        ...prev,
        imageUrl: profile.imageUrl ?? '',
        email: profile.email ?? '',
        nickname: profile.nickName ?? profile.nickname ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        education: profile.education ?? '',
        major: profile.major ?? '',
        designCategories: toValueArray(profile.designCategories ?? [], CATEGORY_OPTIONS),
        designStyles: toValueArray(profile.designStyles ?? [], STYLE_OPTIONS),
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
        education: profile.education ?? '',
        major: profile.major ?? '',
        designCategories: toValueArray(profile.designCategories ?? [], CATEGORY_OPTIONS),
        designStyles: toValueArray(profile.designStyles ?? [], STYLE_OPTIONS),
      }));
    }
  };

  const handleSave = async () => {
    // email만 제외하고 nickName은 포함하여 전송
    const {email, ...rest} = profileData;

    const payload = {
      ...rest,
      designCategories: toValueArray(rest.designCategories, CATEGORY_OPTIONS),
      designStyles: toValueArray(rest.designStyles, STYLE_OPTIONS),
    };

    try {
      await saveDesigner(payload);
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || '프로필 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const res = await upload(file);
      if (res?.profileImageUrl) {
        setProfileData((p) => ({...p, imageUrl: res.profileImageUrl}));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || '이미지 업로드에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const updateField = (field, value) => {
    if (field === 'email') return;
    setProfileData((p) => ({...p, [field]: value}));
  };

