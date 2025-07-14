import React, { FC } from 'react';
import { Spacing, Skeleton, Link, P, Avatar } from '../ui';
import {
  HeadingContainer,
  Heading,
  Root,
  ChainContainer
} from './style';
import { useEffect, useState } from 'react';
import  useBreakpoints  from '../../utils/useBreakpoints';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


interface EvolutionNode {
  name: string;
  pokeApiId: number;
  evolves_to: EvolutionNode[];
}

interface EvolutionChainProps {
  chain: EvolutionNode | null;
  isFetching: boolean;
}

const EvolutionChainView: FC<EvolutionChainProps> = ({ chain, isFetching }) => {
  const renderSkeleton = () => {
    return <Skeleton count={3} height={60} top="xs" />;
  };
 const breakpoint = useBreakpoints();
 const isMobile = breakpoint === 'xs' || breakpoint === 'sm';


   const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    return arr.reduce<T[][]>((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const renderChain = (node: EvolutionNode | null): JSX.Element | null => {
    if (!node) return null;

    const rows = isMobile
      ? chunkArray(node.evolves_to, 2)
      : [
          node.evolves_to.slice(0, Math.ceil(node.evolves_to.length / 2)),
          node.evolves_to.slice(Math.ceil(node.evolves_to.length / 2)),
        ];

    return (
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', margin : '0 2rem', alignItems: 'center' }}>
        <Link href={`/profile/${node.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.pokeApiId}.png`}
              size={4.5}
            />
            <Spacing top="xl" />
            <P>{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</P>
          </div>
        </Link>

        {node.evolves_to.length > 0 && (
          <>
            <div className="connector">{isMobile ? '↓' : '→'}</div>

            <div
              style={{
                display: 'flex',
                flexDirection:  'column',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="evo-row">
                  {row.map((child) => (
                    <div key={child.name} className="chain-child">
                      {renderChain(child)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

 return (
  <Root>
    <HeadingContainer>
      <Heading>Evolution Chain</Heading>
    </HeadingContainer>
    <Spacing bottom='xl'></Spacing>
    <ChainContainer>
      {isFetching ? renderSkeleton() : renderChain(chain)}
      <Spacing top="lg" />
    </ChainContainer>
  </Root>
);

};

export default EvolutionChainView;
