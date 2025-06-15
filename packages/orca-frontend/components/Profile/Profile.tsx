import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CoverPhoto,
  CoverLoading,
  ProfilePhoto,
  CoverImageWrapper,
  ProfileImageWrapper,
  Info,
  Actions,
  TypeRow,
  Count,
  ImageContainer, Image,
  Bold,
  AboutLine,
  
} from './style';
import UploadImage from '../UploadImage';
import Follow from '../Follow';
import { RootState } from '../../store';
import { Loading, H1, Spacing, ButtonLink, Avatar, Container, P, ProgressBar } from '../ui';
import { EnvelopeIcon } from '../ui/icons';

interface ProfileProps {
  user: any;
  queryKey: any;
}

export enum ProfileLoading {
  ProfilePicture,
  CoverPicture,
}

const Profile: FC<ProfileProps> = ({ user, queryKey }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<ProfileLoading>(null);
  return (
    <>
      <CoverPhoto isLoading={isLoading} image={authUser?._id === user._id ? authUser.coverImage : user.coverImage}>
        {isLoading === ProfileLoading.CoverPicture && (
          <CoverLoading>
            <Loading />
          </CoverLoading>
        )}
        {authUser?._id === user._id && (
          <CoverImageWrapper>
            <UploadImage isCover setIsLoading={setIsLoading} />
          </CoverImageWrapper>
        )}
        <ProfilePhoto>
          {isLoading === ProfileLoading.ProfilePicture ? (
            <Loading top="lg" />
          ) : (
            <Avatar
              isOnline={authUser?._id !== user._id && user.isOnline}
              image={ user.pokeApiId ? 
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${user.pokeApiId}.png`:
                user.image  }
              size={4}
            />
          )}
          {authUser?._id === user._id && (
            <ProfileImageWrapper>
              <UploadImage setIsLoading={setIsLoading} />
            </ProfileImageWrapper>
          )}
        </ProfilePhoto>
        
      </CoverPhoto>

      <Info>
        <H1>{user.fullName}</H1>
        <Container paddingHorizontal="sm" paddingVertical="xs" marginTop="sm" bgColor={user.color || 'red' } shadow="sm">
            
              <Spacing left="xs" top="xxs">
                <P size="xs">
                  {user.about.split('\\n').map((line, idx) => (
                    <AboutLine key={idx}>
                        {idx == 0 ? <h3>{line}</h3> : line}                
                    </AboutLine>
                  ))}
                </P>
                <P size="xs">
                <br/>
                <TypeRow>
                <ProgressBar label="HP" value={user.stats[0] ?? 0} />
                <ProgressBar label="Attack"  value={user.stats[1] ?? 0} />
                <ProgressBar label="Defense"  value={user.stats[2] ?? 0} />
                <ProgressBar label="Special Attack"  value={user.stats[3] ?? 0} />
                <ProgressBar label="Special Defense"  value={user.stats[4] ?? 0} />
                <ProgressBar label="Speed"  value={user.stats[5] ?? 0} />
                 </TypeRow>
                </P>
                <TypeRow>
                  {user.types?.map((type: string) => (
                  <ImageContainer>
                    <Image alt="type"
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-and-shining-pearl/${type}.png`} />
                    </ImageContainer>
                      ))}
                </TypeRow>
               
              </Spacing>
          </Container>
      </Info>

      {authUser && authUser?._id !== user._id && (
        <Actions>
          <Follow user={user} queryKey={queryKey} />
          <Spacing left="sm" />
          <ButtonLink href={`/messages/${user._id}`}>
            <EnvelopeIcon color="primary" /> Message
          </ButtonLink>
        </Actions>
      )}
      <Count>
        <Spacing right="md">
          <Bold>{user.followers.length}</Bold>followers
        </Spacing>
        <Bold>{user.following.length}</Bold>following
      </Count>
    </>
  );
};

export default Profile;
