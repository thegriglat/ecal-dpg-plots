import * as _data from './../settings.json';

export type SectionType = {
    url: string;
    title: string;
    file: string;
    git: string;
};

export type SettingsType = {
    title: string;
    sections: SectionType[];
};

export const Settings: SettingsType = {
    title: _data.title,
    sections: _data.sections
};
