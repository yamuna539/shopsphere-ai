import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (
    let page = 1;
    page <= totalPages;
    page += 1
  ) {
    pages.push(page);
  }

  return (
    <nav
      className="shopsphere-pagination"
      aria-label="Product pagination"
    >

      <button
        type="button"
        className="shopsphere-pagination-button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        <FaChevronLeft />

        <span>
          Previous
        </span>
      </button>

      <div className="shopsphere-page-numbers">

        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={`shopsphere-page-number ${
              page === currentPage
                ? "active"
                : ""
            }`}
            onClick={() =>
              onPageChange(page)
            }
            aria-current={
              page === currentPage
                ? "page"
                : undefined
            }
          >
            {page}
          </button>
        ))}

      </div>

      <button
        type="button"
        className="shopsphere-pagination-button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        <span>
          Next
        </span>

        <FaChevronRight />
      </button>

    </nav>
  );
};

export default Pagination;