Very simple static site web app to check whether Nvidia Founders Edition cards are in stock on the official Nvidia store page. Note: The GPU sku list hardcoded within the app will likely not be updated, so the corrent sku names depend on Nvidia store api listing functioning and for the gpus to be active - it's possible that the store listing is updated only when the cards become available so the sku names are gotten at the same time, possibly causing slight delays for final sku polling. Inspired by the RTX 5000 series launch and https://github.com/jlplenio/notify-fe. Made with Next.js.

- Periodically poll the Nvidia store api - default value is 20 seconds
- Select the desired gpus to poll
- Multiple country stores - currently: Finland, Germany, and France
- Option to allow sending desktop notification when a gpu comes in stock
- Flash title with the names of the gpus in stock
