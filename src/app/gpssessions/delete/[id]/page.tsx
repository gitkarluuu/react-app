"use client";
import { GpsSessionService } from "@/services/GpsSessionService";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AccountContext } from "@/context/AccountContext";
import Link from "next/link";
import type { IResultObject } from "@/types/IResultObject";
import type { IGpsSession } from "@/types/domain/IGpsSession";

export default function GpsSessionDelete() {
	const router = useRouter();
	const { id } = useParams();
	const { accountInfo } = useContext(AccountContext);
	const service = new GpsSessionService();

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<IResultObject<IGpsSession>>({});
	const [deletingError, setDeletingError] = useState<string | null>(null);

	const fetchPageData = async () => {
		setLoading(true);
		try {
			const result = await service.getByIdAsync(id!.toString());
			console.log(result.data);
			setData(result);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}
		if (!id) {
			router.push("/gpssessions");
			return;
		}
		fetchPageData();
	}, [id, accountInfo, router]);

	const doDeleting = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);
		try {
			const response = await service.deleteAsync(id!.toString());
			if (response.data) {
				router.push("/gpssessions");
			} else {
				setDeletingError(response.errors?.[0] || "Deleting failed");
			}
		} catch (error) {
			console.error("Error deleting:", error);
			setDeletingError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main role="main" className="pb-3">
			<h1>Delete</h1>

			<h3>Are you sure you want to delete this?</h3>

			{loading ? (
				<div className="d-flex justify-content-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : data.data ? (
				<>
					<h4>GPS Session</h4>
					<hr />
					<dl className="row">
						<dt className="col-sm-3">Id</dt>
						<dd className="col-sm-9">{data.data.id}</dd>

						<dt className="col-sm-3">Name</dt>
						<dd className="col-sm-9">{data.data.name}</dd>

						<dt className="col-sm-3">Description</dt>
						<dd className="col-sm-9">{data.data.description}</dd>

						<dt className="col-sm-3">Recorded At</dt>
						<dd className="col-sm-9">{data.data.recordedAt}</dd>

						<dt className="col-sm-3">Duration</dt>
						<dd className="col-sm-9">{data.data.duration}</dd>

						<dt className="col-sm-3">Speed</dt>
						<dd className="col-sm-9">{data.data.speed}</dd>

						<dt className="col-sm-3">Distance</dt>
						<dd className="col-sm-9">{data.data.distance}</dd>

						<dt className="col-sm-3">Climb</dt>
						<dd className="col-sm-9">{data.data.climb}</dd>

						<dt className="col-sm-3">Descent</dt>
						<dd className="col-sm-9">{data.data.descent}</dd>

						<dt className="col-sm-3">Pace Min</dt>
						<dd className="col-sm-9">{data.data.paceMin}</dd>

						<dt className="col-sm-3">Pace Max</dt>
						<dd className="col-sm-9">{data.data.paceMax}</dd>

						<dt className="col-sm-3">Type</dt>
						<dd className="col-sm-9">{data.data.gpsSessionType}</dd>

						<dt className="col-sm-3">Locations</dt>
						<dd className="col-sm-9">
							{data.data.gpsLocationsCount}
						</dd>

						<dt className="col-sm-3">User</dt>
						<dd className="col-sm-9">
							{data.data.userFirstLastName}
						</dd>
					</dl>
				</>
			) : (
				<div>No data found</div>
			)}

			{deletingError && (
				<div className="alert alert-danger" role="alert">
					{deletingError}
				</div>
			)}

			<div>
				<form onSubmit={doDeleting}>
					<input type="hidden" id="Game_Id" name="Game.Id" />
					<button
						type="submit"
						className="btn btn-danger"
						disabled={loading}
					>
						{loading ? "Deleting..." : "Delete"}
					</button>{" "}
					|{" "}
					<Link href="/gpssessions" className="">
						Back to list
					</Link>
				</form>
			</div>
		</main>
	);
}
