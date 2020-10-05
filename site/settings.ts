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
            url: 'ecalapproved',
            title: 'ECAL Approved Results',
            file: 'approved.json'
        },
        {
            url: 'Run2',
            title: 'Run 2 papers',
            file: 'run2.json'
        }
    ]
};
