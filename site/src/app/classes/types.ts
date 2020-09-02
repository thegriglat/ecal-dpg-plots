export interface Plot {
    session: string;
    name: string;
    caption: string;
    title: string;
    tags: string[];
    formats: string[];
    date: string;
    png: string;
    pdf?: string;
    jpg?: string;
    root?: string;
}

export interface Session {
    session: string;
    title: string;
    abstract: string;
    date: string;
    CDS: string;
    iCMS: string;
}

export const AnySession = {
    session: 'All sessions',
    title: '',
    abstract: '',
    date: '',
    CDS: '',
    iCMS: ''
} as Session;

export interface Data {
    plots: Plot[];
    sessions: Session[];
    builddate: string;
    commit: string;
    tags: string[];
}
