import { IResultObject } from "@/types/IResultObject";
import type { ILoginDto } from "@/types/ILoginDto";
import { BaseService } from "./BaseService";
import { Axios, AxiosError } from "axios";

export class AccountService extends BaseService {
	async loginAsync(
		email: string,
		password: string
	): Promise<IResultObject<ILoginDto>> {
		const url = "account/login";
		try {
			const loginData = {
				email,
				password,
			};

			const response = await this.axiosInstance.post<ILoginDto>(
				url,
				loginData
			);

			console.log("login response", response);

			if (response.status <= 300) {
				return { data: response.data };
			}

			return {
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
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async registerAsync(
		email: string,
		password: string,
		firstName: string,
		lastName: string
	): Promise<IResultObject<ILoginDto>> {
		const url = "account/register";
		try {
			const registerData = {
				email,
				password,
				firstName,
				lastName,
			};

			const response = await this.axiosInstance.post<ILoginDto>(
				url,
				registerData
			);

			console.log("register response", response);

			if (response.status <= 300) {
				return { data: response.data };
			}

			return {
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
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}
}
