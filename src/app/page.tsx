"use client";

import TrackFilterPanel from "@/components/FilterPanel";
import { ILocationCountRange } from "@/types/ILocationCountRange";
import dynamic from "next/dynamic";
import { useState } from "react";

const LazyMap = dynamic(() => import("@/components/Map"), {
	ssr: false,
	loading: () => <p>Loading...</p>,
});

export default function Home() {
	const [sessionTypeFilter, setSessionTypeFilter] = useState<string | null>(
		null
	);
	const [showWaypoints, setShowWaypoints] = useState(false);
	const [showCheckpoints, setShowCheckpoints] = useState(false);
	const [locationCountRange, setLocationCountRange] = useState<string | null>(
		null
	);

	const handleSessionTypeChange = (sessionType: string | null) => {
		setSessionTypeFilter(sessionType);
	};

	const handleWaypointChange = (show: boolean) => {
		setShowWaypoints(show);
	};

	const handleCheckpointChange = (show: boolean) => {
		setShowCheckpoints(show);
	};

	const handleLocationCountRangeChange = (range: string | null) => {
		setLocationCountRange(range);
	};

	return (
		<main>
			<TrackFilterPanel
				onSessionTypeFilterChange={handleSessionTypeChange}
				onWaypointChange={handleWaypointChange}
				onCheckpointChange={handleCheckpointChange}
				onLocationCountRangeChange={handleLocationCountRangeChange}
			/>
			<LazyMap
				sessionTypeFilter={sessionTypeFilter}
				showWaypoints={showWaypoints}
				showCheckpoints={showCheckpoints}
				locationCountRange={locationCountRange}
			/>
		</main>
	);
}
