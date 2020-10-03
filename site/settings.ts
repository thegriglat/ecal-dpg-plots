export type SectionType = {
    url: string;
    title: string;
    file: string;
};

export type SettingsType = {
    title: string;
    sections: SectionType[];
};

export const Settings: SettingsType = {
    // site title
    title: 'CMS ECAL public results',
    // site data modules
    sections: [
        {
            url: 'approved',
            title: 'ECAL Approved Results',
            file: 'approved.json'
        },
        {
            url: 'run2',
            title: 'Run2',
            file: 'run2.json'
        }
    ]
};
