import { IGpsLocation } from "@/types/domain/IGpsLocation";
import { GpsLocationService } from "./GpsLocationService";
import { GpsSessionService } from "./GpsSessionService";
import { ITrack } from "@/types/ITrack";

export class TrackService {
	private gpsSessionService: GpsSessionService;
	private gpsLocationService: GpsLocationService;

	constructor() {
		this.gpsSessionService = new GpsSessionService();
		this.gpsLocationService = new GpsLocationService();
	}

	async getAllAsync(): Promise<ITrack[]> {
		const sessionsResult = await this.gpsSessionService.getAllAsync();
		if (!sessionsResult.data || sessionsResult.data.length === 0) return [];
		const sessions = Array.isArray(sessionsResult.data)
			? sessionsResult.data
			: [sessionsResult.data];

		const tracks = await Promise.all(
			sessions!.map(async (session) => {
				const locationsResult =
					await this.gpsLocationService.getLocationsBySessionIdAsync(
						session.id
					);
				let locations: IGpsLocation[] = [];
				if (locationsResult.data) {
					locations = Array.isArray(locationsResult.data)
						? locationsResult.data
						: [locationsResult.data as IGpsLocation];
				}

				return {
					session,
					locations,
				};
			})
		);

		return tracks;
	}

	async getTrackBySessionIdAsync(sessionId: string): Promise<ITrack | null> {
		const sessionResult = await this.gpsSessionService.getByIdAsync(
			sessionId
		);
		if (!sessionResult.data) return null;

		const locationsResult =
			await this.gpsLocationService.getLocationsBySessionIdAsync(
				sessionId
			);

		let locations: IGpsLocation[] = [];
		if (locationsResult.data) {
			locations = Array.isArray(locationsResult.data)
				? locationsResult.data
				: [locationsResult.data as IGpsLocation];
		}

		return {
			session: sessionResult.data,
			locations: locations,
		};
	}
}
