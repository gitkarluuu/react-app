"use client";

import { AccountContext } from "@/context/AccountContext";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { IGpsSession } from "@/types/domain/IGpsSession";
import { GpsSessionService } from "@/services/GpsSessionService";

export default function GpsSession() {
	const gpsSessionService = new GpsSessionService();
	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();
	const [data, setData] = useState<IGpsSession[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
		}

		const fetchData = async () => {
			try {
				setLoading(true);
				const result = await gpsSessionService.getAllAsync();
				if (result.errors) {
					console.log(result.errors);
					return;
				}
				const filteredData = result.data?.filter(
					(item) => item.userFirstLastName === "Test User"
					// accountInfo!.firstName + " " + accountInfo!.lastName
				);
				setData(filteredData ?? []);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<>
			<h1>My Gps Sessions</h1>
			<p>
				<Link href="/gpssessions/create">Create New Gps Session</Link>
			</p>
			<table className="table">
				<thead>
					<tr>
						<th>Name</th>
						<th></th>
					</tr>
				</thead>

				<tbody>
					{data.map((item) => (
						<tr key={item.id}>
							<td>{item.name}</td>
							<td>
								<Link href={"/gpssessions/edit/" + item.id}>
									Edit
								</Link>{" "}
								|{" "}
								<Link href={"/gpssessions/delete/" + item.id}>
									Delete
								</Link>{" "}
								|{" "}
								<Link
									href={"/gpssessions/addLocation/" + item.id}
								>
									Add GPS Location to this session
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{loading && (
				<div className="text-black font-weight-bold p-1 text-center">
					Loading sessions...
				</div>
			)}
		</>
	);
}
