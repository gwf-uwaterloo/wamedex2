import React from 'react';
import styled from 'styled-components';

import { BaseArticle } from '../../shared/Models';
import { Heading3, Link } from '../../shared/Styles';

interface BaseArticleResultProps {
  article: BaseArticle;
  position?: number;
  onClickTitle?: () => void;
  boldTitle?: boolean;
}

const BaseArticleResult: React.FC<BaseArticleResultProps> = ({
  article,
  position,
  onClickTitle = () => {},
  boldTitle = false,
}) => {
  let authorString = '';
  if (article.authors.length > 0) {
    article.authors.forEach((author, idx) => {
      if (author !== '') {
        authorString += idx === article.authors.length - 1 ? `${author}.` : `${author}, `;
      }
    });
  }

  const transformPreprintSource = (source: string) => {
    if (source === 'arxiv') {
      return source.replace('x', 'X');
    } else {
      return source.replace('r', 'R');
    }
  };

  // Indicate if arXiv, medRxiv, or bioRxiv is the source
  let source = '';
  article.source.forEach((s) => {
    if (['arxiv', 'medrxiv', 'biorxiv'].includes(s.trim().toLowerCase())) {
      source += transformPreprintSource(s.trim().toLowerCase());
    }
  });

  return (
    <>
      <Title bold={boldTitle}>
        {/*{position !== undefined ? `${position + 1}. ` : ''}*/}
        {article.url !== null && article.url !== '' ? (
          <Link target="_blank" rel="noopener noreferrer" onClick={onClickTitle}>
            {article.title}
          </Link>
        ) : (
          article.title
        )}
      </Title>
      {/*
      <Subtitle>
        {authorString && <Authors>{authorString}</Authors>}
        {article.journal && <Journal>{article.journal}</Journal>}
        {source && <Journal>{source}</Journal>}
        {article.publish_time && <PublishTime>({article.publish_time})</PublishTime>}
      </Subtitle>*/}
    </>
  );
};

export default BaseArticleResult;

const Title = styled.div<{ bold?: boolean }>`
  ${Heading3}
  margin-bottom: 5px;
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.2;
`;

const Subtitle = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.black};
`;

const Authors = styled.span`
  margin-right: 4px;
`;

const Journal = styled.span`
  font-style: italic;
  margin-right: 4px;
`;

const PublishTime = styled.span``;
