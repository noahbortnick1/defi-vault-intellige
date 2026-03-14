from abc import ABC, abstractmethod
from typing import List
from schemas.vault import NormalizedVault


class BaseAdapter(ABC):
    """Base adapter interface for protocol data sources"""
    
    @abstractmethod
    def fetch_vaults(self) -> List[NormalizedVault]:
        """Fetch and normalize vault data from source"""
        pass
    
    @abstractmethod
    def get_source_name(self) -> str:
        """Return the name of this data source"""
        pass
