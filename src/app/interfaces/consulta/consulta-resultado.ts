export interface ConsultaResultado {
    success?: boolean;
    errors: any;
    message: string;
    data: ResultData;    
}

export interface ResultData {
    cnpj: string;
    razaoSocial: string;
    uf: string;
    municipio: string;
}