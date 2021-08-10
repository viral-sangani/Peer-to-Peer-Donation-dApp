import "tailwindcss/tailwind.css";
import { DataProvider } from "../contexts/DataContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </>
  );
}

export default MyApp;
