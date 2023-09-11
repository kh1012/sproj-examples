/* global pyscript */
import { loadData, sendData } from "../utils";
export const updateDataIntoProduct = async (tdna, selected) => {
	try {
		const values = await makeMandatoryData(selected);
		const argument = {
			"Assign": {
				...values,
			}
		}

		await sendData("/db/tdna", JSON.stringify(argument), "PUT");
	} catch (error) {
		console.log(error);
	}
};

export const makeDataIntoProduct = async (selected) => {
	try {
		let values = await makeMandatoryData(selected);
		const rawTdnaData = (await loadData("/db/tdna"))["TDNA"];

		let lastKey = 0;
		for (const key of Object.keys(rawTdnaData)) {
			if (Number(lastKey) < Number(key)) lastKey = Number(key);
		}

		let argument = {
			"Assign": {},
		}
		for (let value of Object.values(values)) {
			let newName = value["NAME"];
			
			try {
				if (newName.length + "str".length > 20) {
					console.log("name is too long");
					continue;
				}
				value["NAME"] = newName + "_str";
				argument["Assign"][++lastKey] = value;
			} catch { continue; }
		}

		console.log(argument);

		await sendData("/db/tdna", JSON.stringify(argument), "PUT");
	} catch (error) {
		console.log(error);
	}
};

const makeMandatoryData = async(tdnaObject) => {
	const nodeData = await loadData("/db/node");
	const elemData = await loadData("/db/elem");

	if (!nodeData || !elemData) throw new Error("No suitable data found");

	try {
		const pymain = pyscript.interpreter.globals.get("proc");
		let retValue = {};

		for (const [key, value] of Object.entries(tdnaObject)) {
			const rawResult = pymain(JSON.stringify(value), JSON.stringify(nodeData), JSON.stringify(elemData));
			try {
				retValue[key] = JSON.parse(rawResult);
			} catch(err) {
				console.log(err);
				retValue[key] = value;
			}
		}

		return retValue;
	} catch (error) {
		console.log(error);
		return tdnaObject;
	};
};