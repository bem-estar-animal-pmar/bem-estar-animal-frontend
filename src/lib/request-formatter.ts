export const formatRequestNumber = ( type: 'NEUTERING' | 'EMERGENCY' | 'GIVEUP'| 'ADOPTION', number: number) => {
    const prefixMap: Record<string, string> = {
        "NEUTERING": "CST",
        "EMERGENCY": "EMR",
        "GIVEUP": "GVP",
        "ADOPTION": "ADT"
    }
    const prefix = prefixMap[type];
    return `${prefix}-${String(number).padStart(6, '0')}`;
}