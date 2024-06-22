
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination, CursorPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000


class LimitOffsetResultsSetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    max_limit = 100


class CursorResultsSetPagination(CursorPagination):
    page_size = 10
    ordering = '-created'
    page_size_query_param = 'page_size'
