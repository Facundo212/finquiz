import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { cn } from '@/lib/utils';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function CustomPagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (pagination.prevPage) onPageChange(pagination.prevPage);
            }}
            isActive={!!pagination.prevPage}
            tabIndex={!pagination.prevPage ? -1 : undefined}
            className={cn({ 'opacity-50 cursor-not-allowed': !pagination.prevPage })}
          />
        </PaginationItem>
        {pagination.currentPage > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
          let pageNum;
          if (pagination.currentPage === 1) {
            pageNum = i + 1;
          } else if (pagination.currentPage === pagination.totalPages) {
            pageNum = pagination.totalPages - 2 + i;
          } else {
            pageNum = pagination.currentPage - 1 + i;
          }

          if (pageNum < 1 || pageNum > pagination.totalPages) return null;

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNum !== pagination.currentPage) {
                    onPageChange(pageNum);
                  }
                }}
                isActive={pageNum === pagination.currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {pagination.currentPage < pagination.totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (pagination.nextPage) onPageChange(pagination.nextPage);
            }}
            isActive={!!pagination.nextPage}
            tabIndex={!pagination.nextPage ? -1 : undefined}
            className={cn({ 'opacity-50 cursor-not-allowed': !pagination.nextPage })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
