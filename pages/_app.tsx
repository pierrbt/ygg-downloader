import { AppProps } from "next/app";
import Head from "next/head";
import { Group, MantineProvider, Title } from "@mantine/core";
import { AppShell, Header } from "@mantine/core";
import yggLogo from "../public/ygg.svg";
import Image from "next/image";
import { Notifications } from "@mantine/notifications";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <>
      <Head>
        <title>Page title</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
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
            <Header height={60}>
              <Group sx={{ height: "100%" }} px={20} position="left">
                <Image src={yggLogo} priority alt={"Logo"} height={50}></Image>
                <Title size="xl">YggDownloader</Title>
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
