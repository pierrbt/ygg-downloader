import { AppProps } from "next/app";
import Head from "next/head";
import { Group, MantineProvider, Title } from "@mantine/core";
import { AppShell, Header } from "@mantine/core";
import yggLogo from "../public/ygg.svg";
import Image from "next/image";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "YggDownloader",
  description: "Download torrents from YggTorrent",
};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta property="og:title" content={metadata.title} key="ogtitle" />
        <meta
          property="og:description"
          content={metadata.description}
          key="ogdesc"
        />
        <script defer data-domain="ygg.veagle.fr" src="https://stats.veagle.fr/js/script.js"></script>

      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <Notifications />
        <AppShell
          padding="md"
          fixed={false}
          header={
            <Header height={80}>
              <Group sx={{ height: "100%" }} px={20} position="left">
                <Image src={yggLogo} priority alt={"Logo"} height={60}></Image>
                <Title size="x-large">YggDownloader</Title>
              </Group>
            </Header>
          }
        >
          <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
    </>
  );
}
