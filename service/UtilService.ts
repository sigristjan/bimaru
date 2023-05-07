export const range = (start: number, end: number) => Array.from(Array(end - start).keys()).map(i =>
    start + i
)

export function any<T>(array: T[], condition: (any: any) => boolean): boolean {
    if (array.length === 0) return false
    return array.filter(element => {
        return condition(element)
    }).length !== 0
}