import { IGpsSessionType } from "@/types/domain/IGpsSessionType";
import { EntityService } from "./EntityService";

export class GpsSessionTypeService extends EntityService<
	IGpsSessionType,
	IGpsSessionType,
	IGpsSessionType
> {
	constructor() {
		super("/gpssessiontypes");
	}
}
