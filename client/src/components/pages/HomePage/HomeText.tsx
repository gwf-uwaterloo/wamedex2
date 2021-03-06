import React from 'react';
import styled from 'styled-components';
import { Body, Link } from '../../../shared/Styles';
import GithubImg from '../../../img/github.png';
import WaterlooImg from '../../../img/uwaterloo.png';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>Wamedex</Bold> a website for querying data from the polar data catalogue{' '}
      </Paragraph>
      <Link
              href="https://github.com/gwf-uwaterloo/wamedex2"
              target="_blank"
              rel="noopener noreferrer"
      >
        <GithubLogo src={GithubImg} alt="Github logo" />
      </Link>
      <WaterlooLogo src={WaterlooImg} alt="Logo of the University of Waterloo"/>

    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
  margin-left: 40px;
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

const GithubLogo = styled.img`
  display: flex;
  height: 50px;
  width: 50px;
  cursor: pointer;
  margin-left: 40%;
  &:hover {
    filter: brightness(85%);
  }
  color: black;
`;

const WaterlooLogo = styled.img`
  display: flex;
  height: 50px;
  width: 200px;
  cursor: pointer;
  margin-left: 30%;
  margin-top: 2%;
  &:hover {
    filter: brightness(85%);
  }
  color: black;
`;