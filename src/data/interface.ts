export interface CovidData {
    dep: number;
    date: string;
    reg: number;
    lib_dep: string;
    lib_reg: string;
    tx_pos: number;
    tx_incid: number;
    TO: number;
    R: any;
    hosp: number;
    rea: number;
    rad: number;
    dchosp: number;
    reg_rea: number;
    incid_hosp: number;
    incid_rea: number;
    incid_rad: number;
    incid_dchosp: number;
    reg_incid_rea: number;
    pos: number;
    pos_7j: number;
    cv_dose1: any;
}

export const CSV = [
    {nom: 'covid-hosp-txad-age-fra', id: '', data: []},
    {nom: 'covid-hosp-txad-reg', id: '', data: []},
    {nom: 'covid-hosp-txad-fra', id: '', data: []},
    {nom: 'donnees-hospitalieres-classe-age-hebdo-covid19', id: '', data: []},
    {nom: 'covid-hospit-incid-reg', id: '', data: []},
    {nom: 'donnees-hospitalieres-covid19', id: '', data: []},
    {nom: 'donnees-hospitalieres-nouveaux-covid19', id: '', data: []},
    {nom: 'donnees-hospitalieres-classe-age-covid19', id: '', data: []},
    {nom: 'donnees-hospitalieres-etablissements-covid19', id: '', data: []}
];
