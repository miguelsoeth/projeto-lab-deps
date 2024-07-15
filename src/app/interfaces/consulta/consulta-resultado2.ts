export interface DadosItem {
    data: DataItem;
    success: boolean;
    errors: any;
    message: string;
}

interface DataItem {
    cnpj: string;
    razaoSocial: string;
    uf: string;
    municipio: string;
}

export interface ConsultaResultado2 {
    quant?: number;
    date: Date;
    dados: DadosItem | DadosItem[];
    id: string;
}