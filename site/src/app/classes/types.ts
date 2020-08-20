export type Formats = "png" | "jpg" | "png" | "root";

export interface Plot {
    session: string,
    caption: string
    title: string
    tags: string[],
    formats: Formats[],
    date: string;
    pdf?: string,
    jpg?: string,
    png: string,
    root?: string
};

export interface Session {
    session: string,
    title: string,
    abstract: string,
    date: string,
    CDS: string
    iCMS: string
}


export const AnySession = {
    session: "Any session",
    title: null,
    abstract: null,
    date: null,
    CDS: null,
    iCMS: null
} as Session;