import { loadData, hasError } from "../utils";

export const DataLoader = async () => {
    // const path = "/db/";
    const dbPath = "STLD";
	const rawData = {
		"STLD": {
			"1": {
				"NAME": "Dead Load",
			},
			"2": {
				"NAME": "Live Load",
			},
			"3": {
				"NAME": "Wind Load",
			},
			"4": {
				"NAME": "Seismic Load",
			},
			"5": {
				"NAME": "Temperature Load",
			},
			"6": {
				"NAME": "Shrinkage Load",
			},
			"7": {
				"NAME": "Creep Load",
			},
			"8": {
				"NAME": "Tendon Load",
			},
		}
	};
    // const rawData = await loadData(path + dbPath);
    if (hasError(rawData)) return [];
    if (rawData[dbPath] === undefined) return [];
    
    let registeredNames = [];
    const dbData = rawData[dbPath];
    for (const value in dbData) {
        const targetData = dbData[value];
        if (targetData.TYPE !== "CS")
            registeredNames.push(targetData.NAME);
    };

    return registeredNames;
};