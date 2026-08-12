import { IAnalyticReport } from '@uspacy/sdk/lib/models/analytics';
import { v4 as uuidv4 } from 'uuid';

export const findPlacement = (currentState, newItemWidth, newItemHeight, cols = 12) => {
	const items = (currentState || []).filter(({ w, h }) => w > 0 && h > 0);

	// Find the maximum Y coordinate
	const maxY = Math.max(...items.map(({ y, h }) => y + h), 0);

	// Create a 2D grid (`rows` rows, `cols` columns), where `false` means a free cell,
	// and `true` means an occupied cell. The grid always covers every existing item
	// plus enough free rows below for the new one.
	const rows = Math.max(10, maxY + newItemHeight);
	const grid = Array.from({ length: rows }, () => Array(cols).fill(false));

	// Fill the grid with data about the current elements (occupied cells).
	items.forEach(({ x, y, w, h }) => {
		for (let i = 0; i < h; i++) {
			// Iterate over the height of the element
			for (let j = 0; j < w; j++) {
				// Iterate over the width of the element
				if (grid[y + i]?.[x + j] === undefined) continue; // Skip cells outside the grid

				grid[y + i][x + j] = true; // Mark the cells occupied by this element
			}
		}
	});

	// Search for a place to fit the new element within the grid.
	for (let row = 0; row < grid.length; row++) {
		// Iterate over the rows
		for (let col = 0; col <= cols - newItemWidth; col++) {
			// Iterate over the columns
			let fits = true; // Assume the new element can fit here

			// Check if the new element fits in the current position.
			for (let i = 0; i < newItemHeight; i++) {
				// Iterate over the height of the new element
				for (let j = 0; j < newItemWidth; j++) {
					// Iterate over the width of the new element
					if (grid[row + i]?.[col + j]) {
						// If any cell is occupied
						fits = false; // The element does not fit here
						break; // Stop checking further for this position
					}
				}
				if (!fits) break; // If it doesn't fit, move to the next position
			}

			// If the element fits, return its position.
			if (fits) return { x: col, y: row };
		}
	}

	// If no space is found in the grid, place the new element below the lowest occupied position.
	return { x: 0, y: maxY }; // Place the element at the next available row
};

export const getMinSize = (chartType: IAnalyticReport['chart_type']) => {
	switch (chartType) {
		case 'numeric': {
			return { minW: 3, minH: 1 };
		}
		case 'donut':
		case 'pie': {
			return { minW: 3, minH: 2 };
		}
		default: {
			return { minW: 4, minH: 2 };
		}
	}
};

export const removeReportFromLayout = (layout, reportId) => layout.filter((item) => item.report_id !== reportId);

export const addReportToLayout = (layout, reportData) => {
	const chartLimitSize = getMinSize(reportData.chart_type);
	const { x, y } = findPlacement(layout, chartLimitSize.minW, chartLimitSize.minH);
	const newItem = {
		report_id: reportData.id,
		x,
		y,
		report: reportData,
		i: uuidv4(),
		w: chartLimitSize.minW,
		h: chartLimitSize.minH,
		maxH: 5,
		...chartLimitSize,
	};
	return [...(layout || []), newItem];
};
