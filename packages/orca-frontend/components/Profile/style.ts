import styled from 'styled-components';
import { ProfileLoading } from './Profile';

interface CoverPhotoProps {
  image?: string;
  isLoading: ProfileLoading;
}

export const CoverPhoto = styled.div<CoverPhotoProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  max-width: ${(p) => p.theme.screen.lg};
  margin: 0 auto;
  height: 350px;
  ${(p) =>
    p.isLoading !== ProfileLoading.CoverPicture &&
    `background-image: url(${p.image ? p.image : 'https://bit.ly/3pxODji'}) `};
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: ${(p) => p.theme.radius.md};
  border-bottom-right-radius: ${(p) => p.theme.radius.md};
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

export const CoverLoading = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
`;

export const TypeRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px; 
`;

export const ImageContainer = styled.div`

  height: 30px;
  margin-top: 15px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InitialLetters = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.general.white};
  font-size: ${(p) => p.theme.font.size.lg};
  background-color: ${(p) => p.color};
`;

export const ProfilePhoto = styled.div`
  margin: 0 auto;
  position: relative;
  height: 119px;
  width: 119px;
  margin-bottom: -50px;
  border-radius: 50%;
  z-index: 10;
  background-color: ${(p) => p.theme.colors.general.white};
  display: flex;
  justify-content: center;
`;

export const AboutLine = styled.span`
  display: inline-block;
`;

export const ProfileImageWrapper = styled.div`
  position: absolute;
  left: 95px;
  bottom: 15px;
`;

export const CoverImageWrapper = styled.div`
  position: absolute;
  right: ${(p) => p.theme.spacing.xs};
  top: ${(p) => p.theme.spacing.xs};

  @media (min-width: ${(p) => p.theme.screen.sm}) {

  }
`;

export const Info = styled.div`
  margin-top: ${(p) => p.theme.spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  width: 85%;
`;

export const Actions = styled.div`
  margin-top: ${(p) => p.theme.spacing.xs};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Count = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(p) => p.theme.spacing.sm};
`;

export const Bold = styled.div`
  font-weight: ${(p) => p.theme.font.weight.bold};
  display: inline-block;
  margin-right: ${(p) => p.theme.spacing.xxs};
`;


export const Root = styled.div``;

export const HeadingContainer = styled.div`
  padding: 8px 16px;
`;

export const Heading = styled.h3`
  margin: 0;
`;

export const ChainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 16px;

  .connector {
    font-size: 1.5rem;
    color: #888;
  }
`;

export const ChainNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChildChain = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin-top: 20px;
  flex-direction: row;
  position: relative;
`;
export const DownArrow = styled.div`
  text-align: center;
  font-size: 24px;
  margin-top: 8px;
`;