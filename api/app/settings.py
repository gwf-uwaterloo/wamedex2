from pathlib import Path
import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    testing: bool = False
    development: bool = True
    log_path: str = 'logs/'

    # Anserini searcher settings
    iso19115_index_path: str = 'index/iso19115'
    max_docs: int = 96
    bm25_k1: float = 0.4
    bm25_b: float = 0.9
    rm3: bool = False
    rm3_fb_terms: int = 10
    rm3_fb_docs: int = 10
    rm3_original_query_weight: float = 0.5

    # Paragraph highlighting
    highlight = True
    highlight_max_paragraphs: int = 30

    # Response settings
    max_paragraphs_per_doc = 2

    class Config:
        env_file = '.env'


settings = Settings()
