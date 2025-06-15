import React from 'react';
import * as S from './style';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max = 200 }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <S.Wrapper>
      <S.Label>
        <h4>{label}: {value}</h4>
      </S.Label>
      <S.BarContainer>
        <S.BarFill style={{ width: `${percentage}%` }} />
      </S.BarContainer>
    </S.Wrapper>
  );
};

export default ProgressBar;