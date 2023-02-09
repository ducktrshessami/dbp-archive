export function fromArray<T extends Identifiable>(array: Array<T>): Map<string, T> {
    return new Map<string, T>(array.map(item => [item.id, item]));
}

export function mapMap<K, V, T>(map: Map<K, V>, fn: (value: V, key: K, map: Map<K, V>) => T): Array<T> {
    const iter = map.entries();
    return Array.from({ length: map.size }, () => {
        const [key, value] = iter.next().value;
        return fn(value, key, map);
    });
}

type Identifiable = { id: string };
