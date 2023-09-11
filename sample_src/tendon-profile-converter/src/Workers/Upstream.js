/* global pyscript */
import { loadData, sendData } from "../utils";

export const updateDataIntoProduct = async (tdna, selected) => {
	//makeMandatoryData contains converted data.
	try {
		const values = await makeMandatoryData(selected);
		const argument = {
			"Assign": {
				...values,
			}
		}

		const sendResult = await sendData("/db/tdna", JSON.stringify(argument), "PUT");
		console.log(sendResult);
	} catch (error) {
		console.log(error);
	}
	//then update each "key" to latest number of "TDNA"
	//and export it to product.
};

export const makeDataIntoProduct = async (tdnaData = {}, selected) => {
	//makeMandatoryData contains converted data.
	try {
		let values = await makeMandatoryData(selected);
		for (let [key, value] of Object.entries(values)) {
			
		}
		//get last number of "TDNA"
	} catch (error) {
		console.log(error);
	}
	//then update each "key" to latest number of "TDNA"
	//and export it to product.

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
			console.log({
				key,
				value
			})
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