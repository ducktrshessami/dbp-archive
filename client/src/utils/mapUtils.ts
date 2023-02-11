export function fromArray<T extends Identifiable>(array: Array<T>): Map<string, T> {
    return new Map<string, T>(array.map(item => [item.id, item]));
}

export function reduceMap<K, V, T>(map: Map<K, V>, fn: (accumulator: T, value: V, key: K, map: Map<K, V>) => T, initialValue?: T): T {
    if (!map.size) {
        if (typeof initialValue === "undefined") {
            throw new TypeError("Reduce of empty map with no initial value");
        }
        return initialValue;
    }
    const iter = map.entries();
    let accumulator: T = typeof initialValue === "undefined" ? iter.next().value[1] : initialValue;
    for (let next = iter.next(); !next.done; next = iter.next()) {
        accumulator = fn(accumulator, next.value[1], next.value[0], map);
    }
    return accumulator;
}

type Identifiable = { id: string };
