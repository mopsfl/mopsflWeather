export default {
    CapitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    NumberToFloatingPoint(num: string | number) {
        num = num.toString()

        let firstOneIndex = num.indexOf('1');
        if (firstOneIndex === -1) {
            return num;
        }

        return num.slice(0, firstOneIndex + 1) + (num.slice(firstOneIndex + 1) ? '.' + num.slice(firstOneIndex + 1) : '');
    }
}