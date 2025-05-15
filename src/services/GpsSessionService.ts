import { IGpsSession } from "@/types/domain/IGpsSession";
import { EntityService } from "./EntityService";
import { IGpsSessionCreate } from "@/types/domain/IGpsSessionCreate";
import { IGpsSessionUpdate } from "@/types/domain/IGpsSessionUpdate";

export class GpsSessionService extends EntityService<
	IGpsSession,
	IGpsSessionCreate,
	IGpsSessionUpdate
> {
	constructor() {
		super("/gpssessions");
	}
}
