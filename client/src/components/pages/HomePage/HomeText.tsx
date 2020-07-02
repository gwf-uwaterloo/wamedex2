import React from 'react';
import styled from 'styled-components';
import { Body, Link } from '../../../shared/Styles';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>Wamedex</Bold> a website for querying data from the polar data catalogue{' '}
        
      </Paragraph>
    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
`;

const List = styled.ul`
  ${Body}
`;

const ListItem = styled.li`
  ${Body}
`;

const Paragraph = styled.div`
  ${Body}
  margin-bottom: 24px;
`;

const Bold = styled.span`
  ${Body}
  font-weight: 600;
`;
