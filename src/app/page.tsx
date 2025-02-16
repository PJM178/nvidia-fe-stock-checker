"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./page.module.css";
import { Notification, PlayArrow, QuestionMark, StopCircle } from "./components/Icons";
import { Button } from "./components/Buttons";
import { useCountdown } from "./hooks/useCountdown";
import { makeAbsoluteUrl } from "./utils/utilities";
import {
  SKUProps, ResponseData, ErrorResponse, ApiResponse, SkuData, TimerProps, LocaleBarProps,
  GridTableProps, ApiSkuData
} from "./page.types";
import { InlinePointerEnterAndLeaveWrapper } from "./components/Wrappers";

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
    germany: {
      endonym: "Deutschland",
      skus: {
        // rtx5090: {
        //   gpuName: "RTX 5090",
        //   skuName: "5090FEPROSHOP",
        //   isUpdated: false,
        //   isFromApi: false,
        // },
        rtx5070: {
          gpuName: "RTX 5070",
          skuName: "PRO570GFTNV",
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

const mockResponseDataSuccess = {
  listMap: [
    {
      fe_sku: "string",
      is_active: "true",
      locale: "string",
      price: "string",
      product_url: "www.google.com",
    }
  ],
  map: null,
  success: true,
};

const mockApiResponseData = [
  {
    "displayName": "NVIDIA RTX 5080",
    "totalCount": 2,
    "productID": 1147557,
    "imageURL": "https://assets.nvidia.partners/images/png/RTX5080-3QTR-Back-Right.png",
    "productTitle": "NVIDIA GeForce RTX 5080",
    "digitialRiverID": "",
    "productSKU": "PRO580GFTNV",
    "productUPC": "PRO580GFTNV_FI",
    "productUPCOriginal": "PRO580GFTNV",
    "productPrice": "€1,229.00",
    "mrp": "1229.0",
    "productAvailable": false,
    "productRating": null,
    "customerReviewCount": null,
    "isFounderEdition": true,
    "isFeaturedProduct": false,
    "certified": false,
    "bcPID": 0,
    "manufacturer": "NVIDIA",
    "locale": "FI",
    "bestSeller": false,
    "isFeaturedProdcutFoundInSecondSearch": false,
    "category": "GPU",
    "gpu": "RTX 5080",
    "purchaseOption": "",
    "prdStatus": "out_of_stock",
    "minShipDays": null,
    "maxShipDays": null,
    "shipInfo": null,
    "isOffer": false,
    "offerText": "",
    "internalLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
    "retailers": [
      {
        "productId": 1147557,
        "productTitle": "NVIDIA GeForce RTX 5080",
        "logoUrl": null,
        "isAvailable": true,
        "salePrice": "1229.0",
        "directPurchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
        "purchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
        "hasOffer": false,
        "offerText": null,
        "partnerId": "111",
        "storeId": "9619",
        "upc": "PRO580GFTNV_FI",
        "sku": "PRO580GFTNV",
        "stock": 0,
        "retailerName": "",
        "type": 80,
        "mrp": "1229.0",
        "bestSeller": false
      }
    ],
    "productInfo": [
      {
        "name": "gpu_boost_clock_speed",
        "value": "2.62 GHz"
      },
      {
        "name": "gpu_memory_size",
        "value": "16 GB"
      },
      {
        "name": "cooling_system",
        "value": "Aktiivinen"
      }
    ],
    "compareProductInfo": [
      {
        "name": "gpu_clock_speed",
        "value": "--"
      },
      {
        "name": "gpu_boost_clock_speed",
        "value": "2.62 GHz"
      },
      {
        "name": "gpu_memory_size",
        "value": "16 GB"
      },
      {
        "name": "cooling_system",
        "value": "Aktiivinen"
      }
    ]
  },
  {
    "displayName": "NVIDIA RTX 5090",
    "totalCount": 2,
    "productID": 1147616,
    "imageURL": "https://assets.nvidia.partners/images/png/RTX5090-3QTR-Back-Right.png",
    "productTitle": "NVIDIA GeForce RTX 5090",
    "digitialRiverID": "",
    "productSKU": "Pro5090FE",
    "productUPC": "Pro5090FE_FI",
    "productUPCOriginal": "Pro5090FE",
    "productPrice": "€2,455.00",
    "mrp": "2455.0",
    "productAvailable": false,
    "productRating": null,
    "customerReviewCount": null,
    "isFounderEdition": true,
    "isFeaturedProduct": false,
    "certified": false,
    "bcPID": 0,
    "manufacturer": "NVIDIA",
    "locale": "FI",
    "bestSeller": false,
    "isFeaturedProdcutFoundInSecondSearch": false,
    "category": "GPU",
    "gpu": "RTX 5090",
    "purchaseOption": "",
    "prdStatus": "out_of_stock",
    "minShipDays": null,
    "maxShipDays": null,
    "shipInfo": null,
    "isOffer": false,
    "offerText": "",
    "internalLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
    "retailers": [
      {
        "productId": 1147616,
        "productTitle": "NVIDIA GeForce RTX 5090",
        "logoUrl": null,
        "isAvailable": true,
        "salePrice": "2455.0",
        "directPurchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
        "purchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
        "hasOffer": false,
        "offerText": null,
        "partnerId": "111",
        "storeId": "9619",
        "upc": "Pro5090FE_FI",
        "sku": "Pro5090FE",
        "stock": 0,
        "retailerName": "",
        "type": 80,
        "mrp": "2455.0",
        "bestSeller": false
      }
    ],
    "productInfo": [
      {
        "name": "gpu_boost_clock_speed",
        "value": "2.41 GHz"
      },
      {
        "name": "gpu_memory_size",
        "value": "32 GB"
      },
      {
        "name": "cooling_system",
        "value": "Aktiivinen"
      }
    ],
    "compareProductInfo": [
      {
        "name": "gpu_clock_speed",
        "value": "--"
      },
      {
        "name": "gpu_boost_clock_speed",
        "value": "2.41 GHz"
      },
      {
        "name": "gpu_memory_size",
        "value": "32 GB"
      },
      {
        "name": "cooling_system",
        "value": "Aktiivinen"
      }
    ]
  }
];

// const mockResponseDataWarning = {
//   listMap: [

//   ],
//   map: null,
//   success: true,
// }

// const mockResponseDataError = {
//   error: true,
//   message: "this is mock error",
// };

const Timer = (props: TimerProps) => {
  const { setShouldRefresh } = props;

  const handleUseCountdownCallback = useCallback(() => {
    setShouldRefresh((prevValue) => !prevValue);
  }, [setShouldRefresh]);

  const { timeLeft } = useCountdown({ startTime: 5, repeat: true, callback: handleUseCountdownCallback });

  return timeLeft < 10 ? "0" + timeLeft : timeLeft;
};

const LocaleBar = (props: LocaleBarProps) => {
  const { isAlertActive, setIsAlertActive, setChosenCountry, setShouldRefresh } = props;

  const sortedCountries = Object.values(skuData.country).sort((a, b) => {
    const endonymA = a.endonym.toUpperCase();
    const endonymB = b.endonym.toUpperCase();

    if (endonymA < endonymB) {
      return -1;
    }

    if (endonymA > endonymB) {
      return 1;
    }

    return 0;
  });

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = Object.entries(skuData.country).find(([, value]) => value.endonym === e.target.value);

    setChosenCountry(prevValue => {
      if (country) {
        return country[0] as keyof typeof skuData.country;
      }

      return prevValue;
    })
  };

  const handleButtonClick = () => {
    setIsAlertActive(!isAlertActive);
  };

  return (
    <div className={styles["locale-bar-container"]}>
      <select className={styles["locale-bar--select-menu"]} defaultValue={"Suomi"} onChange={handleCountrySelect}>
        {sortedCountries.map(country => (
          <option key={country.endonym}>{country.endonym}</option>
        ))}
      </select>
      {!isAlertActive ?
        <>
          <Button
            variant="outlined"
            endIcon={<PlayArrow className={styles["icon"]} />}
            onClick={handleButtonClick}
            className={styles["primary-button"]}
          >
            <span>Start</span>
          </Button>
        </> :
        <>
          <Button
            variant="outlined"
            endIcon={<StopCircle className={styles["icon"]} />}
            onClick={handleButtonClick}
            className={styles["primary-button"]}
          >
            <span>Stop</span>
          </Button>
        </>}
      <div className={styles["timer-container"]}>
        <span className={styles["timer-container--inner"]}>
          <span className={styles["timer-container--inner-container"]}>
            <span>Refresh in&nbsp;</span>
            <span><Timer setShouldRefresh={setShouldRefresh} />s</span>
          </span>
        </span>
      </div>
    </div>
  );
}

const SKU = (props: SKUProps) => {
  const { gpuName, skuName, locale, isActive } = props;
  const isSelected = useRef(false);
  const [responseSkuData, setResponseSkuData] = useState<ApiResponse | null>(mockResponseDataSuccess);

  useEffect(() => {
    if (isActive && isSelected.current) {
      async function checkStock() {
        const response = await fetch(skuData.baseUrl(skuName, locale));

        if (!response.ok) {
          const data: ErrorResponse = await response.json();

          setResponseSkuData({ error: true, message: data.message });
        } else {
          const data: ResponseData = await response.json();

          setResponseSkuData(data);
        }
      }

      checkStock();
    }
  }, [isActive, locale, skuName]);

  function handleSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      isSelected.current = true;
    } else {
      isSelected.current = false;
    }
  }

  const apiStatusElement = () => {
    if (!responseSkuData || "error" in responseSkuData) {
      return (
        <div className={styles["sku-response--error"]}></div>
      );
    }

    if (responseSkuData.listMap.length === 0) {
      return (
        <div className={styles["sku-response--warning"]}></div>
      );
    }

    if (responseSkuData.success && responseSkuData.listMap.length > 0) {
      return (
        <div className={styles["sku-response--success"]}></div>
      );
    }
  }

  const inStockElement = () => {
    if (responseSkuData && "success" in responseSkuData && responseSkuData.success && responseSkuData.listMap[0]?.is_active === "true" && responseSkuData.listMap[0]?.product_url.length > 0) {
      return (
        <div className={styles["sku-response--success"]}></div>
      );
    }

    return (
      <div className={styles["sku-response--error"]}></div>
    );
  }

  const linkElement = () => {
    if (!responseSkuData || "error" in responseSkuData) {
      return null;
    }

    if (responseSkuData.success && responseSkuData.listMap[0]?.is_active === "true" && responseSkuData.listMap[0]?.product_url.length > 0) {
      return (
        <a href={makeAbsoluteUrl(responseSkuData.listMap[0].product_url)} target="_blank">Click Me</a>
      );
    }

    return null;
  }

  const handleAPIElement = (skuName?: string, apiSkuName?: string) => {
    if (skuName === apiSkuName) return null;

    return <span className={styles["sku-grid-table--item-gpuname-api"]}>API</span>;
  };

  return (
    <div className={styles["sku-grid-table--row"]}>
      <div className={styles["sku-grid-table--item"]}>
        <span className={styles["sku-grid-table--item-gpuname-container"]}>{gpuName}{handleAPIElement()}</span>
      </div>
      <div className={styles["sku-grid-table--item"]}>{apiStatusElement()}</div>
      <div className={styles["sku-grid-table--item"]}>{inStockElement()}</div>
      <div className={styles["sku-grid-table--item"]}>{linkElement()}</div>
      <div className={styles["sku-grid-table--item"]}>
        <input type="checkbox" onChange={handleSelected} />
      </div>
    </div>
  );
}

const GridTable = (props: GridTableProps) => {
  const { isActive, country, apiSkuData } = props;

  function checkIfIsInData() {
    if (!apiSkuData.isLoading) {
      const skuDataList = [...Object.values(skuData.country[country].skus)];
      let apiSkuDataList = apiSkuData.data;
      const updatedSkuList: SkuData[] = [];

      skuDataList.forEach((sku) => {
        const clonedSku = { ...sku };
        const result = apiSkuDataList.find((gpu) =>
          typeof gpu === "object" && gpu !== null && "gpu" in gpu && gpu.gpu === sku.gpuName
        );

        if (sku.gpuName === (result as { gpu: string })?.gpu) {
          clonedSku.isUpdated = (result as { productSKU: string })?.productSKU !== sku.skuName;
          clonedSku.skuName = (result as { productSKU: string })?.productSKU;
        }

        updatedSkuList.push(clonedSku);
        apiSkuDataList = apiSkuDataList.filter((apiSku) => (apiSku as { gpu: string }).gpu !== sku.gpuName);
      });

      if (apiSkuDataList.length > 0) {
        apiSkuDataList.forEach((sku) => {
          const toInsertSku: SkuData = {
            isUpdated: true,
            gpuName: (sku as { gpu: string }).gpu,
            skuName: (sku as { productSKU: string }).productSKU,
          };

          updatedSkuList.push(toInsertSku);
        });
      }

      updatedSkuList.sort((a, b) => {
        const gpuA = a.gpuName;
        const gpuB = b.gpuName;

        if (gpuA > gpuB) {
          return -1;
        }

        if (gpuA < gpuB) {
          return 1;
        }

        return 0;
      })

      console.log(updatedSkuList);
    }
  };

  checkIfIsInData();

  const handlePopoverContent = (element: "api" | "stock" | "link") => {
    if (element === "api") {
      return (
        <div>
          API INFO
        </div>
      );
    }

    if (element === "stock") {
      return (
        <div>
          STOCK INFO
        </div>
      );
    }

    if (element === "link") {
      return (
        <div>
          LINK INFO
        </div>
      );
    }
  }

  return (
    <div className={styles["sku-grid-table"]}>
      <div className={styles["sku-grid-table--header"]}>Item</div>
      <div className={styles["sku-grid-table--header"]}>
        API Status
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("api")}
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div className={styles["sku-grid-table--header"]}>
        In Stock
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("stock")}
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div
        className={styles["sku-grid-table--header"]}
      >
        Shop Link
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("link")}
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div className={styles["sku-grid-table--header"]}><Notification /></div>
      {Object.values(skuData.country[country].skus).map(sku => (
        <SKU
          key={sku.skuName}
          isActive={isActive}
          skuName={sku.skuName}
          gpuName={sku.gpuName}
          locale={skuData.country[country].locale}
        />
      ))}
    </div>
  );
};



// Check store api page for real sku names
// if they differ from the list, update the sku names
// offer user ability to manually override the sku name if empty list is returned
export default function Home() {
  const [chosenCountry, setChosenCountry] = useState<keyof typeof skuData.country>("finland");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [apiSkuData, setApiSkuData] = useState<ApiSkuData>({ isLoading: true, data: [] });
  console.log(Object.values(skuData.country[chosenCountry].skus));
  const handleThemeDark = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", "dark");
  }

  const handleThemeLight = () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", "light");
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }

    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }, []);

  useEffect(() => {
    async function checkStock() {
      // setApiSkuData({ isLoading: true, data: apiSkuData.data });
      // const response = await fetch(`https://api.nvidia.partners/edge/product/search?page=1&limit=12&locale=${skuData.country[chosenCountry].locale}&manufacturer=NVIDIA&manufacturer_filter=NVIDIA~2&category=GPU`);

      // if (!response.ok) {
      //   const data: ErrorResponse = await response.json();

      //   console.log(data)
      // } else {
      //   const data = await response.json();

      //   setApiSkuData({ isLoading: false, data: data.searchedProducts.productDetails });
      // }
      setApiSkuData((prevValue) => {
        prevValue.isLoading = true;

        return { ...prevValue };
      });

      setTimeout(() => {
        setApiSkuData({ isLoading: false, data: mockApiResponseData })
      }, 2000);
    }

    checkStock();

  }, [shouldRefresh, chosenCountry]);

  return (
    <>
      <main>
        <div className={styles["main-content-container"]}>
          <h1>Nvidia FE Stock Checker</h1>
          <LocaleBar
            setChosenCountry={setChosenCountry}
            setIsAlertActive={setIsAlertActive}
            isAlertActive={isAlertActive}
            setShouldRefresh={setShouldRefresh}
          />
          <GridTable apiSkuData={apiSkuData} country={chosenCountry} isActive={isAlertActive} />
          <button onClick={handleThemeLight}>light theme</button>
          <button onClick={handleThemeDark}>dark theme</button>
        </div>
      </main>
    </>
  );
}
