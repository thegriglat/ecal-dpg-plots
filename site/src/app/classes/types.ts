export type Formats = "png" | "jpg" | "png" | "root";

export interface Plot {
    comment: string
    title: string
    tags: string[],
    formats: Formats[],
    pdf?: string,
    jpg?: string,
    png?: string,
    root?: string
}