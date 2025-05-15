import { useState, useEffect } from "react";

import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSessionType } from "@/types/domain/IGpsSessionType";
import {
	ILocationCountRange,
	LocationCountRanges,
} from "@/types/ILocationCountRange";

interface FilterPanelProps {
	onSessionTypeFilterChange: (sessionType: string | null) => void;
	onWaypointChange: (show: boolean) => void;
	onCheckpointChange: (show: boolean) => void;
	onLocationCountRangeChange: (range: string | null) => void;
}

export default function TrackFilterPanel({
	onSessionTypeFilterChange: onSessionTypeChange,
	onWaypointChange,
	onCheckpointChange,
	onLocationCountRangeChange,
}: FilterPanelProps) {
	const [loading, setLoading] = useState(true);
	const [sessionTypes, setSessionTypes] = useState<IGpsSessionType[]>([]);
	const [selectedSessionType, setSelectedSessionType] = useState<
		string | null
	>(null);
	const [selectedLocationCountRange, setSelectedLocationCountRange] =
		useState<string | null>(null);
	const [showWaypoints, setShowWaypoints] = useState(false);
	const [showCheckpoints, setShowCheckpoints] = useState(false);

	useEffect(() => {
		const fetchSessionTypes = async () => {
			setLoading(true);
			try {
				const sessionTypeService = new GpsSessionTypeService();
				const types = await sessionTypeService.getAllAsync();
				if (types.data && types.data.length > 0) {
					setSessionTypes(types.data!.map((type) => type));
				}
			} catch (error) {
				console.error("Error fetching filters:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSessionTypes();
	}, []);

	// Apply filters and notify parent component
	useEffect(() => {
		onSessionTypeChange(selectedSessionType);
		onLocationCountRangeChange(selectedLocationCountRange);
	}, [
		selectedSessionType,
		selectedLocationCountRange,
		onSessionTypeChange,
		onLocationCountRangeChange,
	]);

	const handleWaypointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setShowWaypoints(isChecked);
		onWaypointChange(isChecked);
	};

	const handleCheckpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setShowCheckpoints(isChecked);
		onCheckpointChange(isChecked);
	};

	// Handle session type selection
	const handleSessionTypeChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = e.target.value;
		setSelectedSessionType(value === "" ? null : value);
	};

	const handleLocationCountRangeChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = e.target.value;
		setSelectedLocationCountRange(value === "" ? null : value);
	};

	return (
		<div className="mb-4 p-4 rounded shadow" id="filter-panel">
			<h3 className="mb-3">Track Filters</h3>

			{loading ? (
				<p>Loading filters...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Session Type Filter */}
					<div>
						<label className="block text-sm font-medium mb-1">
							Session Type:
						</label>{" "}
						<select
							className="w-full p-2 border rounded"
							onChange={handleSessionTypeChange}
							value={selectedSessionType || ""}
						>
							<option value="">All Session Types</option>
							{sessionTypes.map((type) => (
								<option key={type.id} value={type.name}>
									{type.name}
								</option>
							))}
						</select>
					</div>
					<div className="invisible mb-1"></div>
					{/* Location Count Filter */}
					<div className="col-span-2">
						<label className="block text-sm font-medium mb-1">
							Location Count:
						</label>{" "}
						<select
							className="w-full p-2 border rounded"
							onChange={handleLocationCountRangeChange}
							value={selectedLocationCountRange || ""}
						>
							{LocationCountRanges.map((range) => (
								<option key={range.label} value={range.label}>
									{range.label}
								</option>
							))}
						</select>
					</div>
					<div className="invisible mb-1"></div>
					{/* Marker Type Filters */}
					<div className="col-span-2">
						<div className="flex space-x-4">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="waypoints"
									className="mr-2 h-4 w-4"
									checked={showWaypoints}
									onChange={handleWaypointChange}
								/>{" "}
								<label htmlFor="waypoints" className="text-sm">
									Show Waypoints
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									id="checkpoints"
									className="mr-2 h-4 w-4"
									checked={showCheckpoints}
									onChange={handleCheckpointChange}
								/>{" "}
								<label
									htmlFor="checkpoints"
									className="text-sm"
								>
									Show Checkpoints
								</label>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
