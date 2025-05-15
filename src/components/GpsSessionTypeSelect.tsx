"use client";

import { useEffect, useState } from "react";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import type { IGpsSessionType } from "@/types/domain/IGpsSessionType";
import type { IResultObject } from "@/types/IResultObject";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export default function GpsSessionTypeSelect({ value, onChange }: Props) {
	const [sessionTypes, setSessionTypes] = useState<IGpsSessionType[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSessionTypes = async () => {
			setLoading(true);
			try {
				const service = new GpsSessionTypeService();
				const result: IResultObject<IGpsSessionType[]> =
					await service.getAllAsync();
				if (result.data) {
					setSessionTypes(result.data);
				}
			} catch (err) {
				console.error("Failed to load session types", err);
			} finally {
				setLoading(false);
			}
		};

		fetchSessionTypes();
	}, []);

	return (
		<div className="form-floating mb-3">
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="form-select"
				aria-required="true"
				aria-label="Select GPS Session Type"
			>
				<option value="" disabled>
					Select a GPS Session Type
				</option>
				{sessionTypes.map((sessionType) => (
					<option key={sessionType.id} value={sessionType.id}>
						{sessionType.name}
					</option>
				))}
			</select>
			<label>GPS Session Type</label>

			{loading && (
				<div className="mt-2">
					<div
						className="spinner-border spinner-border-sm text-primary"
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
					<span className="ms-2">Loading session types...</span>
				</div>
			)}
		</div>
	);
}
