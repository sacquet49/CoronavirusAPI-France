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
    {nom: 'covid-hosp-txad-age-fra', id: '', data: [], date: ''},
    {nom: 'covid-hosp-txad-reg', id: '', data: [], date: ''},
    {nom: 'covid-hosp-txad-fra', id: '', data: [], date: ''},
    {nom: 'donnees-hospitalieres-classe-age-hebdo-covid19', id: '', data: [], date: ''},
    {nom: 'covid-hospit-incid-reg', id: '', data: [], date: ''},
    {nom: 'donnees-hospitalieres-covid19', id: '', data: [], date: ''},
    {nom: 'donnees-hospitalieres-nouveaux-covid19', id: '', data: [], date: ''},
    {nom: 'donnees-hospitalieres-classe-age-covid19', id: '', data: [], date: ''},
    {nom: 'donnees-hospitalieres-etablissements-covid19', id: '', data: [], date: ''}
];

export const TRANCHE_AGE = [{indice: '9', label: '0 - 9', color: '#0050ff', data: [], dataP: []},
    {indice: '19', label: '10 - 19', color: '#ff00e5', data: [], dataP: []},
    {indice: '29', label: '20 - 29', color: '#00f7ff', data: [], dataP: []},
    {indice: '39', label: '30 - 39', color: '#6aff00', data: [], dataP: []},
    {indice: '49', label: '40 - 49', color: '#ff0000', data: [], dataP: []},
    {indice: '59', label: '50 - 59', color: '#ff7700', data: [], dataP: []},
    {indice: '69', label: '60 - 69', color: '#9500ff', data: [], dataP: []},
    {indice: '79', label: '70 - 79', color: '#d0ff00', data: [], dataP: []},
    {indice: '89', label: '80 - 89', color: '#0b0b18', data: [], dataP: []},
    {indice: '90', label: '>90', color: '#02a705', data: [], dataP: []}];
