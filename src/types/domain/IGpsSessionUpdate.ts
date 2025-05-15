import { IDomainId } from "../IDomainId";

export interface IGpsSessionUpdate extends IDomainId {
	name: string;
	description: string;
	recordedAt: string;
	paceMin: number;
	paceMax: number;
	gpsSessionTypeId: string;
}
