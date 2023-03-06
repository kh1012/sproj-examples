import { loadData, hasError } from "../utils";

export const DataLoader = async () => {
    const path = "/db/";
    const dbPath = "STLD";
    const rawData = await loadData(path + dbPath);
    if (hasError(rawData)) return [];
    if (rawData[dbPath] === undefined) return [];
    
    let registeredNames = [];
    const dbData = rawData[dbPath];
    for (const value in dbData) {
        const targetData = dbData[value];
        if (targetData.TYPE !== "CS")
            registeredNames.push(targetData.NAME + "(" + targetData.TYPE + ")");
    };

    return registeredNames;
};