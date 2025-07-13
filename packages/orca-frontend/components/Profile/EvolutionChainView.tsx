import React, { FC } from 'react';
import { Spacing, Skeleton, Link, P, Avatar } from '../ui';
import {
  HeadingContainer,
  Heading,
  Root,
  ChainContainer
} from './style';

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

 const renderChain = (node: EvolutionNode | null): JSX.Element | null => {
  if (!node) return null;
  const mid = Math.ceil(node.evolves_to.length / 2);
  const firstRow = node.evolves_to.slice(0, mid);
  const secondRow = node.evolves_to.slice(mid);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link disableBorderOnHover href={`/profile/${node.name}`}>
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
          <div style={{ margin: '0 5rem' }}>➜</div>

          <div style={{ display: 'flex', gap: '4rem', flexDirection: 'column', justifyContent: 'center'  }}>
              {[firstRow, secondRow].map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
  
            {row.map((child) => (
              <div key={child.name} style={{ display: 'flex', margin: '0 1rem', alignItems: 'center' }}>               
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
