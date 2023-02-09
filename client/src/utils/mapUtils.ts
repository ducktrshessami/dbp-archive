export function fromArray<T extends Identifiable>(array: Array<T>): Map<string, T> {
    return new Map<string, T>(array.map(item => [item.id, item]));
}

type Identifiable = { id: string };
