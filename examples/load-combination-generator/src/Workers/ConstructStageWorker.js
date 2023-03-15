import { loadData, hasError } from "../utils";

export const DataLoader = async () => {
    const path = "/db/";
    const checkPath = "STLD";
    const dbPath = "STCT";
    
    const checkPathResult = await loadData(path + checkPath);
    if (hasError(checkPathResult)) return [];
    
    const rawData = await loadData(path + dbPath);
    if (hasError(rawData)) return [];
    
    const registeredNames = [];
    registeredNames.push("Dead Load");            

    try {
        const vEREC = rawData[1]["vEREC"];
        registeredNames.push(...vEREC.map((value) => value.LTYPECC ));
    } catch (_) {}

    registeredNames.push("Tendon Primary");
    registeredNames.push("Tendon Secondary");
    registeredNames.push("Creep Primary");
    registeredNames.push("Creep Secondary");
    registeredNames.push("Shrinkage Primary");
    registeredNames.push("Shrinkage Secondary");
    registeredNames.push("Summation");
    return registeredNames;
};
