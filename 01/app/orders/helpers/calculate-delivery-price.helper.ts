const minDeliveryPrice = 20;              // PLN
const pricePer1KM = 1;                     // PLN
const additionalPriceForEachPartner = 5;   // PLN
const defaultAdditionalPrice = 10;        // PLN

export const calculateDeliveryPriceHelper = (distances: number[]): number => {
    const totalDistance = distances.reduce((acc, distance) => acc + distance, 0);
    const calculatedPrice = defaultAdditionalPrice + additionalPriceForEachPartner * distances.length + Math.ceil(totalDistance / 1000) * pricePer1KM;

    return calculatedPrice < minDeliveryPrice ? minDeliveryPrice : calculatedPrice;
};
