//% color="#FF8C1A"
namespace PairUtils {
    //% blockId=pairutils_string_image
    //% block="combine string $s||$i"
    export function stringAndImage(s: string, i?: Image) {
        return { s, i }
    }

    //% blockId=pairutils_number_pair
    //% block="combine number $x and number $y"
    export function doubleNumbers(x: number, y: number) {
        return { x, y }
    }
}
