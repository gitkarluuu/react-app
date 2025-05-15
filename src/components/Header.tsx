"use client";
import { AccountContext } from "@/context/AccountContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Header() {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);
	const router = useRouter();

	const [isCollapsed, setIsCollapsed] = useState(true);

	const toggleNavbar = () => {
		setIsCollapsed(!isCollapsed);
	};

	// Close navbar when route changes
	useEffect(() => {
		setIsCollapsed(true);
	}, [router]);

	return (
		<nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-custom border-bottom box-shadow mb-3">
			<div className="container">
				<Link className="navbar-brand" href="/">
					GPS Tracker
				</Link>
				<button
					className="navbar-toggler collapsed"
					type="button"
					onClick={toggleNavbar}
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className={`navbar-collapse collapse ${
						isCollapsed ? "" : "show"
					} d-sm-inline-flex justify-content-between`}
				>
					<ul className="navbar-nav flex-grow-1">
						<li className="nav-item">
							<Link
								className="nav-link text-dark"
								href="/"
								onClick={toggleNavbar}
							>
								Home
							</Link>
						</li>
						{accountInfo?.jwt && (
							<li className="nav-item dropdown">
								<button
									className="btn btn-link nav-link dropdown-toggle text-dark"
									id="profileDropdown"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									{accountInfo?.firstName +
										" " +
										accountInfo?.lastName}
								</button>
								<ul
									className="dropdown-menu"
									aria-labelledby="profileDropdown"
								>
									<li>
										<Link
											className="dropdown-item"
											href="/gpssessions"
											onClick={toggleNavbar}
										>
											My GPS Sessions
										</Link>
									</li>
								</ul>
							</li>
						)}
					</ul>

					<ul className="navbar-nav">
						<li className="nav-item">
							{!accountInfo?.jwt && (
								<Link
									className="nav-link text-dark"
									href="/register"
									onClick={toggleNavbar}
								>
									Register
								</Link>
							)}
						</li>
						<li className="nav-item">
							{!accountInfo?.jwt && (
								<Link
									className="nav-link text-dark"
									href="/login"
									onClick={toggleNavbar}
								>
									Login
								</Link>
							)}
						</li>
						<li className="nav-item">
							{accountInfo?.jwt && (
								<Link
									className="nav-link text-dark"
									href="/login"
									onClick={() => {
										setAccountInfo!({});
									}}
								>
									Log out
								</Link>
							)}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
