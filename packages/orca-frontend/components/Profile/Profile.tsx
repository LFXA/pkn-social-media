import React, { FC, useState, useEffect } from 'react';
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
import EvolutionChainView from './EvolutionChainView';
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

function mapChain(chain) {
  const extractId = (url: string): number => {
    const match = url.match(/\/pokemon-species\/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
  };

  return {
    name: chain.species.name,
    pokeApiId: extractId(chain.species.url),
    evolves_to: chain.evolves_to.map(mapChain)
  };
}

const Profile: FC<ProfileProps> = ({ user, queryKey }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<ProfileLoading>(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  
  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (!user.evolutionChain) return;

      setEvolutionLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${user.evolutionChain}/`);
        const data =  await response.json();
        const parsed = mapChain(data.chain);
        setEvolutionChain(parsed);
      } catch (error) {
        console.error('Failed to load evolution chain', error);
      } finally {
        setEvolutionLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [user.evolutionChain]);

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

      <Info >
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
                  {user.types?.map((type: string, key) => (
                  <ImageContainer  key={key}>
                    <Image alt="type"
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-and-shining-pearl/${type}.png`} />
                    </ImageContainer>
                      ))}
                </TypeRow>        
              </Spacing>
          </Container>
           <Container maxWidth="xxxl" bgColor={user.color || 'red' }>
             <EvolutionChainView chain={evolutionChain} isFetching={evolutionLoading} />
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
