"use client";
import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Register() {
	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	type Inputs = {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log("Form submitted", data);
		setErrorMessage("Loading...");
		try {
			var result = await accountService.registerAsync(
				data.email,
				data.password,
				data.firstName,
				data.lastName
			);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}
			setErrorMessage("");
			if (result.data) {
				setAccountInfo!({
					jwt: result.data.token,
					firstName: result.data.firstName,
					lastName: result.data.lastName,
				});
			}
			router.push("/");
		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};

	return (
		<>
			<main b-wrkb45jn1q="" role="main" className="pb-3">
				<h1>Register</h1>

				<div className="row">
					<div className="col-lg-6">
						{errorMessage}
						<form
							id="registerForm"
							method="post"
							onSubmit={handleSubmit(onSubmit)}
						>
							<h2>Create a new account.</h2>
							<hr />

							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									placeholder="name@example.com"
									type="email"
									id="Input_Email"
									{...register("email", { required: true })}
								/>
								<label htmlFor="Input_Email">Email</label>
								{errors.email && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
								<span className="text-danger field-validation-valid"></span>
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="password"
									id="Input_Password"
									{...register("password", {
										required: true,
									})}
								/>
								<label htmlFor="Input_Password">Password</label>
								{errors.password && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
								<span className="text-danger field-validation-valid"></span>
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="text"
									id="Input_FirstName"
									{...register("firstName", {
										required: true,
									})}
								/>
								<label htmlFor="Input_FirstName">
									First Name
								</label>
								{errors.firstName && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
								<span className="text-danger field-validation-valid"></span>
							</div>
							<div className="form-floating mb-3">
								<input
									className="form-control"
									aria-required="true"
									type="text"
									id="Input_LastName"
									{...register("lastName", {
										required: true,
									})}
								/>
								<label htmlFor="Input_LastName">
									Last Name
								</label>
								{errors.lastName && (
									<span className="text-danger field-validation-valid">
										This field is required
									</span>
								)}
								<span className="text-danger field-validation-valid"></span>
							</div>
							<button
								id="registerSubmit"
								type="submit"
								className="w-100 btn btn-lg btn-primary"
							>
								Register
							</button>
						</form>
					</div>
				</div>
			</main>
		</>
	);
}
