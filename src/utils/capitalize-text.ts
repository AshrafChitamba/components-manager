// capitalize text
export const capitalizeText = (text: string) => {
    const capitalizedText = text.charAt(0).toUpperCase() + text.substring(1);
    
    return capitalizedText
};
