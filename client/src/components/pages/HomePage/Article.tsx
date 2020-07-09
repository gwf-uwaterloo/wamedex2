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

  // Indicate if arXiv, medRxiv, or bioRxiv is the source
  let source = article.source.join(",");
  return (
    <HomeTextWrapper>
      <ArrowLeftIcon onClick={() => updateStatus(true)}/>
      <Title>
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </Link>
      </Title>
      <Subtitle>
        {authorString && <Authors>{authorString}</Authors>}
        {article.journal && <Journal>{article.journal}</Journal>}
        {source && <Journal>{source}</Journal>}
        {article.publish_time && <PublishTime>({article.publish_time})</PublishTime>}
      </Subtitle>
      <Title>Abstract</Title>
      <Abstract>
        {article.abstract}
      </Abstract>
    </HomeTextWrapper>
  );
};

export default Article;

const HomeTextWrapper = styled.div`
  padding: 16px 3% 0px 3%;
  background-color: white;
  height: 100%;
`;

const ArrowLeftIcon = styled(ArrowLeft)`
  display: inline;
  height: 25px;
  width: 25px;
`;

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

const Abstract = styled.div`
  padding-right: 2%
`