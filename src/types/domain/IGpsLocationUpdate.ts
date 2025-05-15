import { IDomainId } from "../IDomainId";

export interface IGpsLocationUpdate extends IDomainId {
	recordedAt: string;
	latitude: number;
	longitude: number;
	accuracy: number;
	altitude: number;
	verticalAccuracy: number;
	appUserId: string;
	gpsSessionId: string;
	gpsLocationTypeId: string;
}
