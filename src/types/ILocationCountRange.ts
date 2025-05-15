export interface ILocationCountRange {
	min: number;
	max: number | null; // null means no upper limit
	label: string;
}

export const LocationCountRanges: ILocationCountRange[] = [
	{ min: 0, max: null, label: "All locations" },
	{ min: 0, max: 10, label: "0-10 locations" },
	{ min: 11, max: 100, label: "11-100 locations" },
	{ min: 101, max: 300, label: "101-300 locations" },
	{ min: 301, max: null, label: "300+ locations" },
];
