import { hasError, loadData } from "../utils";

export const DataLoader = async () => {
    const path = "/db/";
    const dbPath = "THIS";
    const rawData = await loadData(path + dbPath);
    if (hasError(rawData)) return [];
    if (rawData[dbPath] === undefined) return [];
    
    let registeredNames = [];
    const dbData = rawData[dbPath];
    for (const value in dbData) {
        const targetData = dbData[value]["COMMON"];
        registeredNames.push(targetData.NAME);
    };

    return registeredNames;
};