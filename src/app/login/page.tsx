"use client";
import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {
	const accountService = new AccountService();
	const { setAccountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	type Inputs = {
		email: string;
		password: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "user@test.com",
			password: "Password.1",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log("Form submitted", data);
		setErrorMessage("Loading...");
		try {
			var result = await accountService.loginAsync(
				data.email,
				data.password
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
			<div className="row">
				<div className="col-md-4"></div>
				<div className="col-md-4">
					{errorMessage}
					<form onSubmit={handleSubmit(onSubmit)}>
						<h2>Use a local account to log in.</h2>
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
							<label className="form-label" htmlFor="Input_Email">
								Email
							</label>
							{errors.email && (
								<span className="text-danger field-validation-valid">
									This field is required
								</span>
							)}
						</div>
						<div className="form-floating mb-3">
							<input
								className="form-control"
								aria-required="true"
								type="password"
								id="Input_Password"
								{...register("password", { required: true })}
							/>
							<label
								className="form-label"
								htmlFor="Input_Password"
							>
								Password
							</label>
							{errors.password && (
								<span className="text-danger field-validation-valid">
									This field is required
								</span>
							)}
						</div>
						<div>
							<button
								id="login-submit"
								type="submit"
								className="w-100 btn btn-lg btn-primary"
							>
								Log in
							</button>
						</div>
						<div>
							<p>
								<a href="/register">Register as a new user</a>
							</p>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
