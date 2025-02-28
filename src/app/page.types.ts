import { skuData } from "./data/sku";

export interface SKUProps {
  gpuName: string;
  skuName: string;
  locale: string;
  isActive: boolean;
  isUpdated: boolean;
  isFromApi: boolean;
  apiSkuData: ApiSkuData;
  updateGpusInStock: ({ inStock, gpu }: {
    inStock: boolean;
    gpu: string;
  }) => void;
}

export interface ResponseSkuData {
  fe_sku: string;
  is_active: string;
  locale: string;
  price: string;
  product_url: string;
}

export interface ResponseData {
  listMap: ResponseSkuData[] | [];
  map: null;
  success: boolean;
}

export interface ErrorResponse {
  error: boolean;
  message: string;
}

export type ApiResponse = ResponseData | ErrorResponse;

export interface SkuData {
  gpuName: string;
  skuName: string;
  isUpdated: boolean;
  isFromApi: boolean;
}

export interface TimerProps {
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTime: number;
  isActive: boolean;
}

export interface CountrySelectProps {
  setChosenCountry: React.Dispatch<React.SetStateAction<keyof typeof skuData.country | null>>;
  chosenCountry: keyof typeof skuData.country | null;
}

export interface LocaleBarProps {
  isAlertActive: boolean;
  setIsAlertActive: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenCountry: React.Dispatch<React.SetStateAction<keyof typeof skuData.country | null>>;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  chosenCountry: keyof typeof skuData.country | null;
}

export interface GridTableProps {
  updateGpusInStock: ({ inStock, gpu }: {
    inStock: boolean;
    gpu: string;
  }) => void;
  isActive: boolean;
  country: keyof typeof skuData.country | null;
  apiSkuData: ApiSkuData;
}

export interface ApiSkuData {
  isLoading: boolean;
  isError: {
    error: boolean;
    message: string;
  };
  data: unknown[];
  isCountryDataLoading: boolean;
}

export interface SKUExtraApiElementProps {
  isUpdated: boolean;
  isFromApi: boolean;
}