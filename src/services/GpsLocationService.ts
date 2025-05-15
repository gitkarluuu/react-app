import { IGpsLocation } from "@/types/domain/IGpsLocation";
import { EntityService } from "./EntityService";
import { IGpsLocationCreate } from "@/types/domain/IGpsLocationCreate";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";
import { IGpsLocationUpdate } from "@/types/domain/IGpsLocationUpdate";

export class GpsLocationService extends EntityService<
	IGpsLocation,
	IGpsLocationCreate,
	IGpsLocationUpdate
> {
	constructor() {
		super("/gpsLocations");
	}

	async getLocationsBySessionIdAsync(
		sessionId: string
	): Promise<IResultObject<IGpsLocation>> {
		try {
			const response = await this.axiosInstance.get<IGpsLocation>(
				`/gpsLocations/session/${sessionId}`
			);

			if (response.status <= 300) {
				return { statusCode: response.status, data: response.data };
			}

			return {
				statusCode: response.status,
				errors: [
					(
						response.status.toString() +
						" " +
						response.statusText
					).trim(),
				],
			};
		} catch (error) {
			console.log("error: ", (error as Error).message);
			return {
				statusCode: (error as AxiosError)?.status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}

	async addAsync(
		entity: IGpsLocationCreate
	): Promise<IResultObject<IGpsLocation>> {
		throw new Error("Use addWithSessionAsync instead");
	}

	async addWithSessionAsync(
		entity: IGpsLocationCreate,
		gpsSessionId: string
	): Promise<IResultObject<IGpsLocation>> {
		try {
			const response = await this.axiosInstance.post<IGpsLocation>(
				`/gpsLocations/${gpsSessionId}`,
				entity
			);

			if (response.status <= 300) {
				return { statusCode: response.status, data: response.data };
			}

			return {
				statusCode: response.status,
				errors: [
					(
						response.status.toString() +
						" " +
						response.statusText
					).trim(),
				],
			};
		} catch (error) {
			console.log("error: ", (error as Error).message);
			return {
				statusCode: (error as AxiosError)?.status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}
}
