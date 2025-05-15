import { IDomainId } from "../IDomainId";

export interface IGpsSessionType extends IDomainId {
	name: string,
	description: string,
	paceMin: number,
	paceMax: number
}
