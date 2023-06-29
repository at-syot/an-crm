import "../src/global.style.css";
import type { AppProps } from "next/app";
import LoadingBackdrop from "../src/components/_shared/LoadingBackdrop";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <LoadingBackdrop />
    </>
  );
}
