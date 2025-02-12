"use client"

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Notification, PlayArrow, QuestionMark, StopCircle } from "./components/Icons";
import { Button } from "./components/Buttons";

const skuData = {
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
          locale: "fi-fi",
        },
        rtx5080: {
          gpuName: "RTX 5080",
          skuName: "PRO580GFTNV",
          locale: "fi-fi",
        },
      },
    },
    germany: {
      endonym: "Deutschland",
      skus: {
        rtx5090: {
          gpuName: "RTX 5090",
          skuName: "5090FEPROSHOP",
          locale: "de-de",
        },
        rtx5080: {
          gpuName: "RTX 5080",
          skuName: "PRO580GFTNV",
          locale: "de-de",
        },
        rtx5070: {
          gpuName: "RTX TEST",
          skuName: "PRO570GFTNV",
          locale: "de-de",
        },
      },
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
}

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

const makeAbsoluteUrl = (url: string) => {
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }

  return url;
};

interface LocaleBarProps {
  isAlertActive: boolean;
  setIsAlertActive: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenCountry: React.Dispatch<React.SetStateAction<keyof typeof skuData.country>>;
}

const LocaleBar = (props: LocaleBarProps) => {
  const { isAlertActive, setIsAlertActive, setChosenCountry } = props;

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
      <select defaultValue={"Suomi"} onChange={handleCountrySelect}>
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
          >
            <span>Start</span>
          </Button>
        </> :
        <>
          <Button
            variant="outlined"
            endIcon={<StopCircle className={styles["icon"]} />}
            onClick={handleButtonClick}
          >
            <span>Stop</span>
          </Button>
        </>}
    </div>
  );
}

interface SKUProps {
  gpuName: string;
  skuName: string;
  locale: string;
  isActive: boolean;
}

interface ResponseSkuData {
  fe_sku: string;
  is_active: string;
  locale: string;
  price: string;
  product_url: string;
}

interface ResponseData {
  listMap: ResponseSkuData[] | [];
  map: null;
  success: boolean;
}

interface ErrorResponse {
  error: boolean;
  message: string;
}

type ApiResponse = ResponseData | ErrorResponse;

const SKU = (props: SKUProps) => {
  const { gpuName, skuName, locale, isActive } = props;
  const [isSelected, setIsSelected] = useState(false);
  const [responseSkuData, setResponseSkuData] = useState<ApiResponse | null>(mockResponseDataSuccess);

  useEffect(() => {
    if (isActive && isSelected) {
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
  }, [isActive, isSelected, locale, skuName]);

  function handleSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
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
    <div className={styles["sku-grid-table--row"]}>
      <div className={styles["sku-grid-table--item"]}>{gpuName}</div>
      <div className={styles["sku-grid-table--item"]}>{apiStatusElement()}</div>
      <div className={styles["sku-grid-table--item"]}>{inStockElement()}</div>
      <div className={styles["sku-grid-table--item"]}>{linkElement()}</div>
      <div className={styles["sku-grid-table--item"]}>
        <input type="checkbox" onChange={handleSelected} />
      </div>
    </div>
  );
}

interface GridTableProps {
  isActive: boolean;
  country: keyof typeof skuData.country;
}

const GridTable = (props: GridTableProps) => {
  const { isActive, country } = props;

  return (
    <div className={styles["sku-grid-table"]}>
      <div className={styles["sku-grid-table--header"]}>Item</div>
      <div className={styles["sku-grid-table--header"]}>API Status</div>
      <div className={styles["sku-grid-table--header"]}>In Stock</div>
      <div className={styles["sku-grid-table--header"]}>Shop Link</div>
      <div className={styles["sku-grid-table--header"]}><Notification /></div>
      {Object.values(skuData.country[country].skus).map(sku => (
        <SKU
          key={sku.skuName}
          isActive={isActive}
          skuName={sku.skuName}
          gpuName={sku.gpuName}
          locale={sku.locale}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [chosenCountry, setChosenCountry] = useState<keyof typeof skuData.country>("finland");
  const [isAlertActive, setIsAlertActive] = useState(false);

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

  return (
    <>
      <main>
        <div className={styles["main-content-container"]}>
          <h1>Nvidia FE Stock Checker</h1>
          <div onPointerEnter={() => console.log("lol")}>
            <QuestionMark />
          </div>
          <LocaleBar
            setChosenCountry={setChosenCountry}
            setIsAlertActive={setIsAlertActive}
            isAlertActive={isAlertActive}
          />
          <GridTable country={chosenCountry} isActive={isAlertActive} />
          <button onClick={handleThemeLight}>light theme</button>
          <button onClick={handleThemeDark}>dark theme</button>
        </div>
      </main>
    </>
  );
}
