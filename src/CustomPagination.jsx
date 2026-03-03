import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Pagination = styled.div`
  width: fit-content;
  margin: auto;
`;

const PaginationList = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.color.surface.primary};
  padding: ${({ theme }) => `${theme.spacing.xxsmall}`};
  border-radius: ${({ theme }) => `${theme.spacing.large}`};
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
`;

const sharedItemStyles = css`
  list-style: none;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.color.text.title};
  font-size: 18px;
  font-weight: 600;
  line-height: ${({ theme }) => `${theme.spacing.large}`};
`;

const PaginationItem = styled.li`
  ${sharedItemStyles};
`;

const PaginationNumber = styled.button`
  ${sharedItemStyles};
  margin: 0 3px;
  border-radius: 50%;
  height: ${({ theme }) => `${theme.spacing.xlarge}`};
  width: ${({ theme }) => `${theme.spacing.xlarge}`};
  line-height: ${({ theme }) => `${theme.spacing.xlarge}`};

  &.first {
    margin: 0px 3px 0 -5px;
  }

  &.last {
    margin: 0px -5px 0 3px;
  }

  &.active {
    background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
    color: ${({ theme }) => theme.color.text.reversed};
  }
`;

const PaginationDots = styled.span`
  ${sharedItemStyles};
  font-size: 22px;
  cursor: default;
`;

const PaginationButton = styled.button`
  ${sharedItemStyles};
  padding: ${({ theme }) =>
    `${theme.spacing.xxxsmall} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => `${theme.spacing.xlarge}`};

  &.disableButton {
    color: ${({ theme }) => theme.color.text.disabled};
  }
`;

const CustomPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const generatePageNumbers = () => {
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );

    if (totalPages > 3) {
      if (currentPage > 2) {
        pageNumbers.splice(1, 0, '...');
      }

      if (currentPage < totalPages - 1) {
        pageNumbers.splice(-1, 0, '...');
      }
    }

    return pageNumbers.filter(page => {
      if (totalPages <= 3) {
        return page >= 1;
      }

      if (page === '...') {
        return true; // Keep the ellipsis
      }

      // Show the first page, the ellipsis, the current page, and the last page
      return (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      );
    });
  };

  return (
    <Pagination className={className}>
      <PaginationList>
        <PaginationItem
          className="btn prev"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <PaginationButton className={currentPage === 1 && 'disableButton'}>
            <i className="fas fa-angle-left" /> {t('pagination.previous')}
          </PaginationButton>
        </PaginationItem>

        {generatePageNumbers().map((page, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`page=${page};index=${index}`}>
            {page === '...' ? (
              <PaginationDots>
                <span>...</span>
              </PaginationDots>
            ) : (
              <PaginationNumber
                className={`numb ${currentPage === page && 'active'}`}
                onClick={() => onPageChange(page)}
                aria-label={t('pagination.go_to_page', { page })}
                title={t('pagination.page', { page, total: totalPages })}
              >
                <span>{page}</span>
              </PaginationNumber>
            )}
          </React.Fragment>
        ))}

        <PaginationItem
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          <PaginationButton
            className={totalPages === currentPage && 'disableButton'}
          >
            {t('pagination.next')} <i />
          </PaginationButton>
        </PaginationItem>
      </PaginationList>
    </Pagination>
  );
};

export default CustomPagination;
