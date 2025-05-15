import { IDomainId } from "../IDomainId";

export interface IGpsLocation extends IDomainId {
	recordedAt: string,
	latitude: number,
	longitude: number,
	accuracy: number,
	altitude: number,
	verticalAccuracy: number,
	appUserId: string,
	appSessionId: string,
	gpsLocationTypeId: string,
}
