import "leaflet/dist/leaflet.css";

import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { ITrack } from "@/types/ITrack";
import { TrackService } from "@/services/GpsTrackService";
import React from "react";
import { LocationCountRanges } from "@/types/ILocationCountRange";

interface MapProps {
	sessionTypeFilter: string | null;
	showWaypoints: boolean;
	showCheckpoints: boolean;
	locationCountRange: string | null;
}

export default function Map({
	sessionTypeFilter,
	showWaypoints,
	showCheckpoints,
	locationCountRange,
}: MapProps) {
	const position = L.latLng(58.8, 25.4);

	const [tracks, setTracks] = useState<ITrack[]>([]);
	const [loading, setLoading] = useState(true);

	// Create icons
	const startIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	const endIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	const waypointIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	const checkpointIcon = new L.Icon({
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	// Fix for default icon not displaying
	useEffect(() => {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "/leaflet/marker-icon-2x.png",
			iconUrl: "/leaflet/marker-icon.png",
			shadowUrl: "/leaflet/marker-shadow.png",
		});
	}, []);

	// Fetch tracks and set up interval for updates
	useEffect(() => {
		const fetchTracks = async () => {
			setLoading(true);
			try {
				const trackService = new TrackService();
				const allTracks = await trackService.getAllAsync();

				let filteredTracks = allTracks;

				if (sessionTypeFilter) {
					filteredTracks = allTracks.filter((track) => {
						try {
							const sessionTypeObj =
								typeof track.session.gpsSessionType === "string"
									? JSON.parse(track.session.gpsSessionType)
									: track.session.gpsSessionType;

							return sessionTypeObj.en === sessionTypeFilter;
						} catch (error) {
							console.error(
								"Error parsing track session type:",
								error
							);
							return false;
						}
					});
				}

				if (locationCountRange) {
					try {
						const range = LocationCountRanges.find(
							(range) => range.label === locationCountRange
						);

						filteredTracks = filteredTracks.filter((track) => {
							let isInRange = false;
							isInRange =
								track.session.gpsLocationsCount >= range!.min;
							if (range!.max != null) {
								return (
									isInRange &&
									track.session.gpsLocationsCount <=
										range!.max
								);
							}
						});
					} catch (error) {
						console.error(
							"Error filtering tracks by location count range:",
							error
						);
						return false;
					}
				}

				setTracks(filteredTracks);
			} catch (error) {
				console.error("Error fetching tracks:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTracks();

		const intervalId = setInterval(fetchTracks, 30000);
		return () => clearInterval(intervalId);
	}, [sessionTypeFilter, locationCountRange]);

	const getLocationIcon = (locationType: string) => {
		switch (locationType) {
			case "00000000-0000-0000-0000-000000000002":
				return waypointIcon;
			case "00000000-0000-0000-0000-000000000003":
				return checkpointIcon;
			default:
				return null;
		}
	};

	const shouldShowMarker = (locationTypeId: string) => {
		if (locationTypeId === "00000000-0000-0000-0000-000000000002") {
			return showWaypoints;
		} else if (locationTypeId === "00000000-0000-0000-0000-000000000003") {
			return showCheckpoints;
		}
		return false;
	};

	const renderTracks = () => {
		return tracks.map((track, trackIndex) => {
			if (!track.locations || track.locations.length < 2) return null;

			try {
				const positions = track.locations.map((loc) =>
					L.latLng(loc.latitude, loc.longitude)
				);

				// Generate a consistent color based on the track index
				const colors = [
					"#FF5733",
					"#33FF57",
					"#3357FF",
					"#F033FF",
					"#FF33A1",
					"#33FFF5",
					"#F5FF33",
					"#FF8C33",
					"#8C33FF",
					"#33FF8C",
				];
				const trackColor = colors[trackIndex % colors.length];

				let sessionTypeName = "Unknown";
				try {
					const sessionTypeObj =
						typeof track.session.gpsSessionType === "string"
							? JSON.parse(track.session.gpsSessionType)
							: track.session.gpsSessionType;
					sessionTypeName = sessionTypeObj.en || "Unknown";
				} catch (error) {
					console.error("Error parsing session type:", error);
				}

				const startPoint = positions[0];
				const endPoint = positions[positions.length - 1];

				return (
					<React.Fragment key={`track-${trackIndex}`}>
						{/* Track polyline */}
						<Polyline
							positions={positions}
							pathOptions={{ color: trackColor, weight: 3 }}
						/>

						{/* Start Marker */}
						<Marker position={startPoint} icon={startIcon}>
							<Popup>
								<strong>Position:</strong> Start
								<br />
								<strong>Name:</strong>{" "}
								{track.session.name || "Unnamed track"}
								<br />
								<strong>Description:</strong>{" "}
								{track.session.description || "No description"}
								<br />
								<strong>Type:</strong> {sessionTypeName}
								<br />
								<strong>Duration:</strong>{" "}
								{track.session.duration}
								<br />
								<strong>Speed:</strong> {track.session.speed}
								<br />
								<strong>Distance:</strong>{" "}
								{track.session.distance}
								<br />
								<strong>GPS Locations:</strong>{" "}
								{track.session.gpsLocationsCount}
							</Popup>
						</Marker>

						{/* CP AND WP*/}
						{track.locations.map((location, locIndex) => {
							if (
								locIndex === 0 ||
								locIndex === track.locations.length - 1
							)
								return null;

							// Deal with WP and CP markers
							if (shouldShowMarker(location.gpsLocationTypeId)) {
								const locIcon = getLocationIcon(
									location.gpsLocationTypeId
								);
								if (!locIcon) return null;

								const trueIfWaypointFalseIfCheckpoint =
									location.gpsLocationTypeId ===
									"00000000-0000-0000-0000-000000000002";

								return (
									<Marker
										key={`track-${trackIndex}-loc-${locIndex}`}
										position={L.latLng(
											location.latitude,
											location.longitude
										)}
										icon={locIcon}
									>
										<Popup>
											<strong>Type:</strong>{" "}
											{trueIfWaypointFalseIfCheckpoint
												? "Waypoint"
												: "Checkpoint"}
											<br />
											<strong>Description:</strong>{" "}
											{trueIfWaypointFalseIfCheckpoint
												? "Navigation aid"
												: "Verified terrain point"}
											<br />
											<strong>Track:</strong>{" "}
											{track.session.name ||
												"Unnamed track"}
											<br />
											<strong>Recorded:</strong>{" "}
											{new Date(
												location.recordedAt
											).toLocaleString()}
										</Popup>
									</Marker>
								);
							}
							return null;
						})}

						{/* End Marker */}
						<Marker position={endPoint} icon={endIcon}>
							<Popup>
								<strong>Position:</strong> End
								<br />
								<strong>Name:</strong>{" "}
								{track.session.name || "Unnamed track"}
								<br />
								<strong>GPS Locations:</strong>{" "}
								{track.session.gpsLocationsCount}
								<br />
								<strong>Recorded By:</strong>{" "}
								{track.session.userFirstLastName}
								<br />
								<strong>Date:</strong>{" "}
								{new Date(
									track.session.recordedAt
								).toLocaleString()}
							</Popup>
						</Marker>
					</React.Fragment>
				);
			} catch (error) {
				console.error(`Error rendering track ${trackIndex}:`, error);
				return null;
			}
		});
	};

	return (
		<div>
			{loading && (
				<div className="text-black font-weight-bold p-1 text-center">
					Loading tracks...
				</div>
			)}
			<MapContainer
				center={position}
				zoom={8}
				scrollWheelZoom={true}
				style={{ height: "70vh", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{!loading && renderTracks()}
			</MapContainer>
		</div>
	);
}
