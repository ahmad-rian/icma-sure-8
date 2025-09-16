# Pagination "Show All" Feature

## Overview
Added pagination feature with "Show All" option to display all abstract submissions on a single page, making it easier to select and export all data without pagination limits.

## Features Added

### 1. Backend Changes (`AbstractSubmissionController.php`)
- **Per Page Parameter**: Added support for `per_page` query parameter
- **"All" Option**: When `per_page=all`, returns all records without pagination
- **Validation**: Limits per_page to reasonable numbers (5-500) to prevent performance issues
- **Backward Compatibility**: Defaults to 15 per page if no parameter provided

### 2. Frontend Changes (`Index.tsx`)
- **Per Page Dropdown**: Added Select component with options:
  - 15 per page (default)
  - 25 per page  
  - 50 per page
  - 100 per page
  - 📊 Show All
- **Smart UI Updates**:
  - Modified pagination info text for "Show All" mode
  - Hidden pagination controls when showing all data
  - Added visual indicators when "Show All" is active
  - Loading indicator during page changes

### 3. Export Enhancement
- **Select All Functionality**: When "Show All" is active, users can select all visible data
- **Visual Feedback**: Shows total count (e.g., "5 terpilih dari 25 total")
- **Export Ready**: Excel export works with all selected submissions regardless of pagination

## Usage

### For Users:
1. **Change Page Size**: Use dropdown next to status filter
2. **Show All Data**: Select "📊 Show All" from dropdown
3. **Export All**: 
   - Choose "Show All"
   - Click checkbox to select all
   - Click "Export Excel" to download all data

### Technical Details:
- **URL Parameter**: `?per_page=all` 
- **Performance**: Backend limits max per_page to 500 for safety
- **State Management**: Uses Inertia.js preserveState for smooth navigation
- **Loading States**: Shows loading indicators during data fetching

## Benefits
1. **Easy Export**: Users can export all submissions without manual pagination
2. **Better UX**: Clear visual feedback about data selection
3. **Performance Safe**: Backend validation prevents excessive queries
4. **Flexible**: Multiple page size options for different use cases
5. **Backward Compatible**: Existing functionality remains unchanged
