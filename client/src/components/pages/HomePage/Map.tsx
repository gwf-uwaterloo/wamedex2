import React, { useEffect, useRef } from 'react'
import { Map, TileLayer, Marker, Popup, Polygon} from 'react-leaflet'
import styled from 'styled-components';
import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import { SearchArticle } from '../../../shared/Models';

interface MapProps {
  polygon: string;
  updateStatus: boolean;
  articles: SearchArticle[] | null;
  mapWidth: number;
}
const IsoMap = ({polygon, updateStatus, articles, mapWidth} : MapProps) => {
  const position = {lat: 46.458305, lng: -81.09848}
  const mapRef = useRef(null)
  const individualPolygon = useRef(null)

  useEffect(() => {
    if (individualPolygon.current != null && !updateStatus){
      (mapRef as any).current.leafletElement.flyToBounds((individualPolygon as any).current.leafletElement.getBounds(), {animate: true, duration: 0.5})
    }
    if (updateStatus) {
      (mapRef as any).current.leafletElement.setView([50,50], 13);
    }
  }, [polygon]);

  useEffect(() => {
    if (updateStatus) {
      (mapRef as any).current.leafletElement.setView(position, 5);
    }
  }, [updateStatus])

  return (
    <Map center={position} zoom={5} ref={mapRef} style={{width: mapWidth}}>
      <TileLayer
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {!updateStatus || articles == null ?
        <>{polygon != "" && <Polygon positions={eval(polygon)} color="blue" ref={individualPolygon}/>}</>
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
