"use client";

import { useEffect, useState } from "react";
import type { IResultObject } from "@/types/IResultObject";
import { IGpsLocationType } from "@/types/domain/IGpsLocationType";
import { GpsLocationTypeService } from "@/services/GpsLocationTypeService";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export default function GpsLocationTypeSelect({ value, onChange }: Props) {
	const [locationTypes, setLocationTypes] = useState<IGpsLocationType[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSessionTypes = async () => {
			setLoading(true);
			try {
				const service = new GpsLocationTypeService();
				const result: IResultObject<IGpsLocationType[]> =
					await service.getAllAsync();
				if (result.data) {
					setLocationTypes(result.data);
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
				aria-label="Select GPS Location Type"
			>
				<option value="" disabled>
					Select a GPS Session Type
				</option>
				{locationTypes.map((locationType) => (
					<option key={locationType.id} value={locationType.id}>
						{locationType.name}
					</option>
				))}
			</select>
			<label>GPS Location Type</label>

			{loading && (
				<div className="mt-2">
					<div
						className="spinner-border spinner-border-sm text-primary"
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
					<span className="ms-2">Loading location types...</span>
				</div>
			)}
		</div>
	);
}
