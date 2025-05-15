"use client";
import GpsSessionTypeSelect from "@/components/GpsSessionTypeSelect";
import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export default function GpsSessionEdit() {
	const gpsSessionService = new GpsSessionService();
	const gpsSessionTypeService = new GpsSessionTypeService();
	const router = useRouter();

	const { accountInfo } = useContext(AccountContext);
	const { id } = useParams();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(true);

	type Inputs = {
		id: string;
		name: string;
		description: string;
		recordedAt: string;
		paceMin: number;
		paceMax: number;
		gpsSessionTypeId: string;
	};

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<Inputs>();

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}

		if (!id) {
			router.push("/gpssessions");
			return;
		}

		const fetchData = async () => {
			try {
				setLoading(true);

				const result = await gpsSessionService.getByIdAsync(
					id.toString()
				);

				if (result.errors) {
					console.log("Error fetching GPS session:", result.errors);
					return;
				}

				const gpsSession = result.data;
				if (!gpsSession) {
					console.log("No GPS session data returned");
					return;
				}

				const typesResult = await gpsSessionTypeService.getAllAsync();

				if (typesResult.errors) {
					console.log(
						"Error fetching GPS session types:",
						typesResult.errors
					);
					return;
				}

				const parsedGpsSessionType = JSON.parse(
					gpsSession.gpsSessionType
				);
				const gpsSessionTypeName = parsedGpsSessionType.en;
				const matchingType = typesResult.data!.find(
					(type) => type.name === gpsSessionTypeName
				);

				if (!matchingType) {
					console.log(
						`No matching GPS session type found for: ${gpsSession.gpsSessionType}`
					);
					return;
				}

				reset({
					name: gpsSession.name,
					description: gpsSession.description ?? "",
					gpsSessionTypeId: matchingType.id,
					recordedAt: gpsSession.recordedAt,
					paceMin: gpsSession.paceMin ?? 0,
					paceMax: gpsSession.paceMax ?? 0,
				});
			} catch (error) {
				console.error("Error in fetchData:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id, accountInfo, router, reset]);

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log("Form submitted", data);
		setErrorMessage("Loading...");
		try {
			var result = await gpsSessionService.updateAsync({
				id: id!.toString(),
				name: data.name,
				description: data.description,
				gpsSessionTypeId: data.gpsSessionTypeId,
				recordedAt: data.recordedAt,
				paceMin: data.paceMin,
				paceMax: data.paceMax,
			});
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}
			setErrorMessage("");
			router.push("/gpssessions");
		} catch (error) {
			console.error("Error updating GPS session:", error);
			setErrorMessage(
				"An error occurred while updating the GPS session."
			);
		}
	};

	return (
		<>
			<main role="main" className="pb-3">
				<h1>Edit</h1>

				<h4>GPS Session</h4>
				<hr />
				<div className="row">
					<div className="col-md-4"></div>
					<div className="col-md-4">
						{errorMessage && (
							<div className="alert alert-danger" role="alert">
								{errorMessage}
							</div>
						)}
						{isLoading ? (
							<div className="d-flex justify-content-center">
								<div className="spinner-border" role="status">
									<span className="visually-hidden">
										Loading...
									</span>
								</div>
							</div>
						) : (
							<form
								onSubmit={handleSubmit(onSubmit)}
								id="registerForm"
								method="post"
							>
								<h2>Update an existing GPS-session.</h2>
								<hr />
								<div className="form-floating mb-3">
									<input
										className="form-control"
										aria-required="true"
										type="text"
										{...register("name", {
											required: true,
										})}
									/>
									<label>Session Name</label>
								</div>
								<div className="form-floating mb-3">
									<input
										className="form-control"
										aria-required="true"
										type="text"
										{...register("description", {
											required: true,
										})}
									/>
									<label>Description</label>
								</div>
								<Controller
									name="gpsSessionTypeId"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<GpsSessionTypeSelect
											value={field.value}
											onChange={(val) => {
												field.onChange(val);
											}}
										/>
									)}
								/>
								<div className="form-floating mb-3">
									<input
										className="form-control"
										type="text"
										readOnly
										{...register("recordedAt", {
											required: true,
										})}
									/>
									<label>Recorded At</label>
								</div>
								<div className="form-floating mb-3">
									<input
										className="form-control"
										aria-required="true"
										type="number"
										{...register("paceMin", {
											required: true,
										})}
									/>
									<label>Minimum Pace</label>
								</div>
								<div className="form-floating mb-3">
									<input
										className="form-control"
										aria-required="true"
										type="number"
										{...register("paceMax", {
											required: true,
										})}
									/>
									<label>Maximum Pace</label>
								</div>
								<button
									type="submit"
									className="w-100 btn btn-lg btn-primary"
								>
									Update it!
								</button>
							</form>
						)}
					</div>
				</div>

				<div>
					<Link href="/gpssessions" className="">
						Back to list
					</Link>
				</div>
			</main>
		</>
	);
}
