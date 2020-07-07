import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import ErrorBoundary from 'react-error-boundary';

import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import Loading from '../../common/Loading';
import SearchResult from './SearchResult';
import HomeText from './HomeText';
import SearchBar from './SearchBar';

import { tokenize } from '../../../shared/Util';
import {
  API_BASE,
  SEARCH_ENDPOINT,
  SEARCH_VERTICAL_OPTIONS,
  SearchVerticalOption,
} from '../../../shared/Constants';
import Filters from './Filters';
import { SearchArticle, SearchFilters, SelectedSearchFilters } from '../../../shared/Models';
import IsoMap from './Map'
import Article from './Article'
import Collapsible from 'react-collapsible';
import { colors } from 'react-select/src/theme';

const defaultFilter = {
  yearMinMax: [0, 0],
  authors: [],
  journals: [],
  sources: [],
};


const defaultArticle = {} as SearchArticle;

const getSearchFilters = (searchResults: SearchArticle[] | null): SearchFilters => {
  if (searchResults === null || searchResults.length === 0) {
    return defaultFilter;
  }

  let min = Number.MAX_VALUE;
  let max = -1;
  let authors: Set<string> = new Set([]);
  let journals: Set<string> = new Set([]);
  let sources: Set<string> = new Set([]);

  searchResults.forEach((article) => {
    if (article.publish_time) {
      const year = Number(article.publish_time.substr(0, 4));
      min = Math.min(year, min);
      max = Math.max(year, max);
    }

    if (article.authors) {
      article.authors.forEach((a) => authors.add(a));
    }

    if (article.source) {
      article.source.forEach((s) => sources.add(s));
    }

    if (article.journal) {
      journals.add(article.journal);
    }
  });

  return {
    yearMinMax: min === max ? [min * 100 + 1, min * 100 + 12] : [min, max],
    authors: Array.from(authors.values()).filter((a) => a.length > 0),
    journals: Array.from(journals.values()),
    sources: Array.from(sources.values()),
  };
};

const HomePage = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';
  const vertical = urlParams.get('vertical') || 'cord19';

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');

  const [filters, setFilters] = useState<SearchFilters>(defaultFilter);
  const [selectedFilters, setSelectedFilters] = useState<SelectedSearchFilters>({
    yearRange: [0, 0],
    authors: new Set([]),
    journals: new Set([]),
    sources: new Set([]),
  });

  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchArticle[] | null>(null);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  const selectedVertical = SEARCH_VERTICAL_OPTIONS[0];
  useEffect(() => {
    const fetchData = async () => {
      if (query === null || query === '') {
        setLoading(false);
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setSearchResults(null);

        let response = await fetch(
          `${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}&vertical=${vertical}`,
        );
        setLoading(false);

        let data = await response.json();
        const { query_id, response: searchResults } = data;
        const filters = getSearchFilters(searchResults);

        setQueryId(query_id);
        setSearchResults(searchResults);
        setSelectedFilters({
          yearRange: filters.yearMinMax,
          authors: new Set([]),
          journals: new Set([]),
          sources: new Set([]),
        });
        setFilters(filters);
      } catch {
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData();
  }, [query, vertical]);

  const queryTokens = tokenize(query);
  const filteredResults =
    searchResults === null
      ? null
      : searchResults.filter(
          (article) =>
            (!article.publish_time ||
              (Number(article.publish_time.substr(0, 4)) >= selectedFilters.yearRange[0] &&
                Number(article.publish_time.substr(0, 4)) <= selectedFilters.yearRange[1]) ||
              (article.publish_time.length >= 7 &&
                Number(article.publish_time.substr(0, 7).replace('-', '')) >=
                  selectedFilters.yearRange[0] &&
                Number(article.publish_time.substr(0, 7).replace('-', '')) <=
                  selectedFilters.yearRange[1])) &&
            (selectedFilters.authors.size === 0 ||
              article.authors.some((a) => selectedFilters.authors.has(a))) &&
            (selectedFilters.journals.size === 0 ||
              selectedFilters.journals.has(article.journal)) &&
            (selectedFilters.sources.size === 0 ||
              article.source.some((s) => selectedFilters.sources.has(s))),
        );

  const [coordinates, setCoordinates] = useState("");
  function updateCoordinates(coordinate: string){
    setCoordinates(coordinate);
  }

  const [searchStatus, setSearchStatus] = useState(true);
  function updateSearchStatus(searchStatus: boolean) {
    setSearchStatus(searchStatus);
  }

  const [currentArticle, setCurrentArticle] = useState(defaultArticle);
  function updateCurrentArticle(article: SearchArticle) {
    setCurrentArticle(article);
  }

  return (
    <PageWrapper>
      <PageContent>
        {/*<ErrorBoundary FallbackComponent={() => <NoResults>No results found</NoResults>}>*/}
          {/*{loading && <Loading />}*/}
          <HomeContent>
            <MapWrapper><IsoMap polygon={coordinates} updateStatus={searchStatus} articles={filteredResults}></IsoMap></MapWrapper>
            <SideBar>
              {searchStatus ?
                (<>  <SearchBar
                  query={queryInputText}
                  vertical={selectedVertical}
                  setQuery={setQueryInputText}
                />
                {loading && <Loading />}
                {!query && <HomeText />}
                {query && searchResults !== null && searchResults.length > 0 && (
                  <Collapsible trigger="Filters" style={{backgroundColor:"blue"}} triggerClassName="FilterClass" triggerOpenedClassName="FilterClass">        
                    <Filters
                      filters={filters}
                      selectedFilters={selectedFilters}
                      setSelectedFilters={setSelectedFilters}
                    />
                  </Collapsible>
                )}
                {query &&
                  filteredResults !== null &&
                  (searchResults === null || filteredResults.length === 0 ? (
                    <NoResults>No results found</NoResults>
                  ) : (
                    <>
                      
                        {filteredResults.map((article, i) => (
                          <SearchResult
                            key={i}
                            article={article}
                            position={i}
                            queryTokens={queryTokens}
                            queryId={queryId}
                            updateCoord={updateCoordinates}
                            updateStatus={updateSearchStatus}
                            updateCurrentArticle={updateCurrentArticle}
                          />
                        ))}
                    </>
                  ))}</>) 
                    : 
                    (
                      <Article updateStatus={updateSearchStatus} article={currentArticle}/>
                  )}
            </SideBar>
          </HomeContent>
        {/*</ErrorBoundary>*/}
      </PageContent>
    </PageWrapper>
  );
};

export default HomePage;

const SideBar = styled.div`
  width: 30%;
  height: 100vh;
  display: inline-block;
  position: absolute;
  resize: horizontal;
  z-index: 10;
  background-color: white;
  overflow: scroll;
`;

const HomeContent = styled.div`
  width: 100%;
  height: 100vh;
  margin-right: 0px;
  display: block;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.singleColumn}px) {
    flex-direction: column;
  }
`;

const NoResults = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
`;

const MapWrapper = styled.div`
  float: right;
  display: block;
  width: 80%;
  z-index: 1;
`;