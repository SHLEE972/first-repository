import '../../components/common/form/form.css';

export default function ProfileForm({profileData, isEditing, onFieldChange, userType}) {
  // 비지니스 사용자일 때 닉네임 수정 불가능
  const isNicknameDisabled = userType === 'BUSINESS' || !isEditing;

  return (
    <div>
      <div>
        <label className="label-title">이메일</label>
        <input type="email" value={profileData.email || ''} disabled className="form-input bg-[#F8F7F6]" readOnly />
      </div>

      <div>
        <label className="label-title">닉네임</label>
        <input
          type="text"
          value={profileData.nickname || ''}
          onChange={(e) => onFieldChange('nickname', e.target.value)}
          disabled={isNicknameDisabled}
          className={`form-input ${isNicknameDisabled ? 'bg-[#F8F7F6]' : ''}`}
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <div>
        <label className="label-title">전화번호</label>
        <input
          type="tel"
          value={profileData.phoneNumber || ''}
          onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
          disabled={!isEditing}
          className={`form-input ${!isEditing ? 'bg-[#F8F7F6]' : ''}`}
          placeholder="010-1234-5648"
        />
      </div>
    </div>
  );
}
