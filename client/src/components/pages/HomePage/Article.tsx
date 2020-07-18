import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'react-feather'
import { Body, Link, Heading3 } from '../../../shared/Styles';
import { SearchArticle } from '../../../shared/Models';

interface ArticleProps {
  updateStatus: Function;
  article: SearchArticle;
}
  

const Article = ({updateStatus, article}: ArticleProps) => {
  let authorString = '';
  if (article.authors.length > 0) {
    article.authors.forEach((author, idx) => {
      if (author !== '') {
        authorString += idx === article.authors.length - 1 ? `${author}.` : `${author}, `;
      }
    });
  }

  let keywordString = '';
  article.keywords.forEach((keyword) => {keywordString += keyword + ", "});

  // Indicate if arXiv, medRxiv, or bioRxiv is the source
  let source = article.source.join(",");
  return (
    <HomeTextWrapper>
      <ReturnBar>
        <ArrowLeftIcon onClick={() => updateStatus(true)}/> 
        <ReturnText> Back to Search Results</ReturnText>
      </ReturnBar>

      <Title>
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </Link>
      </Title>
      <Subtitle>
        <Subheading>Responsible Parties</Subheading>
        {authorString && <Authors>{authorString}</Authors>}
        <Subheading>Journal</Subheading>
        {article.journal && <Journal>{article.journal}</Journal>}
        <Subheading>Contact Organization</Subheading>
        {source && <Journal>{source}</Journal>}
        <Subheading>Publish Date</Subheading>
        {article.publish_time && <PublishTime>({article.publish_time})</PublishTime>}
      </Subtitle>
      <Subheading>Recommended Citations</Subheading>
      <Content>
        {article.recommended_ctiation}
      </Content>
      <Subheading>Purpose</Subheading>
      <Content>
        {article.purpose}
      </Content>
      <Subheading>Abstract</Subheading>
      <Content>
        {article.abstract}
      </Content>
      <Subheading>Supplemental Information</Subheading>
      <Content>
        {article.suppl_info}
      </Content>
      <Subheading>Topic Category</Subheading>
      <Content>
        {article.topic_category}
      </Content>
      <Subheading>Theasurus Name</Subheading>
      <Content>
        {article.theasurus_name}
      </Content>
      <Subheading>Keywords</Subheading>
      <Content>
        {keywordString.slice(0,-2)}
      </Content>
      <Heading>Contact Information</Heading>
      <Subheading>Contact Person</Subheading>
      <Content>
        UW GWF Data Manager
      </Content>
      <Subheading>Contact Organisation</Subheading>
      <Content>
        Global Water Futures, University of Waterloo
      </Content>
      <Subheading>Address</Subheading>
      <Content>
        200 University Ave W, Waterloo, ON N2L 3G1, Canada
      </Content>
      <Subheading>E-Mail</Subheading>
      <Content>
        <Link
                href="mailto:gwf-uw@uwaterloo.ca"
                target="_blank"
                rel="noopener noreferrer"
        >
          gwf-uw@uwaterloo.ca
        </Link>
      </Content>
      <Subheading>Phone</Subheading>
      <Content>
        519-888-4567, ext. 31327
      </Content>
      <Subheading>Website</Subheading>
      <Content>
        <Link
                href="https://uwaterloo.ca/global-water-futures/"
                target="_blank"
                rel="noopener noreferrer"
        >
          https://uwaterloo.ca/global-water-futures/
        </Link>
      </Content>
      <Subheading>Date Stamp</Subheading>
      <Content>
        {article.publish_time}
      </Content>

    </HomeTextWrapper>
  );
};

export default Article;

const Heading = styled.div`
  font-size: 22px;
  margin-top: 20px;
  display: block;
  color: black;
`

const Subheading = styled.div`
  display: block;
  font-size: 16px;
  font-weight: bolder;
  margin-top: 15px;
  color: ${({ theme }) => theme.black};
`

const HomeTextWrapper = styled.div`
  padding: 16px 3% 0px 3%;
  background-color: white;
  height: 100%;
  overflow: scroll;
`;

const ReturnBar = styled.div`
  display: block;
`

const ArrowLeftIcon = styled(ArrowLeft)`
  display: inline-block;
  vertical-align: middle;
  height: 25px;
  width: 25px;
`;

const ReturnText = styled.div`
  display: inline-block;
  margin-left: 1%;
  padding: 5px 5px 5px 5px;
`

const Title = styled.p<{ bold?: boolean }>`
  ${Heading3}
  margin-bottom: 16px;
  margin-top: 30px;
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
`;

const Subtitle = styled.div`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.black};
`;

const Authors = styled.div`
  margin-right: 4px;
  display: inline-block;
`;

const Journal = styled.div`
  display: block;
  font-style: italic;
  margin-right: 4px;
  margin-top: 0px;
`;

const PublishTime = styled.div`
  display: block;
`;

const Content = styled.div`
  padding-right: 2%
`