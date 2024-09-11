import { useState } from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
export function Pagination({ itemsPerPage, totalItems, paginate }: any) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const [activePage, setActivePage] = useState(1);

  const handlePageClick = (pageNumber: number) => {
    setActivePage(pageNumber);
    paginate(pageNumber);
  };

  return (
    <nav>
      <BootstrapPagination className="pagination">
        {pageNumbers.map((number) => (
          <BootstrapPagination.Item
            key={number}
            className="page-item"
            active={number === activePage}
            onClick={() => {
              handlePageClick(number);
              paginate(number);
            }}
            linkStyle={{ color: "black", backgroundColor: "white" }}
          >
            <span style={{ color: "black", backgroundColor: "white" }}>
              {number}
            </span>
          </BootstrapPagination.Item>
        ))}
      </BootstrapPagination>
    </nav>
  );
}
