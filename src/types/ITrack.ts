import { IGpsLocation } from "./domain/IGpsLocation";
import { IGpsSession } from "./domain/IGpsSession";

export interface ITrack {
	session: IGpsSession;
	locations: IGpsLocation[];
}
