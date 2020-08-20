export type Formats = "png" | "jpg" | "png" | "root";

export interface Plot {
    caption: string
    title: string
    tags: string[],
    formats: Formats[],
    date: string;
    pdf?: string,
    jpg?: string,
    png?: string,
    root?: string
};

export interface Session {
    title: string,
    abstract: string,
    date: string,
    CDS: string
    iCMS: string
}