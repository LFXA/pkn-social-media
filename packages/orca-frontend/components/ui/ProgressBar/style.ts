import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-bottom: 6px;
  margin-right: 15px;
  width: 30%;
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
  color: #333;
  text-align: left;
`;

export const BarContainer = styled.div`
  width: 100%;
  height: 16px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
`;

export const BarFill = styled.div`
  height: 100%;
  background-color:rgb(245, 8, 8); /* bright red */
  transition: width 1.5s ease-in-out;
`;