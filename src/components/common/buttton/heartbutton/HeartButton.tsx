import anime from 'animejs';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { PostLikeRsp } from '../../../../global/interface/post';
import { putPostLike } from '../../../../services/post/putPostLike';
import theme from '../../../../styles/theme';
import LongPressToResizeButton from '../LongPressToResizeButton';

interface HeartButtonProps {
  setHeartStete: (postLikeGrp: PostLikeRsp) => void;
  postId: string;
  isLiked: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  setHeartStete,
  postId,
  isLiked,
}) => {
  const heartRef = useRef(null);

  const onClickHeartButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (postId) {
      putPostLike(postId)
        .then((value) => {
          setHeartStete(value);

          if (value.isLike) {
            anime({
              targets: heartRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };
  return (
    <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
      <HeartButtonWrap onClick={(e) => onClickHeartButton(e)}>
        <svg
          ref={heartRef}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isLiked ? theme.mainColor.Red : 'none'}
        >
          <path
            d="M19.4998 12.5722L11.9998 20.0002L4.49981 12.5722C4.00512 12.0908 3.61546 11.5122 3.35536 10.8728C3.09527 10.2334 2.97037 9.54713 2.98855 8.85711C3.00673 8.16709 3.16758 7.48831 3.46097 6.86351C3.75436 6.23871 4.17395 5.68143 4.6933 5.22676C5.21265 4.77208 5.82052 4.42987 6.47862 4.22166C7.13673 4.01345 7.83082 3.94376 8.51718 4.01698C9.20354 4.0902 9.86731 4.30473 10.4667 4.64708C11.0661 4.98943 11.5881 5.45218 11.9998 6.00618C12.4133 5.4562 12.9359 4.9975 13.5349 4.65878C14.1339 4.32007 14.7963 4.10863 15.4807 4.0377C16.1652 3.96677 16.8569 4.03787 17.5126 4.24657C18.1683 4.45526 18.7738 4.79705 19.2914 5.25054C19.8089 5.70403 20.2272 6.25946 20.5202 6.88207C20.8132 7.50468 20.9746 8.18106 20.9941 8.86889C21.0137 9.55671 20.8911 10.2412 20.6339 10.8794C20.3768 11.5177 19.9907 12.096 19.4998 12.5782"
            stroke={isLiked ? theme.mainColor.Red : theme.grey.Grey7}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HeartButtonWrap>
    </LongPressToResizeButton>
  );
};

const HeartButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

export default HeartButton;
