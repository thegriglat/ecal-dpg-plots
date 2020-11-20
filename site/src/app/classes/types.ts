export interface PlotData {
    session: string;
    name: string;
    caption: string;
    title: string;
    tags: string[];
    date: string;
    files: string[];
}

export class Plot {
    private _data: PlotData;
    constructor(data: PlotData) {
        this._data = data;
    }

    get data(): PlotData {
        return this._data;
    }

    get session(): string {
        return this._data.session;
    }

    get name(): string {
        return this._data.name;
    }

    get caption(): string {
        return this._data.caption;
    }

    get title(): string {
        return this._data.title;
    }

    get date(): string {
        return this._data.date;
    }

    get tags(): string[] {
        return this._data.tags;
    }

    get png(): string[] {
        return this.files('png');
    }

    get pdf(): string[] {
        return this.files('pdf');
    }

    public files(ext?: string): string[] {
        if (ext === undefined) { return this._data.files; }
        return this._data.files.filter(f => f.slice(f.length - 3) === ext);
    }
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
    plots: PlotData[];
    sessions: Session[];
    builddate: string;
    commit: string;
}

export interface SessionQuery {
    filter?: string;
    tags?: string[];
}
