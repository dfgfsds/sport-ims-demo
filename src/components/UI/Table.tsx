import React from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  sortBy,
  sortOrder,
  onSort
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [internalSortBy, setInternalSortBy] = React.useState<string | undefined>(undefined);
  const [internalSortOrder, setInternalSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col.key])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data, columns]);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    let sortKey = sortBy ?? internalSortBy;
    let order = sortOrder ?? internalSortOrder;
    if (!sortKey) return filteredData;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [filteredData, columns, sortBy, sortOrder, internalSortBy, internalSortOrder]);

  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData?.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const resetTable = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setRowsPerPage(10);
    onSearch?.('');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search Input */}
      {searchable && (
        // <div className="p-4 border-b border-gray-200">
        //   <div className="relative max-w-md">
        //     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        //     <input
        //       type="text"
        //       placeholder={searchPlaceholder}
        //       value={searchQuery}
        //       onChange={(e) => handleSearch(e.target.value)}
        //       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        //     />
        //   </div>
        // </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={resetTable}
            className="text-sm text-blue-600 hover:underline px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
          >
            Clear Filter
          </button>
        </div>

      )}

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => {
                    if (!column.sortable) return;
                    if (onSort) {
                      onSort(column.key);
                    } else {
                      if (internalSortBy === column.key) {
                        setInternalSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setInternalSortBy(column.key);
                        setInternalSortOrder('asc');
                      }
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && ((sortBy ?? internalSortBy) === column.key) && (
                      (sortOrder ?? internalSortOrder) === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No data */}
      {filteredData?.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No data available
        </div>
      )}

      {/* Pagination */}
      {filteredData?.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          {/* Rows per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </select>
          </div>

          {/* Page controls */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
