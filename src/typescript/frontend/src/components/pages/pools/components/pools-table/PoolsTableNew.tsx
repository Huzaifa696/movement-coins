"use client";

import React, { useRef, useState } from "react";
import { useMatchBreakpoints } from "hooks";
import { TableHeader } from "./components";
import { Table, Th, ThInner, HeaderTr, TBody } from "components";
import { StyledPoolsWrapper } from "./styled";
import { HEADERS_NEW, MOBILE_HEADERS } from "./constants";
import type { SortByPageQueryParams } from "lib/queries/sorting/types";
import type { OrderByStrings } from "@sdk/queries/const";
import { type PoolsData } from "../../ClientPoolsPage";
import TableRowDesktopNew from "./components/table-row-desktop/TableRowDesktopNew";

export interface PoolsTableProps {
  data: PoolsData[];
  index: number | undefined;
  sortBy: (sortBy: SortByPageQueryParams) => void;
  orderBy: (orderBy: OrderByStrings) => void;
  onSelect: (index: number) => void;
  onEnd: () => void;
}

const PoolsTableNew: React.FC<PoolsTableProps> = (props: PoolsTableProps) => {
  const { isMobile } = useMatchBreakpoints();
  const [selectedRow, setSelectedRow] = useState<number | undefined>(props.index);
  const [selectedSort, setSelectedSort] = useState<{
    col: SortByPageQueryParams;
    direction: OrderByStrings;
  }>({ col: "all_time_vol", direction: "desc" });

  const headers = isMobile ? MOBILE_HEADERS : HEADERS_NEW;
  const tableRef = useRef<HTMLTableSectionElement>(null);
  return (
    <StyledPoolsWrapper>
      <Table>
        <thead>
          <HeaderTr
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "50px",
              padding: "10px",
            }}
          >
            {headers.map((th, index) => (
              <Th
                width={th.width}
                key={index}
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                <ThInner>
                  <TableHeader
                    item={th}
                    isLast={HEADERS_NEW.length - 1 === index}
                    onClick={() => {
                      if (th.sortBy) {
                        if (th.sortBy === selectedSort.col) {
                          const newDirection = selectedSort.direction === "desc" ? "asc" : "desc";
                          props.orderBy(newDirection);
                          setSelectedSort({ col: selectedSort.col, direction: newDirection });
                        } else {
                          props.sortBy(th.sortBy as SortByPageQueryParams);
                          if (selectedSort.direction !== "desc") {
                            props.orderBy("desc");
                          }
                          setSelectedSort({
                            col: th.sortBy as SortByPageQueryParams,
                            direction: "desc",
                          });
                        }
                      }
                    }}
                  />
                </ThInner>
              </Th>
            ))}
          </HeaderTr>
        </thead>
        <TBody
          style={{ marginTop: "2rem" }}
          ref={tableRef}
          height={{ _: "calc(50vh)", laptopL: "calc(100vh - 353px)" }}
          maxHeight={{ _: "204px", tablet: "340px", laptopL: "unset" }}
          id="poolsTableBody"
          onScroll={() => {
            if (tableRef && tableRef.current) {
              if (
                tableRef.current.offsetHeight + tableRef.current.scrollTop >=
                tableRef.current.scrollHeight
              ) {
                props.onEnd();
              }
            }
          }}
        >
          {props.data.map((item, index) => (
            <TableRowDesktopNew
              key={index}
              item={item}
              selected={selectedRow == index}
              onClick={() => {
                setSelectedRow(index);
                props.onSelect(index);
              }}
            />
          ))}
        </TBody>
      </Table>
    </StyledPoolsWrapper>
  );
};

export default PoolsTableNew;
