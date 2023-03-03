import { loadData, hasError } from "../utils";

const NationalDefinitions = {
    "TRANS" : "TR",
    "EUROCODE": "EU",
    "CHINA": "CH",
    "INDIA": "ID",
    "JAPAN": "JP",
    "POLAND": "PL",
    "BS": "BS",
};

export const DataLoader = async () => {
    const path = "/db/";
    const dbPath = "MVLD";
    const variantPath = "MVCD";

    const natlCodeData = await loadData(path + variantPath);
    if (hasError(natlCodeData)) return [];

    const natlCode = natlCodeData[variantPath][1]["CODE"];

    let natlCodePostFix = "";
    if (NationalDefinitions[natlCode] !== undefined)
        natlCodePostFix = NationalDefinitions[natlCode];

    const rawData = await loadData(path + dbPath + natlCodePostFix);
    if (hasError(rawData)) return [];
    if (rawData[dbPath] === undefined) return [];
    
    let registeredNames = [];
    const dbData = rawData[dbPath];
    for (const value in dbData) {
        const targetData = dbData[value];
        registeredNames.push(targetData.LCNAME);
    };

    return registeredNames;
};