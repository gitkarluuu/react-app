import { AxiosError } from "axios";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { IDomainId } from "@/types/IDomainId";

export abstract class EntityService<
	TEntity extends IDomainId,
	TAddEntity,
	TUpdateEntity extends IDomainId
> extends BaseService {
	constructor(private basePath: string) {
		super();
	}

	async getAllAsync(): Promise<IResultObject<TEntity[]>> {
		try {
			const response = await this.axiosInstance.get<TEntity[]>(
				this.basePath
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

	async getByIdAsync(id: string): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.get<TEntity>(
				this.basePath + "/" + id
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

	async addAsync(entity: TAddEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.post<TEntity>(
				this.basePath,
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

	async updateAsync(entity: TUpdateEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.put(
				this.basePath,
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
	async deleteAsync(id: string): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.delete<TEntity>(
				this.basePath + "/" + id
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
