# Customer View Testing Guide

## Quick Start

### Access the Application
1. Ensure dev server is running: `npm run dev` (in `apps/frontend`)
2. Open browser to: **http://localhost:3000/shop**

## Test Scenarios

### 1. Product Search (Search Tab)

#### Test: Basic Search
1. Navigate to Search tab (should be default)
2. Type "manzana" in search box
3. ✅ Should show "Manzanas Rojas" product
4. ✅ Should display price, category, stock status, location

#### Test: Category Search
1. Type "frutas" in search box
2. ✅ Should show all fruit products (Manzanas, Bananas, Naranjas)

#### Test: Add to List
1. Search for "leche"
2. Click "Agregar" button
3. ✅ Badge counter in header should increment
4. ✅ List tab badge should show "1"

#### Test: View on Map
1. Search for any product
2. Click "Ver" button (map icon)
3. ✅ Should switch to Map tab
4. ✅ Product location should be visible on map

### 2. Shopping List (List Tab)

#### Test: View List
1. Add several products from Search tab
2. Navigate to List tab
3. ✅ All added products should appear
4. ✅ Progress bar should show 0%

#### Test: Check Items
1. Click checkbox on first item
2. ✅ Item should show strikethrough
3. ✅ Item should have reduced opacity
4. ✅ Progress bar should update
5. ✅ Completion percentage should increase

#### Test: Quantity Controls
1. Click "+" button on an item
2. ✅ Quantity should increase
3. ✅ Total items counter should update
4. Click "-" button
5. ✅ Quantity should decrease
6. ✅ Cannot go below 1

#### Test: Remove Item
1. Click trash icon on an item
2. ✅ Item should be removed from list
3. ✅ Counters should update

#### Test: View on Map from List
1. Click map pin icon on an item
2. ✅ Should switch to Map tab
3. ✅ Item should be highlighted (orange, animated)
4. Wait 3 seconds
5. ✅ Highlight should disappear

### 3. Supermarket Map (Map Tab)

#### Test: Map Display
1. Navigate to Map tab
2. ✅ Store layout should be visible
3. ✅ Shelves should be brown with labels (A, B, C, D)
4. ✅ Special zones should be colored (Produce=green, Deli=yellow, Bakery=pink)
5. ✅ Checkouts should be blue with "$" symbol
6. ✅ Entry/Exit should be green/red with "IN"/"OUT"

#### Test: User Avatar
1. Look for user icon on map
2. ✅ Should see blue circle with arrow
3. ✅ Should have animated pulse ring
4. ✅ Should have shadow

#### Test: Product Markers
1. Add products to shopping list
2. Navigate to Map tab
3. ✅ Blue dots should appear at product locations
4. ✅ Dots should show quantity number
5. Check off an item in list
6. Return to Map tab
7. ✅ Checked item marker should disappear

#### Test: Pan (Mouse)
1. Click and drag on map
2. ✅ Map should pan smoothly
3. ✅ Cursor should change to "grabbing"

#### Test: Zoom (Mouse Wheel)
1. Scroll mouse wheel up
2. ✅ Map should zoom in
3. Scroll mouse wheel down
4. ✅ Map should zoom out

#### Test: Zoom Buttons
1. Click "+" button (top-right)
2. ✅ Map should zoom in
3. Click "-" button
4. ✅ Map should zoom out

#### Test: Center on User
1. Pan map away from user
2. Click locate button (crosshair icon)
3. ✅ Map should center on user avatar

#### Test: Touch Gestures (Mobile/Tablet)
1. Touch and drag with one finger
2. ✅ Map should pan
3. Pinch with two fingers
4. ✅ Map should zoom in/out

### 4. Navigation

#### Test: Tab Switching
1. Click Search tab
2. ✅ Search view should display
3. ✅ Tab should be highlighted (blue background)
4. Click List tab
5. ✅ List view should display
6. ✅ Tab should be highlighted
7. Click Map tab
8. ✅ Map view should display
9. ✅ Tab should be highlighted

#### Test: Badge Counter
1. Add 3 products to list
2. ✅ List tab badge should show "3"
3. ✅ Header badge should show "3 items"
4. Remove 1 product
5. ✅ Badges should update to "2"

### 5. Chatbot Button

#### Test: Button Display
1. ✅ Floating button should be visible in bottom-right
2. ✅ Should have message icon
3. ✅ Should be above bottom navigation

#### Test: Button Click
1. Click chatbot button
2. ✅ Should show alert: "Chatbot feature coming soon! 🤖"

### 6. Responsive Design

#### Test: Mobile View (< 768px)
1. Resize browser to mobile width
2. ✅ Layout should adapt
3. ✅ Bottom navigation should be accessible
4. ✅ All buttons should be touch-friendly
5. ✅ Text should be readable

#### Test: Tablet View (768px - 1024px)
1. Resize browser to tablet width
2. ✅ Layout should scale appropriately
3. ✅ Map should use available space

### 7. Edge Cases

#### Test: Empty States
1. Visit shop page with no items in list
2. Navigate to List tab
3. ✅ Should show empty state with shopping cart icon
4. ✅ Should show helpful message

#### Test: Search No Results
1. Type "xyz123" in search
2. ✅ Should show "No se encontraron productos"
3. ✅ Should show suggestion to try different search

#### Test: Duplicate Products
1. Add same product twice
2. ✅ Quantity should increment instead of duplicating
3. ✅ Only one entry should exist in list

## Performance Checks

### Load Time
- ✅ Initial page load < 2 seconds
- ✅ Tab switching is instant
- ✅ Search results appear immediately

### Animations
- ✅ Transitions are smooth (60fps)
- ✅ No janky scrolling
- ✅ Pulse animation on user avatar is smooth

### Memory
- ✅ No memory leaks after extended use
- ✅ Map rendering doesn't slow down with many markers

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Accessibility

### Keyboard Navigation
1. Use Tab key to navigate
2. ✅ All interactive elements should be reachable
3. ✅ Focus indicators should be visible
4. Use Enter/Space to activate buttons
5. ✅ Actions should work

### Screen Reader
1. Enable screen reader
2. ✅ All buttons should have labels
3. ✅ Content should be announced properly

## Known Limitations

1. **User Position**: Currently static at entrance (30, 2)
   - Future: Real-time GPS/beacon tracking

2. **Route Planning**: Not yet implemented
   - Future: Optimal path calculation

3. **Chatbot**: Shows alert only
   - Future: Full chatbot integration

4. **Offline Mode**: Not implemented
   - Future: Service worker for offline support

## Success Criteria

All tests should pass with ✅ marks. If any test fails:
1. Note the issue
2. Check browser console for errors
3. Verify all files are saved
4. Restart dev server if needed

## Quick Smoke Test (2 minutes)

1. Open http://localhost:3000/shop
2. Search for "leche" and add to list
3. Go to List tab, check the item
4. Go to Map tab, verify user and markers visible
5. Click chatbot button
6. Switch between all tabs

If all above work, implementation is successful! ✅

---

**Last Updated**: 2026-05-16  
**Status**: Ready for Testing