export const formatRequestNumber = ( type: 'NEUTERING' | 'EMERGENCY', number: number) => {
    const prefix = type === 'NEUTERING' ? 'CST' : 'EMR';
    return `${prefix}-${String(number).padStart(6, '0')}`;
}