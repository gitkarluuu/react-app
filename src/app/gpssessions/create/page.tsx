"use client";
import GpsSessionTypeSelect from "@/components/GpsSessionTypeSelect";
import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export default function GpsLocationCreate() {
	const gpsSessionService = new GpsSessionService();
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);

	const [errorMessage, setErrorMessage] = useState("");
	const [recordedAt, setRecordedAt] = useState<string>("");

	type Inputs = {
		name: string;
		description: string;
		gpsSessionTypeId: string;
		recordedAt: string;
		paceMin: number;
		paceMax: number;
	};

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
		}
		const now = new Date();
		const recorded = now.toISOString().slice(0, 23) + "Z";
		setRecordedAt(recorded);
	}, []);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			name: "",
			description: "",
			gpsSessionTypeId: "",
			recordedAt: recordedAt,
			paceMin: 0,
			paceMax: 0,
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log("Form submitted", data);
		setErrorMessage("Loading...");
		try {
			var result = await gpsSessionService.addAsync({
				name: data.name,
				description: data.description,
				gpsSessionTypeId: data.gpsSessionTypeId,
				recordedAt: recordedAt,
				paceMin: data.paceMin,
				paceMax: data.paceMax,
			});
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
									aria-required="true"
									type="text"
									{...register("name", { required: true })}
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
									placeholder="pace-min"
									type="number"
									{...register("paceMin", { required: true })}
								/>
								<label>Minimum Pace</label>
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									placeholder="pace-max"
									type="number"
									{...register("paceMax", { required: true })}
								/>
								<label>Maximum Pace</label>
							</div>
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
