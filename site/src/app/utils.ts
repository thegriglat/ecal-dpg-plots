
export function encodeSessionURI(session: string): string {
    return session.replace('/', '_');
}

export function decodeSessionURI(session: string): string {
    return session.replace('_', '/');
}