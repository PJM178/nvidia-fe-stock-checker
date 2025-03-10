"use client"

import { useEffect, useRef, useState, useCallback, Suspense, useMemo } from "react";
import styles from "./page.module.css";
import { Notification, BrandAwareness, PlayArrow, QuestionMark, Settings, StopCircle, ProgressActivity } from "./components/Icons";
import { Button, Switch } from "./components/Buttons";
import { useCountdown } from "./hooks/useCountdown";
import { capitalizeFirstLetter, makeAbsoluteUrl } from "./utils/utilities";
import {
  SKUProps, ResponseData, ErrorResponse, ApiResponse, SkuData, TimerProps, LocaleBarProps,
  GridTableProps, ApiSkuData, SKUExtraApiElementProps, CountrySelectProps,
} from "./page.types";
import { InlinePointerEnterAndLeaveWrapper } from "./components/Wrappers";
import { useSearchParams } from "next/navigation";
import { skuData } from "./data/sku";
import Skeleton from "./components/Skeleton";
import { UserSettingsProvider, useUserSettings, UserSettings } from "./context/UserSettingsContext";

// const mockResponseDataSuccess = {
//   listMap: [
//     {
//       fe_sku: "string",
//       is_active: "true",
//       locale: "string",
//       price: "string",
//       product_url: "www.google.com",
//     }
//   ],
//   map: null,
//   success: true,
// };

// const mockApiResponseData = [
//   {
//     "displayName": "NVIDIA RTX 5080",
//     "totalCount": 2,
//     "productID": 1147557,
//     "imageURL": "https://assets.nvidia.partners/images/png/RTX5080-3QTR-Back-Right.png",
//     "productTitle": "NVIDIA GeForce RTX 5080",
//     "digitialRiverID": "",
//     "productSKU": "PRO580GFTNV",
//     "productUPC": "PRO580GFTNV_FI",
//     "productUPCOriginal": "PRO580GFTNV",
//     "productPrice": "€1,229.00",
//     "mrp": "1229.0",
//     "productAvailable": false,
//     "productRating": null,
//     "customerReviewCount": null,
//     "isFounderEdition": true,
//     "isFeaturedProduct": false,
//     "certified": false,
//     "bcPID": 0,
//     "manufacturer": "NVIDIA",
//     "locale": "FI",
//     "bestSeller": false,
//     "isFeaturedProdcutFoundInSecondSearch": false,
//     "category": "GPU",
//     "gpu": "RTX 5080",
//     "purchaseOption": "",
//     "prdStatus": "out_of_stock",
//     "minShipDays": null,
//     "maxShipDays": null,
//     "shipInfo": null,
//     "isOffer": false,
//     "offerText": "",
//     "internalLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
//     "retailers": [
//       {
//         "productId": 1147557,
//         "productTitle": "NVIDIA GeForce RTX 5080",
//         "logoUrl": null,
//         "isAvailable": true,
//         "salePrice": "1229.0",
//         "directPurchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
//         "purchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5080/",
//         "hasOffer": false,
//         "offerText": null,
//         "partnerId": "111",
//         "storeId": "9619",
//         "upc": "PRO580GFTNV_FI",
//         "sku": "PRO580GFTNV",
//         "stock": 0,
//         "retailerName": "",
//         "type": 80,
//         "mrp": "1229.0",
//         "bestSeller": false
//       }
//     ],
//     "productInfo": [
//       {
//         "name": "gpu_boost_clock_speed",
//         "value": "2.62 GHz"
//       },
//       {
//         "name": "gpu_memory_size",
//         "value": "16 GB"
//       },
//       {
//         "name": "cooling_system",
//         "value": "Aktiivinen"
//       }
//     ],
//     "compareProductInfo": [
//       {
//         "name": "gpu_clock_speed",
//         "value": "--"
//       },
//       {
//         "name": "gpu_boost_clock_speed",
//         "value": "2.62 GHz"
//       },
//       {
//         "name": "gpu_memory_size",
//         "value": "16 GB"
//       },
//       {
//         "name": "cooling_system",
//         "value": "Aktiivinen"
//       }
//     ]
//   },
//   {
//     "displayName": "NVIDIA RTX 5090",
//     "totalCount": 2,
//     "productID": 1147616,
//     "imageURL": "https://assets.nvidia.partners/images/png/RTX5090-3QTR-Back-Right.png",
//     "productTitle": "NVIDIA GeForce RTX 5090",
//     "digitialRiverID": "",
//     "productSKU": "Pro5090FE",
//     "productUPC": "Pro5090FE_FI",
//     "productUPCOriginal": "Pro5090FE",
//     "productPrice": "€2,455.00",
//     "mrp": "2455.0",
//     "productAvailable": false,
//     "productRating": null,
//     "customerReviewCount": null,
//     "isFounderEdition": true,
//     "isFeaturedProduct": false,
//     "certified": false,
//     "bcPID": 0,
//     "manufacturer": "NVIDIA",
//     "locale": "FI",
//     "bestSeller": false,
//     "isFeaturedProdcutFoundInSecondSearch": false,
//     "category": "GPU",
//     "gpu": "RTX 5090",
//     "purchaseOption": "",
//     "prdStatus": "out_of_stock",
//     "minShipDays": null,
//     "maxShipDays": null,
//     "shipInfo": null,
//     "isOffer": false,
//     "offerText": "",
//     "internalLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
//     "retailers": [
//       {
//         "productId": 1147616,
//         "productTitle": "NVIDIA GeForce RTX 5090",
//         "logoUrl": null,
//         "isAvailable": true,
//         "salePrice": "2455.0",
//         "directPurchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
//         "purchaseLink": "https://marketplace.nvidia.com/fi-fi/consumer/graphics-cards/nvidia-geforce-rtx-5090/",
//         "hasOffer": false,
//         "offerText": null,
//         "partnerId": "111",
//         "storeId": "9619",
//         "upc": "Pro5090FE_FI",
//         "sku": "Pro5090FE",
//         "stock": 0,
//         "retailerName": "",
//         "type": 80,
//         "mrp": "2455.0",
//         "bestSeller": false
//       }
//     ],
//     "productInfo": [
//       {
//         "name": "gpu_boost_clock_speed",
//         "value": "2.41 GHz"
//       },
//       {
//         "name": "gpu_memory_size",
//         "value": "32 GB"
//       },
//       {
//         "name": "cooling_system",
//         "value": "Aktiivinen"
//       }
//     ],
//     "compareProductInfo": [
//       {
//         "name": "gpu_clock_speed",
//         "value": "--"
//       },
//       {
//         "name": "gpu_boost_clock_speed",
//         "value": "2.41 GHz"
//       },
//       {
//         "name": "gpu_memory_size",
//         "value": "32 GB"
//       },
//       {
//         "name": "cooling_system",
//         "value": "Aktiivinen"
//       }
//     ]
//   }
// ];

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
  const { setShouldRefresh, refreshTime, isActive } = props;

  const handleUseCountdownCallback = useCallback(() => {
    setShouldRefresh((prevValue) => !prevValue);
  }, [setShouldRefresh]);

  const { timeLeft } = useCountdown({ startTime: refreshTime, repeat: true, callback: handleUseCountdownCallback, isActive: isActive });

  return timeLeft < 10 ? "0" + timeLeft : timeLeft;
};

const CountrySelect = (props: CountrySelectProps) => {
  const { setChosenCountry, chosenCountry } = props;
  const searchParams = useSearchParams();

  useEffect(() => {
    function setInitialCountry(): keyof typeof skuData.country {
      const searchParamsCountry = searchParams.get("country")

      if (!!searchParamsCountry) {
        const skuCountries = Object.keys(skuData.country);
        const searchedCountry = skuCountries.find(country => country === searchParamsCountry);

        if (searchedCountry) {
          return searchedCountry as keyof typeof skuData.country;
        }
      }

      return "finland";
    }

    setChosenCountry((prevValue) => {
      prevValue = setInitialCountry();

      return prevValue;
    });
  }, [searchParams, setChosenCountry]);

  const sortedCountries = useMemo(() => Object.values(skuData.country).sort((a, b) => {
    const endonymA = a.endonym.toUpperCase();
    const endonymB = b.endonym.toUpperCase();

    if (endonymA < endonymB) {
      return -1;
    }

    if (endonymA > endonymB) {
      return 1;
    }

    return 0;
  }), []);

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = Object.entries(skuData.country).find(([, value]) => value.endonym === e.target.value);

    setChosenCountry(prevValue => {
      if (country) {
        return country[0] as keyof typeof skuData.country;
      }

      return prevValue;
    });

    if (country) {
      const params = new URLSearchParams(window.location.search);
      params.set('country', country[0]);
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <select
      className={`${styles["locale-bar--select-menu"]} ${!chosenCountry ? styles["loading"] : ""}`.trim()}
      onChange={handleCountrySelect}
      aria-label="Select store country"
      value={chosenCountry ? skuData.country[chosenCountry].endonym : ""}
    >
      {!chosenCountry ? <option>...loading</option> : sortedCountries.map(country => (
        <option key={country.endonym}>{country.endonym}</option>
      ))}
    </select>
  );
};

const LocaleBar = (props: LocaleBarProps) => {
  const { isAlertActive, setIsAlertActive, setChosenCountry, setShouldRefresh, chosenCountry } = props;

  const handleButtonClick = () => {
    setIsAlertActive(!isAlertActive);
  };

  return (
    <div className={styles["locale-bar-container"]}>
      <Suspense fallback={
        <select
          className={`${styles["locale-bar--select-menu"]} ${styles["loading"]}`.trim()}
          aria-label="Select store country"
          defaultValue={"...loading"}
        >
          <option>...loading</option>
        </select>
      }>
        <CountrySelect
          setChosenCountry={setChosenCountry}
          chosenCountry={chosenCountry}
        />
      </Suspense>
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
            <span><Timer isActive={isAlertActive} setShouldRefresh={setShouldRefresh} refreshTime={20} />s</span>
          </span>
        </span>
      </div>
    </div>
  );
}

const SKUExtraApiElement = (props: SKUExtraApiElementProps) => {
  const { isUpdated, isFromApi } = props;

  if (isUpdated) {
    return (
      <span className={styles["sku-extra-api-element--container"]}>
        <span>
          Updated
        </span>
      </span>
    );
  }

  if (isFromApi) {
    return (
      <span className={styles["sku-extra-api-element--container"]}>
        <span>
          API
        </span>
      </span>
    );
  }

  return null;
};

const SKU = (props: SKUProps) => {
  const { audioRef } = useUserSettings();
  const { gpuName, skuName, locale, isActive, isUpdated, isFromApi, apiSkuData, updateGpusInStock } = props;
  const isSelected = useRef(false);
  const [responseSkuData, setResponseSkuData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(apiSkuData.isLoading);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiSkuData.isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    if (isActive && isSelected.current && !apiSkuData.isLoading) {
      async function checkStock() {
        setIsLoading(true);

        try{
          const response = await fetch(skuData.baseUrl(skuName, locale));

          if (!response.ok) {
            const data: ErrorResponse = await response.json();
  
            setResponseSkuData({ error: true, message: data.message });
          } else {
            const data: ResponseData = await response.json();
  
            setResponseSkuData((prevValue) => ({ ...prevValue, ...data }));
          }
        } catch (err) {
          if (err instanceof TypeError) {
            setResponseSkuData({ error: true, message: err.message });
          } else {
            console.error(err);
          }
        }

        setIsLoading(false)
      }

      checkStock();
    }
  }, [isActive, locale, skuName, apiSkuData]);

  useEffect(() => {
    if (responseSkuData && "success" in responseSkuData && responseSkuData.success && responseSkuData.listMap[0]?.is_active === "true" && responseSkuData.listMap[0]?.product_url.length > 0) {
      if (window.Notification.permission === "granted") {
        new window.Notification(`${gpuName} in stock!`);
      }

      if (audioRef.current) {
        audioRef.current.play();
      }

      updateGpusInStock({ inStock: true, gpu: gpuName });
    } else {
      updateGpusInStock({ inStock: false, gpu: gpuName });
    }
  }, [gpuName, responseSkuData, updateGpusInStock, audioRef]);

  function handleSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      isSelected.current = true;
      rowRef.current?.classList.add(styles["checked"]);
    } else {
      isSelected.current = false;
      rowRef.current?.classList.remove(styles["checked"]);
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

  return (
    <div ref={rowRef} className={`${styles["sku-grid-table--row"]}`}>
      <div className={styles["sku-grid-table--item"]}>
        <span className={styles["sku-grid-table--item-gpuname-container"]}>
          <span>{gpuName}</span>
          <SKUExtraApiElement isUpdated={isUpdated} isFromApi={isFromApi} />
        </span>
      </div>
      <div className={styles["sku-grid-table--item"]}>
        <span className={styles["sku-grid-table--item-api"]}>
          <span className={isLoading ? "is-loading" : ""}>
            {apiStatusElement()}
          </span>
          {isLoading && <ProgressActivity className="loading-icon" />}
        </span>
      </div>
      <div className={styles["sku-grid-table--item"]}>{inStockElement()}</div>
      <div className={styles["sku-grid-table--item"]}>{linkElement()}</div>
      <div className={styles["sku-grid-table--item"]}>
        <input
          type="checkbox"
          onChange={handleSelected}
          aria-label={gpuName}
        />
      </div>
    </div>
  );
}

const GridTable = (props: GridTableProps) => {
  const [updatedSkuList, setUpdatedSkuList] = useState<SkuData[] | null>(null);
  const { isActive, country, apiSkuData, updateGpusInStock } = props;

  useEffect(() => {
    function checkIfIsInData() {
      if (!country) return;

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
              isUpdated: false,
              isFromApi: true,
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

        setUpdatedSkuList(updatedSkuList);
      }
    };

    checkIfIsInData();
  }, [apiSkuData, country]);

  const handlePopoverContent = (element: "api" | "stock" | "link" | "item") => {
    if (element === "item") {
      return (
        <div className={styles["sku-popover--container"]}>
          <div className={styles["sku-popover--header"]}>Item info:</div>
          <div className={styles["sku-popover--content-grid-container"]}>
            <div style={{ display: "contents" }} className={styles["sku-popover--content-row"]}>
              <span className={styles["sku-extra-api-element--container-info-container"]}>
                <span className={styles["sku-extra-api-element--container-info"]}>
                  <span>
                    Updated
                  </span>
                </span>
              </span>
              <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>SKU name was updated based on the response from the call to the Nvidia store listings</span></span>
            </div>
            <div style={{ display: "contents" }} className={styles["sku-popover--content-row"]}>
              <span className={styles["sku-extra-api-element--container-info-container"]}>
                <span className={styles["sku-extra-api-element--container-info"]}>
                  <span>
                    API
                  </span>
                </span>
              </span>
              <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>SKU was gotten from the Nvidia store api, not being hardcoded</span></span>
            </div>
          </div>
        </div>
      );
    }

    if (element === "api") {
      return (
        <div className={styles["sku-popover--container"]}>
          <div className={styles["sku-popover--header"]}>Status info:</div>
          <div className={styles["sku-popover--content-row"]}>
            <div className={styles["sku-response--success"]} />
            <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>successfully got a response from the Nvidia API endpoint</span></span>
          </div>
          <div className={styles["sku-popover--content-row"]}>
            <div className={styles["sku-response--warning"]} />
            <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>got a response from the endpoint but the product data is missing</span></span>
          </div>
          <div className={styles["sku-popover--content-row"]}>
            <div className={styles["sku-response--error"]} />
            <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>something went wrong making a call to the endpoint</span></span>
          </div>
        </div>
      );
    }

    if (element === "stock") {
      return (
        <div className={styles["sku-popover--container"]}>
          <div className={styles["sku-popover--header"]}>Status info:</div>
          <div className={styles["sku-popover--content-row"]}>
            <div className={styles["sku-response--success"]} />
            <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>the product is in stock</span></span>
          </div>
          <div className={styles["sku-popover--content-row"]}>
            <div className={styles["sku-response--error"]} />
            <span className={styles["sku-popover--content-row--text"]}><span>&nbsp;</span><span>-</span><span>&nbsp;</span><span>the product is not in stock</span></span>
          </div>
        </div>
      );
    }

    if (element === "link") {
      return (
        <div className={styles["sku-popover--container"]}>
          <div className={styles["sku-popover--header"]}>Status info:</div>
          <div className={styles["sku-popover--content-row"]}>
            <span className={styles["sku-popover--content-row--text"]}><span>A clickable link appears here when the product is in stock which opens a new tab with the purchase URL</span></span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles["sku-grid-table"]}>
      <div className={styles["sku-grid-table--header"]}>
        <span>Item</span>
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("item")}
          ariaLabel="Opens more info popup"
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div className={styles["sku-grid-table--header"]}>
        <span>API Status</span>
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("api")}
          ariaLabel="Opens more info popup"
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div className={styles["sku-grid-table--header"]}>
        <span>In Stock</span>
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          ariaLabel="Opens more info popup"
          popoverContent={handlePopoverContent("stock")}
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div
        className={styles["sku-grid-table--header"]}
      >
        <span>Shop Link</span>
        <InlinePointerEnterAndLeaveWrapper
          className={styles["sku-grid-table--header-icon"]}
          popoverContent={handlePopoverContent("link")}
          ariaLabel="Opens more info popup"
        >
          <QuestionMark className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
      </div>
      <div className={styles["sku-grid-table--header"]}><Notification /></div>
      {apiSkuData.isCountryDataLoading || !updatedSkuList || !country ?
        Object.keys(skuData.country["finland"].skus).map(sku => (
          <div key={sku} className={styles["sku-grid-table--row"]}>
            <Skeleton variant="text" inlineStyles={{ justifySelf: "center", alignSelf: "center" }} />
            <Skeleton variant="rounded" width="29px" height="29px" inlineStyles={{ justifySelf: "center", alignSelf: "center" }} />
            <Skeleton variant="rounded" width="29px" height="29px" inlineStyles={{ justifySelf: "center", alignSelf: "center" }} />
            <Skeleton variant="text" inlineStyles={{ justifySelf: "center", alignSelf: "center" }} />
            <Skeleton variant="rectangular" height="13px" width="13px" inlineStyles={{ justifySelf: "center", alignSelf: "center", borderRadius: "2px" }} />
          </div>
        )) :
        updatedSkuList?.map(sku => (
          <SKU
            key={sku.skuName}
            isActive={isActive}
            skuName={sku.skuName}
            gpuName={sku.gpuName}
            isFromApi={sku.isFromApi}
            isUpdated={sku.isUpdated}
            locale={skuData.country[country].locale}
            apiSkuData={apiSkuData}
            updateGpusInStock={updateGpusInStock}
          />
        ))}
    </div>
  );
};

const NotificationSoundSetting = () => {
  const { userSettings, setUserSettings, audioRef } = useUserSettings();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const initialHeight = useRef<number>(undefined);

  const handleSelectSoundNotification = () => {
    setUserSettings((prevValue) => {
      if (!prevValue.audioSettings.enabled) {
        audioRef.current = new Audio("/nvidia-fe-stock-checker/sounds/notification-alarm-sound.mp3");
      } else {
        audioRef.current = null;
      }

      return { ...prevValue, audioSettings: { enabled: !prevValue.audioSettings.enabled, volume: prevValue.audioSettings.volume } };
    });
  };

  const handleSliderVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const volume = (+e.target.value / 100);

      audioRef.current.volume = volume;
    }
  };

  const handleSliderDispatchPointerUp = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const { value } = e.currentTarget;

    setUserSettings((prevValue) => {
      return { ...prevValue, audioSettings: { enabled: prevValue.audioSettings.enabled, volume: +value } };
    });
  };

  // There may be different schemes of adjusting slider with different kinds of accessiblity settings
  // so losing blur and then updating the state should capture most of them except the focus being there
  // and the browser refreshing
  const handleSliderOnBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { value } = e.currentTarget;

    setUserSettings((prevValue) => {
      return { ...prevValue, audioSettings: { enabled: prevValue.audioSettings.enabled, volume: +value } };
    });
  };

  const handleTestAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = userSettings.audioSettings.volume / 100;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleTransitionEnd = () => {
    if (sliderRef.current) {
      if (userSettings.audioSettings.enabled) {
        sliderRef.current.style.visibility = "visible";
      } else {
        sliderRef.current.style.visibility = "hidden";
      }
    }
  };

  useEffect(() => {
    if (userSettings.audioSettings.enabled) {
      setHeight(initialHeight.current);
    } else {
      setHeight(0);
    }
  }, [userSettings.audioSettings.enabled]);

  useEffect(() => {
    if (sliderRef.current) {
      initialHeight.current = sliderRef.current?.clientHeight;
    }
  }, []);

  return (
    <>
      <div className={styles["footer-container--settings-menu--row"]}>
        <span id="settings-sound-label">Send sound notification</span>
        <span className={styles["footer-container--settings-menu--row-switch"]}>
          <Switch
            ariaLabelledBy="settings-sound-label"
            isActive={userSettings.audioSettings.enabled}
            onClick={handleSelectSoundNotification}
          />
        </span>
      </div>
      <div
        ref={sliderRef}
        onTransitionEnd={handleTransitionEnd}
        className={
          `${styles["footer-container--settings-menu--row"]} ${!userSettings.audioSettings.enabled ? styles["hidden"] : styles["visible"]} ${height === undefined ? "" : styles["animate"]}`.trim()
        }
        style={{ height: `${height}px`, position: height === undefined && !userSettings.audioSettings.enabled ? "absolute" : "relative" }}
      >
        <span id="settings-sound-volume-label">Adjust volume</span>
        <InlinePointerEnterAndLeaveWrapper
          className={styles["footer-container--settings-menu--row-slider-icon"]}
          ariaLabel="Test audio volume"
          callback={handleTestAudio}
          title="Test audio volume"
        >
          <BrandAwareness className={styles["sku-grid-table--header-icon-icon"]} />
        </InlinePointerEnterAndLeaveWrapper>
        <input
          className={styles["footer-container--settings-menu--row-slider"]}
          type="range"
          onChange={handleSliderVolume}
          onPointerUp={handleSliderDispatchPointerUp}
          onBlur={handleSliderOnBlur}
          aria-labelledby="settings-sound-volume-label"
          defaultValue={userSettings.audioSettings.volume}
          min={0}
          max={100}
        />
      </div>
    </>
  );
};

const Footer = () => {
  const themeOptions: UserSettings["theme"][] = ["system", "dark", "light"];
  const { userSettings, setUserSettings } = useUserSettings();

  const handleThemeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UserSettings["theme"];

    if (value === "dark") {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    if (value === "light") {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    }

    if (value === "system") {
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("data-theme");
    }

    setUserSettings((prevValue) => {
      return { ...prevValue, theme: value }
    });
  };

  const handleSelectNotification = () => {
    if (window.Notification.permission !== "denied") {
      window.Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            setUserSettings((prevValue) => {
              return { ...prevValue, notification: "granted" };
            });
          }

          if (permission === "denied") {
            setUserSettings((prevValue) => {
              return { ...prevValue, notification: "denied" };
            });
          }
        });
    }
  };

  const handlePopoverContent = () => {
    return (
      <div className={styles["footer-container--settings-menu"]}>
        <div className={styles["footer-container--settings-menu--row"]}>
          <span id="settings-notification-label">Send desktop notification</span>
          <span className={styles["footer-container--settings-menu--row-switch"]}>
            <Switch
              disabled={userSettings.notification === "denied" || userSettings.notification === "granted"}
              ariaLabelledBy="settings-notification-label"
              isActive={userSettings.notification === "granted"}
              onClick={handleSelectNotification}
              title={userSettings.notification !== "default" ? "Notifications already set - left of address bar to unset" : undefined}
            />
          </span>
        </div>
        <NotificationSoundSetting />
        <div
          className={styles["footer-container--settings-menu--row"]}
          style={{ marginBottom: "unset" }}
        >
          <span id="settings-theme-label">Select theme</span>
          <span className={styles["footer-container--settings-menu--row-switch"]}>
            <select
              defaultValue={userSettings.theme}
              onChange={handleThemeSelect}
              className={styles["footer-container--settings-menu--row-select"]}
              aria-labelledby="settings-theme-label"
            >
              {themeOptions.map((theme) => (
                <option key={theme} value={theme}>{capitalizeFirstLetter(theme)}</option>
              ))}
            </select>
          </span>
        </div>
      </div>
    );
  };

  return (
    <footer className={styles["footer-container"]}>
      <InlinePointerEnterAndLeaveWrapper
        className={styles["footer-container--settings"]}
        popoverContent={handlePopoverContent()}
        ariaLabel="Opens settings menu"
        popoverClassName={styles["footer-container--settings-menu-popover"]}
      >
        <Settings className={styles["footer-container--settings-icon"]} />
      </InlinePointerEnterAndLeaveWrapper>
    </footer>
  );
};

// Check store api page for real sku names
// if they differ from the list, update the sku names
// TODO: Make transparent color palette for better overlay element handling
export default function Home() {
  const [chosenCountry, setChosenCountry] = useState<keyof typeof skuData.country | null>(null);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [apiSkuData, setApiSkuData] = useState<ApiSkuData>({ isLoading: true, isError: { error: false, message: "" }, data: [], isCountryDataLoading: true });
  const productInStockInterval = useRef<NodeJS.Timeout>(undefined);
  const originalTitle = useRef("Nvidia FE Stock Checker");
  const [gpusInStock, setGpusInStock] = useState<string[]>([]);
  const previousCountry = useRef<string | null>(null);

  const updateGpusInStock = useCallback(({ inStock, gpu }: { inStock: boolean, gpu: string }) => {
    setGpusInStock((prevValue) => {
      if (inStock) {
        if (!prevValue.includes(gpu)) {
          return [...prevValue, gpu];
        }
      } else {
        return prevValue.filter(value => value !== gpu);
      }

      return prevValue;
    });
  }, []);

  useEffect(() => {
    if (gpusInStock.length > 0) {
      clearInterval(productInStockInterval.current);

      productInStockInterval.current = setInterval(() => {
        if (document.title === originalTitle.current) {
          document.title = gpusInStock.join(", ") + " in stock!";
        } else {
          document.title = originalTitle.current;
        }
      }, 500);
    } else {
      clearInterval(productInStockInterval.current);

      document.title = originalTitle.current;
    }
  }, [gpusInStock]);

  useEffect(() => {
    async function checkStock() {
      if (chosenCountry) {
        setApiSkuData((prevValue) => ({ ...prevValue, isLoading: true, isCountryDataLoading: previousCountry.current !== chosenCountry }));

        try {
          const response = await fetch(`https://api.nvidia.partners/edge/product/search?page=1&limit=12&locale=${skuData.country[chosenCountry].locale}&manufacturer=NVIDIA&manufacturer_filter=NVIDIA~2&category=GPU`);

          previousCountry.current = chosenCountry;

          if (!response.ok) {
            const data: ErrorResponse = await response.json();

            setApiSkuData((prevValue) => ({ ...prevValue, isLoading: false, isError: { ...data }, isCountryDataLoading: false }));
          } else {
            const data = await response.json();

            setApiSkuData((prevValue) => ({ ...prevValue, isLoading: false, data: data.searchedProducts.productDetails, isCountryDataLoading: false }));
          }
        } catch (err) {
          setApiSkuData((prevValue) => ({ ...prevValue, isLoading: false, isError: { error: true, message: err as string }, isCountryDataLoading: false }));
        }
      }
    }

    checkStock();
  }, [chosenCountry, shouldRefresh]);

  return (
    <>
      <main>
        <UserSettingsProvider>
          <div className={styles["main-content-container"]}>
            <h1>Nvidia FE Stock Checker</h1>
            <LocaleBar
              setChosenCountry={setChosenCountry}
              setIsAlertActive={setIsAlertActive}
              isAlertActive={isAlertActive}
              setShouldRefresh={setShouldRefresh}
              chosenCountry={chosenCountry}
            />
            <GridTable
              updateGpusInStock={updateGpusInStock}
              apiSkuData={apiSkuData}
              country={chosenCountry}
              isActive={isAlertActive}
            />
            <Footer />
          </div>
        </UserSettingsProvider>
      </main>
    </>
  );
}
