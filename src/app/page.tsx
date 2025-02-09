"use client"

import { useEffect, useState } from "react";
import Snackbar from "./components/Snackbar";
import styles from "./page.module.css";

const skuData = {
  baseUrl: (sku: string, locale: string) => {
    return `https://api.store.nvidia.com/partner/v1/feinventory?status=1&skus=${sku}&locale=${locale}`
  },
  country: {
    suomi: {
      rtx5090: {
        gpuName: "RTX 5090",
        skuName: "5090FEPROSHOP",
        locale: "fi-fi",
      },
      rtx5080: {
        gpuName: "RTX 5080",
        skuName: "PRO580GFTNV",
        locale: "fi-fi",
      },
    },
  },
};

const LocaleBar = () => {
  const [chosenCountry, setChosenCountry] = useState<keyof typeof skuData.country>("suomi");

  return null;
}

interface SKUProps {
  gpuName: string;
  skuName: string;
  locale: string;
  isActive: boolean;
}

const SKU = (props: SKUProps) => {
  const { gpuName, skuName, locale, isActive } = props;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isActive && isSelected) {
      async function checkStock() {
        const response = await fetch(skuData.baseUrl(skuName, locale));

        const data = await response.json();

        if (!response.ok) {
          console.log(`Error: ${data.message}`);
        } else {
          console.log(data);
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

  console.log(isSelected);

  return (
    <div className={styles["sku-grid-table--row"]}>
      <div className={styles["sku-grid-table--item"]}>{gpuName}</div>
      <div className={styles["sku-grid-table--item"]}>is api reachable</div>
      <div className={styles["sku-grid-table--item"]}>is in stock</div>
      <div className={styles["sku-grid-table--item"]}>shop link</div>
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
      <div className={styles["sku-grid-table--header"]}>Bell Icon?</div>
      {Object.values(skuData.country[country]).map(sku => (
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
  const [notification, setNotification] = useState<"warning" | "success" | "error" | null>(null);
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);

  return (
    <>
      <main>
        <div className={styles["main-content-container"]}>
          <h1>Price checker</h1>
          <LocaleBar />
          <GridTable country="suomi" isActive={true} />
          <button onClick={() => setNotification("success")}>test success</button>
          <button onClick={() => setNotification("error")}>test error</button>
          <button onClick={() => setNotification("warning")}>test warning</button>
          <button onClick={() => setWidth(200)}>set width</button>
          <button onClick={() => setOpacity(0)}>set op</button>
          <div className="transition-test" style={{ width: width, opacity: opacity }}></div>
        </div>
      </main>
      <Snackbar type={notification} setNotification={setNotification} />
    </>
  );
}
