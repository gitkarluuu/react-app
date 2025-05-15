"use client";
import GpsLocationTypeSelect from "@/components/GpsLocationTypeSelect";
import { AccountContext } from "@/context/AccountContext";
import { GpsLocationService } from "@/services/GpsLocationService";
import { GpsSessionService } from "@/services/GpsSessionService";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export default function GpsLocationCreate() {
	const gpsLocationService = new GpsLocationService();
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);

	const { sessionid } = useParams();

	const [errorMessage, setErrorMessage] = useState("");
	const [recordedAt, setRecordedAt] = useState<string>("");

	type Inputs = {
		recordedAt: string;
		latitude: number;
		longitude: number;
		accuracy: number;
		altitude: number;
		verticalAccuracy: number;
		gpsLocationTypeId: string;
	};

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			recordedAt: recordedAt,
			latitude: 0,
			longitude: 0,
			accuracy: 0,
			altitude: 0,
			verticalAccuracy: 0,
			gpsLocationTypeId: "",
		},
	});

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
		}
		if (!sessionid) {
			router.push("/gpssessions");
		}
		const now = new Date();
		const recorded = now.toISOString().slice(0, 23) + "Z";
		setRecordedAt(recorded);
	}, []);

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log("Form submitted", data);
		setErrorMessage("Loading...");
		try {
			var result = await gpsLocationService.addWithSessionAsync(
				{
					recordedAt: recordedAt,
					latitude: data.latitude,
					longitude: data.longitude,
					accuracy: data.accuracy,
					altitude: data.altitude,
					verticalAccuracy: data.verticalAccuracy,
					gpsLocationTypeId: data.gpsLocationTypeId,
				},
				sessionid!.toString()
			);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}
			setErrorMessage("");
			if (result.data) {
				router.push("/gpssessions");
			}
			router.push("/");
		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};
	return (
		<>
			<main role="main" className="pb-3">
				<div className="row">
					<div className="col-md-4 offset-md-4">
						<h1>Register</h1>
						{errorMessage && (
							<div className="alert alert-danger" role="alert">
								{errorMessage}
							</div>
						)}
						<form
							onSubmit={handleSubmit(onSubmit)}
							id="registerForm"
							method="post"
						>
							<h2>Create a new GPS-session.</h2>
							<hr />
							<div className="form-floating mb-3">
								<input
									className="form-control"
									type="text"
									value={recordedAt}
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
									{...register("latitude", {
										required: true,
									})}
								/>
								<label>Latitude</label>
								{errors.latitude && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="number"
									{...register("longitude", {
										required: true,
									})}
								/>
								<label>Longitude</label>
								{errors.longitude && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="number"
									{...register("accuracy", {
										required: true,
									})}
								/>
								<label>Accuracy</label>
								{errors.accuracy && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="number"
									{...register("altitude", {
										required: true,
									})}
								/>
								<label>Altitude</label>
								{errors.altitude && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="number"
									{...register("verticalAccuracy", {
										required: true,
									})}
								/>
								<label>Vertical Accuracy</label>
								{errors.verticalAccuracy && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
							</div>
							<Controller
								name="gpsLocationTypeId"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<GpsLocationTypeSelect
										value={field.value}
										onChange={(val) => {
											field.onChange(val);
										}}
									/>
								)}
							/>
							{errors.gpsLocationTypeId && (
								<span className="text-danger field-validation-valid">
									This field is required
								</span>
							)}
							<button
								type="submit"
								className="w-100 btn btn-lg btn-primary"
							>
								Create it!
							</button>
						</form>
					</div>
				</div>
			</main>
		</>
	);
}
