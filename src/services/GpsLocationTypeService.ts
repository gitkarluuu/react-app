import { IGpsLocationType } from "@/types/domain/IGpsLocationType";
import { EntityService } from "./EntityService";

export class GpsLocationTypeService extends EntityService<
	IGpsLocationType,
	IGpsLocationType,
	IGpsLocationType
> {
	constructor() {
		super("/gpslocationtypes");
	}
}
