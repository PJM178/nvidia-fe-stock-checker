export const skuData = {
  baseUrl: (sku: string, locale: string) => {
    return `https://api.store.nvidia.com/partner/v1/feinventory?status=1&skus=${sku}&locale=${locale}`
  },
  country: {
    finland: {
      endonym: "Suomi",
      skus: {
        rtx5090: {
          gpuName: "RTX 5090",
          skuName: "Pro5090FE",
          isUpdated: false,
          isFromApi: false,
        },
        rtx5080: {
          gpuName: "RTX 5080",
          skuName: "PRO580GFTNV",
          isUpdated: false,
          isFromApi: false,
        },
      },
      locale: "fi-fi",
    },
    france: {
      endonym: "France",
      skus: {

      },
      locale: "fr-fr",
    },
    germany: {
      endonym: "Deutschland",
      skus: {
        rtx5090: {
          gpuName: "RTX 5090",
          skuName: "5090FEPROSHOP",
          isUpdated: false,
          isFromApi: false,
        },
        rtx5080: {
          gpuName: "RTX 5080",
          skuName: "PRO580GFTNV",
          isUpdated: false,
          isFromApi: false,
        },
      },
      locale: "de-de",
    },
  },
};
