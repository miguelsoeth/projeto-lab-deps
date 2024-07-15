export interface ConsultaResultado {
    success?: boolean;
    errors: any;
    message: string;
    data: Data;    
}

interface Data {
    cnpj: string;
    razaoSocial: string;
    uf: string;
    municipio: string;
}