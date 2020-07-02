import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, Polygon} from 'react-leaflet'
import styled from 'styled-components';
import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import { SearchArticle } from '../../../shared/Models';

interface MapProps {
  polygon: string;
  updateStatus: boolean;
  articles: SearchArticle[] | null;
}
const IsoMap = ({polygon, updateStatus, articles} : MapProps) => {
  const position = {lat: 46.458305, lng: -81.09848};
  return (
    <Map center={position} zoom={5}>
      <TileLayer
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <NoResults>No results found</NoResults>
      {!updateStatus || articles == null ?
        <>{polygon != "" && <Polygon positions={eval(polygon)} color="blue" />}</>
        :
        <>{articles != null && 
          articles.map((article, i) => (<Polygon positions={eval(article.coordinates)} color="blue" />))
        }</>
      } 
    </Map>
  )
}
const NoResults = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
`;
export default IsoMap;
