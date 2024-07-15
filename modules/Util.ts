export default {
    CapitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    NumberToFloatingPoint(num: string | number) {
        num = num.toString()
        if (!/^[01]+$/.test(num)) {
            throw new Error("Input must be a binary string containing only 0s and 1s.");
        }

        let firstOneIndex = num.indexOf('1');
        if (firstOneIndex === -1) {
            return "0";
        }

        return num.slice(0, firstOneIndex + 1) + (num.slice(firstOneIndex + 1) ? '.' + num.slice(firstOneIndex + 1) : '');
    }
}