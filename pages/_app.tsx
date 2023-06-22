import type { AppProps } from "next/app";
import LoadingBackdrop from "../src/components/LoadingBackdrop";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <LoadingBackdrop />
    </>
  );
}
