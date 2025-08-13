import * as React from 'react';

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { cn } from '@/lib/utils';

// Tab filter interface
export interface TabFilterOption {
  value: string;
  label: string;
  filter?: (row: Row<any>) => boolean; // Optional custom filter function
  column?: string; // Column to filter on
  value_match?: any; // Value to match for automatic filtering
}

// Select filter interface
export interface SelectFilterOption {
  column: string; // The column to filter
  label: string; // Label for the select
  options: Array<{
    value: string;
    label: string;
    filter?: (row: Row<any>) => boolean; // Optional custom filter
    value_match?: any; // Value to match when no custom filter
  }>;
  defaultValue?: string;
}

// External pagination interface
export interface ExternalPagination {
  pageIndex: number;
  pageSize: number;
  total: number;
}

// External sorting interface
export interface ExternalSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// External filtering interface
export interface ExternalFiltering {
  searchFilter: string;
  tabFilter?: string;
  selectFilters?: Record<string, string>;
}

// Define Props Interface
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  title?: string; // Add title prop
  hideTitle?: boolean; // Add hideTitle prop
  tableHeight?: string | number; // Add tableHeight prop
  // Optional features flags
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  // External pagination props
  externalPagination?: boolean;
  pagination?: ExternalPagination;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  // External sorting props
  externalSorting?: boolean;
  sorting?: ExternalSorting;
  onSortingChange?: (sorting: ExternalSorting) => void;
  // External filtering props
  externalFiltering?: boolean;
  filtering?: ExternalFiltering;
  onFilteringChange?: (filtering: ExternalFiltering) => void;
  // Custom content areas
  toolbarContent?: React.ReactNode;
  selectionActionBar?: React.ReactNode | ((selectedRows: Row<TData>[]) => React.ReactNode);
  // New filtering options
  tabFilter?: {
    options: TabFilterOption[];
    defaultValue?: string;
  };
  selectFilters?: SelectFilterOption[];
  // Callbacks
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
  // New props for keyboard navigation
  onTableInit?: (table: any) => void;
  getRowProps?: (row: Row<TData>, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  // Add className for styling
  className?: string;
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  isLoading = false,
  title, // Default title
  hideTitle = false, // Default hideTitle
  enableFiltering = true,
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnVisibility = true,
  externalPagination = false,
  pagination,
  onPaginationChange,
  externalSorting = false,
  sorting,
  onSortingChange,
  externalFiltering = false,
  filtering,
  onFilteringChange,
  toolbarContent,
  selectionActionBar,
  onRowSelectionChange,
  tabFilter,
  selectFilters,
  onTableInit,
  getRowProps,
  className = '', // Default to empty string
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Internal pagination state (only used when external pagination is disabled)
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Use external pagination if provided, otherwise use internal state
  const currentPagination =
    externalPagination && pagination
      ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
      : internalPagination;

  // Calculate page count based on pagination mode
  const pageCount =
    externalPagination && pagination
      ? Math.ceil(pagination.total / pagination.pageSize)
      : undefined; // Let react-table calculate internally

  // Handle external filtering
  const currentGlobalFilter =
    externalFiltering && filtering ? filtering.searchFilter : globalFilter;

  // Handle external sorting
  const currentSorting =
    externalSorting && sorting
      ? [
          {
            id: sorting.sortBy,
            desc: sorting.sortOrder === 'desc',
          },
        ]
      : internalSorting;

  // Handle global filter changes
  const handleGlobalFilterChange = (value: string) => {
    if (externalFiltering && onFilteringChange) {
      onFilteringChange({
        searchFilter: value,
        tabFilter: activeTab,
        selectFilters: selectFilterValues,
      });
    } else {
      setGlobalFilter(value);
    }
  };

  // Handle sorting changes
  const handleSortingChange = (updater: any) => {
    if (externalSorting && onSortingChange) {
      if (typeof updater === 'function') {
        const newSorting = updater(currentSorting);
        if (newSorting.length > 0) {
          onSortingChange({
            sortBy: newSorting[0].id,
            sortOrder: newSorting[0].desc ? 'desc' : 'asc',
          });
        } else {
          // When sorting is cleared, reset to default sort
          onSortingChange({
            sortBy: 'created_at',
            sortOrder: 'desc',
          });
        }
      } else if (updater.length > 0) {
        onSortingChange({
          sortBy: updater[0].id,
          sortOrder: updater[0].desc ? 'desc' : 'asc',
        });
      } else {
        // When sorting is cleared, reset to default sort
        onSortingChange({
          sortBy: 'created_at',
          sortOrder: 'desc',
        });
      }
    } else {
      setInternalSorting(updater);
    }
  };

  // Ensure data is valid array
  const safeData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data;
  }, [data]);

  // Ensure columns is valid array
  const safeColumns = React.useMemo(() => {
    if (!columns || !Array.isArray(columns)) {
      return [];
    }
    return columns;
  }, [columns]);

  // Tab filter state
  const [activeTab, setActiveTab] = React.useState<string>(
    tabFilter?.defaultValue ||
      (tabFilter?.options && tabFilter.options?.length > 0 ? tabFilter.options[0]?.value : '') ||
      ''
  );

  // Select filters state
  const [selectFilterValues, setSelectFilterValues] = React.useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    if (selectFilters && Array.isArray(selectFilters)) {
      selectFilters.forEach(filter => {
        if (filter && filter.column) {
          initialValues[filter.column] = filter.defaultValue || 'all';
        }
      });
    }
    return initialValues;
  });

  // Apply initial tab filter on mount
  React.useEffect(() => {
    if (activeTab && activeTab !== 'all' && tabFilter?.options && !externalFiltering) {
      const selectedTab = tabFilter.options.find(tab => tab?.value === activeTab);
      if (selectedTab && selectedTab.column && selectedTab.value_match !== undefined) {
        setColumnFilters(prev => {
          // Remove any existing filters for this column
          const withoutThisColumn = prev.filter(filter => filter.id !== selectedTab.column);

          // Add the new filter
          return [
            ...withoutThisColumn,
            {
              id: selectedTab.column as string,
              value: selectedTab.value_match,
            },
          ];
        });
      }
    }
  }, [activeTab, tabFilter, externalFiltering]);

  // Sync tab filter and select filters with external filtering state
  React.useEffect(() => {
    if (externalFiltering && filtering) {
      if (filtering.tabFilter !== undefined) {
        setActiveTab(filtering.tabFilter);
      }
      if (filtering.selectFilters) {
        setSelectFilterValues(filtering.selectFilters);
      }
    }
  }, [externalFiltering, filtering]);

  // Handle row selection changes and propagate to parent if needed
  const handleRowSelectionChange = React.useCallback(
    (value: any) => {
      setRowSelection(value || {});
      if (onRowSelectionChange) {
        onRowSelectionChange(value || {});
      }
    },
    [onRowSelectionChange]
  );

  // Apply tab filters to global filter function
  const handleTabChange = (value: string) => {
    if (!value) return;

    setActiveTab(value);

    if (externalFiltering && onFilteringChange) {
      // For external filtering, pass the tab filter to the parent
      onFilteringChange({
        searchFilter: currentGlobalFilter || '',
        tabFilter: value,
        selectFilters: selectFilterValues,
      });
    } else {
      // For internal filtering, update column filters locally

      // If we've selected "all", clear any column filters that might have been set by tabs
      if (value === 'all') {
        // Find which columns might have been set by tab filters
        const tabColumns =
          tabFilter?.options?.filter(opt => opt?.column)?.map(opt => opt.column) || [];

        // Remove those column filters
        setColumnFilters(prev => prev.filter(filter => !tabColumns.includes(filter.id as string)));
        return;
      }

      // Otherwise, apply the specific filter for this tab
      if (tabFilter?.options && Array.isArray(tabFilter.options)) {
        const selectedTab = tabFilter.options.find(tab => tab?.value === value);
        if (selectedTab && selectedTab.column) {
          // Update column filters to include this tab's filter
          setColumnFilters(prev => {
            // Remove any existing filters for this column
            const withoutThisColumn = prev.filter(filter => filter.id !== selectedTab.column);

            // Add the new filter if there's a value to match
            if (selectedTab.value_match !== undefined) {
              return [
                ...withoutThisColumn,
                {
                  id: selectedTab.column as string,
                  value: selectedTab.value_match,
                },
              ];
            }

            return withoutThisColumn;
          });
        }
      }
    }
  };

  // Handle select filter changes
  const handleSelectFilterChange = (column: string, value: string) => {
    if (!column || !value) return;

    const newSelectFilterValues = { ...selectFilterValues, [column]: value };
    setSelectFilterValues(newSelectFilterValues);

    if (externalFiltering && onFilteringChange) {
      // For external filtering, pass the select filter to the parent
      onFilteringChange({
        searchFilter: currentGlobalFilter || '',
        tabFilter: activeTab,
        selectFilters: newSelectFilterValues,
      });
    } else {
      // For internal filtering, update column filters locally

      if (value === 'all') {
        // Remove this column filter
        setColumnFilters(prev => prev.filter(filter => filter.id !== column));
        return;
      }

      // Find the matching filter configuration
      const filterConfig = selectFilters?.find(f => f?.column === column);
      const filterOption = filterConfig?.options?.find(opt => opt?.value === value);

      if (filterOption) {
        // For a custom filter function, we need a different approach
        if (filterOption.filter) {
          // Store the value in columnFilters to trigger UI update,
          // but the actual filtering happens in the filterFn
          setColumnFilters(prev => {
            const withoutThisColumn = prev.filter(filter => filter.id !== column);
            return [...withoutThisColumn, { id: column, value }];
          });
        } else if (filterOption.value_match !== undefined) {
          // Apply the column filter using value_match for direct comparison
          setColumnFilters(prev => {
            const withoutThisColumn = prev.filter(filter => filter.id !== column);
            return [...withoutThisColumn, { id: column, value: filterOption.value_match }];
          });
        }
      }
    }
  };

  // Handle focus with animation timing
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsAnimating(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setIsAnimating(true);
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  // Handle Escape key to blur the input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  // Add selection column if enabled
  const tableColumns = React.useMemo(() => {
    const selectionColumn: ColumnDef<TData, TValue> | null = enableRowSelection
      ? {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={
                table?.getIsAllPageRowsSelected?.() ||
                (table?.getIsSomePageRowsSelected?.() && 'indeterminate')
              }
              onCheckedChange={value => table?.toggleAllPageRowsSelected?.(!!value)}
              aria-label='Select all'
              className='translate-y-[2px]' // Minor alignment adjustment
              onClick={e => e.stopPropagation()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row?.getIsSelected?.() || false}
              onCheckedChange={value => row?.toggleSelected?.(!!value)}
              aria-label='Select row'
              className='translate-y-[2px]' // Minor alignment adjustment
              onClick={e => e.stopPropagation()}
            />
          ),
          enableSorting: false,
          enableHiding: false,
        }
      : null;

    return selectionColumn ? [selectionColumn, ...safeColumns] : safeColumns;
  }, [safeColumns, enableRowSelection]);

  const table = useReactTable({
    data: safeData,
    columns: tableColumns,
    state: {
      sorting: enableSorting ? currentSorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      globalFilter: enableFiltering ? currentGlobalFilter : undefined,
      pagination: enablePagination ? currentPagination : undefined,
    },
    // Enable features conditionally based on props
    enableSorting: enableSorting,
    onSortingChange: enableSorting ? handleSortingChange : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,

    enableGlobalFilter: enableFiltering,
    onGlobalFilterChange: enableFiltering ? handleGlobalFilterChange : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,

    enableRowSelection: enableRowSelection,
    onRowSelectionChange: enableRowSelection ? handleRowSelectionChange : undefined,

    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,

    // Handle pagination changes
    onPaginationChange: enablePagination
      ? updater => {
          if (typeof updater === 'function') {
            const newPagination = updater(currentPagination);
            if (externalPagination && onPaginationChange) {
              onPaginationChange({
                pageIndex: newPagination.pageIndex,
                pageSize: newPagination.pageSize,
              });
            } else {
              setInternalPagination(newPagination);
            }
          } else {
            if (externalPagination && onPaginationChange) {
              onPaginationChange({
                pageIndex: updater.pageIndex,
                pageSize: updater.pageSize,
              });
            } else {
              setInternalPagination(updater);
            }
          }
        }
      : undefined,

    // For external modes, provide manual flags and page count
    manualPagination: externalPagination,
    manualSorting: externalSorting,
    manualFiltering: externalFiltering,
    pageCount: pageCount,
  });

  // Call onTableInit callback with the table instance
  React.useEffect(() => {
    if (onTableInit && table) {
      onTableInit(table);
    }
  }, [table, onTableInit]);

  // Get selected rows for action bar - only when row selection is enabled
  const selectedRows = React.useMemo(() => {
    if (!enableRowSelection || !table) return [];
    try {
      const filteredSelectedModel = table.getFilteredSelectedRowModel?.();
      return filteredSelectedModel?.rows || [];
    } catch (error) {
      console.warn('Error getting selected rows:', error);
      return [];
    }
  }, [enableRowSelection, table]);

  // Calculate pagination info
  const totalPages =
    externalPagination && pagination
      ? Math.ceil(pagination.total / pagination.pageSize)
      : table?.getPageCount?.() || 1;

  // Helper function to generate page numbers to display
  const getPageNumbers = (currentPage: number, totalPages: number, maxButtons: number = 10) => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxButtons) {
      // Show all pages if total is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, currentPage - 3);
      const end = Math.min(totalPages - 1, currentPage + 3);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers(currentPagination.pageIndex + 1, totalPages);

  // Handle page number click
  const handlePageClick = (page: number) => {
    if (externalPagination && onPaginationChange) {
      onPaginationChange({
        pageIndex: page - 1, // Convert to 0-based index
        pageSize: currentPagination.pageSize,
      });
    } else {
      table?.setPageIndex?.(page - 1);
    }
  };

  // Show skeleton if required data is missing or invalid
  if (!safeColumns?.length || !Array.isArray(safeData)) {
    return renderSkeletonTable(
      10,
      safeColumns,
      enablePagination,
      !!tabFilter,
      enableFiltering,
      enableColumnVisibility,
      !!toolbarContent,
      selectFilters
    );
  }

  const hasSelectedRows = selectedRows?.length > 0;

  // Safe table method calls with fallbacks
  const getTableRows = () => {
    try {
      return table?.getRowModel?.()?.rows || [];
    } catch (error) {
      console.warn('Error getting table rows:', error);
      return [];
    }
  };

  const getHeaderGroups = () => {
    try {
      return table?.getHeaderGroups?.() || [];
    } catch (error) {
      console.warn('Error getting header groups:', error);
      return [];
    }
  };

  const getAllColumns = () => {
    try {
      return table?.getAllColumns?.() || [];
    } catch (error) {
      console.warn('Error getting all columns:', error);
      return [];
    }
  };

  // --- Actual Table Rendering ---
  return (
    <Card className={cn('w-full overflow-hidden select-none', className)}>
      {/* --- Top Section (Tabs and title area) --- */}
      {!hideTitle && title && (
        <div className='px-6 pt-6 border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-4 mb-4'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            {/* Custom Toolbar Content Area */}
            {toolbarContent && (
              <div className='ml-auto flex items-center gap-2'>{toolbarContent}</div>
            )}
          </div>
        </div>
      )}

      {/* --- Toolbar --- */}
      <div className='flex flex-wrap items-center py-4 gap-2 px-6 select-none'>
        {/* Global search with animated width */}
        {enableFiltering && (
          <div
            className={`transition-all duration-200 ease-in-out ${
              isInputFocused ? 'w-full' : 'w-[240px]'
            }`}
          >
            <Input
              ref={inputRef}
              placeholder='Search...'
              value={currentGlobalFilter ?? ''}
              onChange={event => handleGlobalFilterChange(event.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onClick={e => e.stopPropagation()}
              className='w-full h-full'
            />
          </div>
        )}

        {tabFilter && tabFilter.options && Array.isArray(tabFilter.options) && (
          <div
            className={`flex flex-wrap items-center gap-4 ml-2  duration-200 ${
              isInputFocused || isAnimating ? 'opacity-0 absolute ' : 'opacity-100'
            }`}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList onClick={e => e.stopPropagation()}>
                {tabFilter.options.map(tab =>
                  tab && tab.value && tab.label ? (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      onClick={e => e.stopPropagation()}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ) : null
                )}
              </TabsList>
            </Tabs>
          </div>
        )}
        <div className='flex-grow' />

        {/* Select filters */}
        {selectFilters &&
          Array.isArray(selectFilters) &&
          selectFilters.map(filter =>
            filter && filter.column && filter.label ? (
              <div
                key={filter.column}
                className={`w-full md:w-[180px] transition-opacity duration-200 ${
                  isInputFocused || isAnimating ? 'opacity-0 absolute' : 'opacity-100'
                }`}
              >
                <Select
                  value={selectFilterValues[filter.column] || 'all'}
                  onValueChange={value => handleSelectFilterChange(filter.column, value)}
                >
                  <SelectTrigger onClick={e => e.stopPropagation()}>
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent onClick={e => e.stopPropagation()}>
                    <SelectItem value='all' onClick={e => e.stopPropagation()}>
                      All {filter.label}
                    </SelectItem>
                    {filter.options &&
                      Array.isArray(filter.options) &&
                      filter.options.map(option =>
                        option && option.value && option.label ? (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            onClick={e => e.stopPropagation()}
                          >
                            {option.label}
                          </SelectItem>
                        ) : null
                      )}
                  </SelectContent>
                </Select>
              </div>
            ) : null
          )}

        {/* Column Visibility */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className={`ml-auto ${!toolbarContent ? '' : 'ml-2'} transition-opacity duration-200 ${
                  isInputFocused || isAnimating ? 'opacity-0 absolute' : 'opacity-100'
                }`}
                onClick={e => e.stopPropagation()}
              >
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' onClick={e => e.stopPropagation()}>
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getAllColumns()
                .filter(column => column?.getCanHide?.())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column?.getIsVisible?.() || false}
                      onCheckedChange={value => column?.toggleVisibility?.(!!value)}
                      onClick={e => e.stopPropagation()}
                    >
                      {typeof column.columnDef?.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* --- Table --- */}
      <div className=''>
        {/* Selection Action Bar - render when items are selected */}
        {hasSelectedRows && selectionActionBar && (
          <div className='p-2 bg-blue-50 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-700 flex items-center justify-between'>
            <span className='ml-2 text-blue-700 dark:text-blue-300'>
              {selectedRows?.length || 0} selected
            </span>
            <div className='flex space-x-2'>
              {typeof selectionActionBar === 'function'
                ? selectionActionBar(selectedRows)
                : selectionActionBar}
            </div>
          </div>
        )}

        <div className='border-b overflow-hidden'>
          <div className='overflow-auto'>
            <Table>
              <TableHeader className='border-t sticky top-0 bg-background z-10'>
                {getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      // Check if sorting is enabled for this column
                      const canSort = enableSorting && header.column?.getCanSort?.();
                      return (
                        <TableHead
                          key={header.id}
                          className='px-4 select-none'
                          style={{
                            width: header.getSize() !== 150 ? header.getSize() : undefined,
                          }}
                        >
                          <div className='flex items-center gap-2'>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, {
                                  // Pass context for header rendering
                                  ...header.getContext(),
                                  // Custom context additions if needed
                                  toggleSorting: header.column?.getToggleSortingHandler?.(),
                                  canSort: canSort,
                                  sortDirection: header.column?.getIsSorted?.(),
                                })}
                            {/* Single sorting icon that changes based on state */}
                            {canSort && (
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={e => {
                                  e.stopPropagation();
                                  header.column?.getToggleSortingHandler?.()?.(e);
                                }}
                              >
                                {header.column?.getIsSorted?.() === 'asc' ? (
                                  <ArrowUp className='h-4 w-4' />
                                ) : header.column?.getIsSorted?.() === 'desc' ? (
                                  <ArrowDown className='h-4 w-4' />
                                ) : (
                                  <ArrowUpDown className='h-4 w-4' />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Show skeleton rows while loading
                  Array.from({ length: currentPagination.pageSize }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      {tableColumns.map((_, cellIndex) => (
                        <TableCell key={`loading-cell-${index}-${cellIndex}`}>
                          <Skeleton className='h-5 w-full' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : getTableRows()?.length ? (
                  getTableRows().map((row, index) => {
                    // Apply custom row props if provided
                    const rowPropsFromHook = getRowProps ? getRowProps(row, index) : {};

                    return (
                      <TableRow
                        key={row.id}
                        data-state={
                          enableRowSelection && row?.getIsSelected?.() ? 'selected' : undefined
                        }
                        {...rowPropsFromHook}
                      >
                        {row?.getVisibleCells?.()?.map(cell => (
                          <TableCell
                            key={cell.id}
                            className='select-none'
                            style={{
                              width:
                                cell.column?.getSize?.() !== 150
                                  ? cell.column?.getSize?.()
                                  : undefined,
                            }}
                          >
                            <div
                              onClick={e => {
                                // Only stop propagation if the click target is an interactive element
                                if (
                                  e.target instanceof Element &&
                                  (e.target.closest('button') ||
                                    e.target.closest('[role="button"]') ||
                                    e.target.closest('[role="menuitem"]') ||
                                    e.target.closest('select') ||
                                    e.target.closest('input') ||
                                    e.target.closest('a'))
                                ) {
                                  e.stopPropagation();
                                }
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </TableCell>
                        )) || null}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableColumns?.length || 1} // Use calculated columns length
                      className='h-24 text-center select-none'
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- Pagination --- */}
      {enablePagination && (
        <div className='flex items-center justify-between space-x-2 py-4 px-6'>
          {/* Row Selection Info */}
          {enableRowSelection && (
            <div className='flex-1 text-sm text-muted-foreground'>
              {selectedRows?.length || 0} of{' '}
              {(() => {
                try {
                  if (externalPagination && pagination) {
                    return pagination.total;
                  }
                  return table?.getFilteredRowModel?.()?.rows?.length || 0;
                } catch {
                  return 0;
                }
              })()}{' '}
              selected
            </div>
          )}
          {!enableRowSelection && (
            <div className='flex-1 text-sm text-muted-foreground'>
              {externalPagination && pagination ? (
                <>
                  Showing {(pagination.pageIndex * pagination.pageSize + 1).toLocaleString()}-
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    pagination.total
                  ).toLocaleString()}{' '}
                  of {pagination.total.toLocaleString()} total
                </>
              ) : (
                `Total ${table?.getFilteredRowModel?.()?.rows?.length || 0} items`
              )}
            </div>
          )}
          {/* Pagination Controls */}
          <div className='flex items-center space-x-2'>
            {/* Navigation Buttons */}
            <div className='flex items-center space-x-1'>
              {/* Previous Button */}
              <Button
                variant='outline'
                size='sm'
                onClick={e => {
                  e.stopPropagation();
                  if (externalPagination && onPaginationChange) {
                    onPaginationChange({
                      pageIndex: Math.max(0, currentPagination.pageIndex - 1),
                      pageSize: currentPagination.pageSize,
                    });
                  } else {
                    table?.previousPage?.();
                  }
                }}
                disabled={currentPagination.pageIndex === 0}
              >
                Previous
              </Button>

              {/* Page Number Buttons */}
              <div className='hidden sm:flex items-center space-x-1'>
                {pageNumbers.map((pageNum, index) => (
                  <React.Fragment key={`page-${index}`}>
                    {pageNum === '...' ? (
                      <span className='px-2 text-sm text-gray-500'>...</span>
                    ) : (
                      <Button
                        variant={
                          currentPagination.pageIndex === (pageNum as number) - 1
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          handlePageClick(pageNum as number);
                        }}
                        className='min-w-[40px]'
                      >
                        {pageNum}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Page indicator for mobile */}
              <div className='sm:hidden px-2 text-sm text-gray-600'>
                {currentPagination.pageIndex + 1} / {totalPages}
              </div>

              {/* Next Button */}
              <Button
                variant='outline'
                size='sm'
                onClick={e => {
                  e.stopPropagation();
                  if (externalPagination && onPaginationChange) {
                    onPaginationChange({
                      pageIndex: Math.min(totalPages - 1, currentPagination.pageIndex + 1),
                      pageSize: currentPagination.pageSize,
                    });
                  } else {
                    table?.nextPage?.();
                  }
                }}
                disabled={
                  externalPagination && pagination
                    ? currentPagination.pageIndex >= totalPages - 1
                    : !table?.getCanNextPage?.()
                }
              >
                Next
              </Button>
            </div>

            {/* Rows per page selector - moved to the right end */}
            <div className='flex items-center space-x-2'>
              <Select
                value={`${currentPagination.pageSize}`}
                onValueChange={value => {
                  const newPageSize = Number(value);
                  if (externalPagination && onPaginationChange) {
                    onPaginationChange({
                      pageIndex: 0, // Reset to first page when changing page size
                      pageSize: newPageSize,
                    });
                  } else {
                    table?.setPageSize?.(newPageSize);
                  }
                }}
              >
                <SelectTrigger className='h-8 w-[70px]' onClick={e => e.stopPropagation()}>
                  <SelectValue placeholder={currentPagination.pageSize} />
                </SelectTrigger>
                <SelectContent side='top' onClick={e => e.stopPropagation()}>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem
                      key={pageSize}
                      value={`${pageSize}`}
                      onClick={e => e.stopPropagation()}
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// Skeleton rendering helper function
const renderSkeletonTable = (
  rowCount = 10,
  columns: any[] = [],
  enablePagination = true,
  tabFilter = false,
  enableFiltering = true,
  enableColumnVisibility = true,
  toolbarContent = false,
  selectFilters: any[] = []
) => (
  <div className='space-y-2'>
    {/* Skeleton Toolbar */}
    <div className='flex items-center py-4 gap-2'>
      {tabFilter && <Skeleton className='h-10 w-[250px]' />}
      {enableFiltering && <Skeleton className='h-10 w-[250px]' />}
      {selectFilters?.map((_, i) => (
        <Skeleton key={`select-skeleton-${i}`} className='h-10 w-[180px]' />
      ))}
      {toolbarContent && <Skeleton className='h-10 w-[100px] ml-auto' />}
      {enableColumnVisibility && <Skeleton className='h-10 w-[80px] ml-auto' />}
    </div>
    {/* Skeleton Table */}
    <div className='rounded-md border'>
      <div className='overflow-auto'>
        <Table>
          <TableHeader className='border-t sticky top-0 bg-background z-10'>
            {columns?.map((_, headerIndex) => (
              <TableRow key={`skeleton-header-${headerIndex}`}>
                {Array.from({ length: columns?.length || 1 }).map((_, cellIndex) => (
                  <TableHead key={`skeleton-header-cell-${cellIndex}`}>
                    <Skeleton className='h-5 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            )) || (
              <TableRow>
                <TableHead>
                  <Skeleton className='h-5 w-full' />
                </TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array.from({ length: columns?.length || 1 }).map((_, cellIndex) => (
                  <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    {/* Skeleton Pagination */}
    {enablePagination && (
      <div className='flex items-center justify-between space-x-2 py-4'>
        <Skeleton className='h-8 w-[150px]' /> {/* Rows selected text */}
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-8 w-[120px]' /> {/* Rows per page */}
          <div className='flex items-center space-x-1'>
            <Skeleton className='h-8 w-12' /> {/* Previous button */}
            <Skeleton className='h-8 w-10' /> {/* Page 1 */}
            <Skeleton className='h-8 w-10' /> {/* Page 2 */}
            <Skeleton className='h-8 w-10' /> {/* Page 3 */}
            <Skeleton className='h-8 w-12' /> {/* Next button */}
          </div>
        </div>
      </div>
    )}
  </div>
);
