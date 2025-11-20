import React from 'react';
import { useState, useEffect } from 'react';
import { IFollowToggleButtonType, ButtonSizeType, ButtonColorType } from '../../types/IFollowToggleButtonType';
import { profileAPI } from '../../service/fetch/api';
import throttle from '../../utils/throttle';

// 버튼 사이즈별 상수 정의
const BUTTON_SIZES = {
  medium: `text-[14px] w-[120px] h-[34px] rounded-[44px]`,
  small: `text-[12px] w-[56px] h-[28px] rounded-[26px]`,
} as const;

function getButtonSize(size: ButtonSizeType) {
  return BUTTON_SIZES[size] || BUTTON_SIZES.small;
}

// 버튼 색깔별 상수 정의
const BUTTON_COLORS = {
  normal: 'bg-[#F26E22] text-white active:bg-[#D4541A]',
  active: 'bg-[#FFFFFF] text-[#767676] border-[1px] border-[#DBDBDB] active:bg-[#BFBFBF]',
} as const;

function getButtonColor(color: ButtonColorType) {
  return BUTTON_COLORS[color] || BUTTON_COLORS.normal;
}

// onFollowChange 콜백을 optional로 허용하도록 타입 확장
function FollowToggleButton(props: IFollowToggleButtonType & { onFollowChange?: () => Promise<void> | void }) {
  const { followText, unfollowText, btnSize, userAccount, isFollow, onFollowChange } = props;

  // 현재 팔로우 상태를 관리
  const [isFollowing, setIsFollowing] = useState(isFollow);

  // 부모에서 isFollow prop이 변경될 수 있으니 동기화
  useEffect(() => {
    setIsFollowing(isFollow);
  }, [isFollow]);

  // 팔로우/언팔로우 핸들러
  async function handleFollowToggle() {
    try {
      if (isFollowing) {
        const res = await profileAPI.unfollow(userAccount);
        setIsFollowing(res.profile.isfollow);
      } else {
        const res = await profileAPI.follow(userAccount);
        setIsFollowing(res.profile.isfollow);
      }

      // 성공 시 부모에게 변경 알림(있으면 호출)
      if (onFollowChange) {
        try {
          await onFollowChange();
        } catch (err) {
          // 부모 콜백 실패는 로깅만
          console.error('onFollowChange 콜백 실패', err);
        }
      }
    } catch (error: any) {
      console.error('팔로우 또는 언팔로우를 실패하였습니다.', error.message);
    }
  }

  const handleThrottle = throttle(handleFollowToggle, 1000);

  return (
    <>
      <button
        type="button"
        className={`flex justify-center items-center py-[14px] px-[11px] font-medium ${getButtonSize(btnSize)} ${getButtonColor(isFollowing ? 'active' : 'normal')}`}
        onClick={handleThrottle}
      >
        {isFollowing ? unfollowText : followText}
      </button>
    </>
  );
}

export default FollowToggleButton;
