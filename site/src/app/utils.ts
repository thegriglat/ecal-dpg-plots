
export function encodeSessionURI(session: string): string {
    return session.replace('/', '_');
}

export function decodeSessionURI(session: string): string {
    return session.replace('_', '/');
}

export function distinct<T>(thing: T, i: number, list: T[]): boolean {
    return list.findIndex(t => t === thing) === i;
}
