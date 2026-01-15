import Head from "next/head";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useResizeHandler } from "@/hooks";
import { BreadCrumb } from "@/components/layout/BreadCrumb";
import { MobileSidebar, Sidebar } from "@/components/layout/Sidebar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { isMobile } = useResizeHandler();

  // 인증 에러 처리
  const handleAuthError = async (error: any) => {
    if (error?.status === 401 && error.code === "TOKEN_REFRESH_FAILED") {
      (async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });

        return router.push("/login");
      })();
    }
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
      mutations: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error: any) => {
        handleAuthError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        handleAuthError(error);
      },
    }),
  });

  return (
    <>
      <Head>
        <title>올타 어드민</title>
        <meta name="description" content="올타 관리자 페이지입니다." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <div
          className={`flex w-screen h-screen  text-black ${
            router.pathname === "/login" ? "bg-main" : "bg-[#F6F6F9]"
          }`}
        >
          {router.pathname !== "/login" &&
            (isMobile ? <MobileSidebar /> : <Sidebar />)}

          <div className="flex flex-col md:flex-1 w-full h-full overflow-x-hidden">
            {router.pathname !== "/login" && <BreadCrumb />}

            <div
              className={`h-full overflow-y-auto ${
                router.pathname !== "/login" && "mt-[64px]"
              }`}
            >
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}
