import json
import time
from collections import OrderedDict
from datetime import datetime
from typing import List
from uuid import uuid4

import dateparser
from fastapi import APIRouter, Request

from app.models import (SearchArticle, SearchLogData, SearchLogType,
                        SearchQueryResponse, SearchVertical)
from app.settings import settings
from app.util.logging import build_timed_logger
from app.util.request import get_doc_url, get_multivalued_field, get_request_ip, get_author_field

router = APIRouter()
search_logger = build_timed_logger('search_logger', 'search.log')


@router.get('/search', response_model=SearchQueryResponse)
async def get_search(request: Request, query: str, vertical: SearchVertical):
    # Get search results from Lucene index.
    try:
        searcher_hits = request.app.state.searcher.search(query, vertical)
    except:
        # Sometimes errors out due to encoding bugs.
        searcher_hits = []

    # Get predictions from T5.
    t5_scores = [hit.score for hit in searcher_hits]

    # Sort results by T5 scores.
    results = list(zip(searcher_hits, t5_scores))
    results.sort(key=lambda x: x[1], reverse=True)


    # Take top N paragraphs from each result to highlight and build article object.
    ranked_results = []
    for result in results:
        base_docid = result[0].docid
        # Add full article to results.
        article = build_article(result[0], base_docid, result[1], None, False, vertical)
        ranked_results.append(article)

    # Generate UUID for query.
    query_id = str(uuid4())

    return SearchQueryResponse(query_id=query_id, response=ranked_results)


@router.post('/search/log/collapsed', response_model=None)
async def post_collapsed(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.collapsed,
        'result_id': data.result_id,
        'position': data.position,
        'timestamp': datetime.utcnow().isoformat()}))


@router.post('/search/log/expanded', response_model=None)
async def post_expanded(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.expanded,
        'result_id': data.result_id,
        'position': data.position,
        'timestamp': datetime.utcnow().isoformat()}))


@router.post('/search/log/clicked', response_model=None)
async def post_clicked(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.clicked,
        'result_id': data.result_id,
        'position': data.position,
        'timestamp': datetime.utcnow().isoformat()}))


def build_article(hit, id: str, score: float, paragraphs: List[str],
                  highlighted_abstract: bool, vertical: SearchVertical):
    doc = hit.lucene_document
    #print(doc.get("coordinates"))
    return SearchArticle(id=id,
                         abstract=doc.get('abstract'),
                         authors=get_author_field(doc, 'responsible_party'),
                         journal=doc.get('catalogue'),
                         publish_time=doc.get('publish_time'),
                         source = [doc.get('organisation')],
                         title=doc.get('title'),
                         url = doc.get("url"),
                         score=score,
                         paragraphs=["paragraph 1", "paragraph 2"],
                         highlighted_abstract = False,
                         has_related_articles=vertical == SearchVertical.cord19,
                         coordinates = doc.get("coordinates"))
