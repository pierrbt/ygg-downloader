import {
  ActionIcon,
  Flex,
  Stack,
  TextInput,
  Grid,
  Title,
  Text,
  Button,
  Paper,
  Container,
  Col,
  Rating,
} from "@mantine/core";
import { useState } from "react";
import { SearchResponse } from "./api/search/[name]";
import { FaInfo, FaDownload } from "react-icons/fa";
import { Media } from "../lib/yggtorrent";
import toast from "../utils/toaster.util";

export default function IndexPage() {
  const [mediaName, setMediaName] = useState("");
  const [mediaDetails, setMediaDetails] = useState<SearchResponse["details"]>();
  const [results, setResults] = useState<Media[]>([]);


  const handleChange = async () => {
    const data = (await fetch(`/api/search/${mediaName}`)
      .then((response) => response.json())
      .catch((err) => {
        console.error(err);
        throw err;
      })) as SearchResponse;
    if (data.ok) {
      console.log(data.results);
      setResults(data.results as Media[]);
      setMediaDetails(data.details);
    }
  };

  const handleShowDetails = (url: string) => {
    // Open a new tab with the url
    window.open(url, "_blank");
  };

  const handleDownload = async (key: number) => {
    console.log(key);
    try {
      const data = await fetch(
        `/api/download/${encodeURIComponent(results[key].downloadUrl)}`,
        {
          method: "POST",
        },
      );

      if (data.ok) {
        console.log(data);
      } else {
        throw new Error("Error while downloading the torrent");
      }
      return true;
    } catch (err) {
      throw err;
    }
  };

  return (
    <Stack>
      <Flex
        p="xs"
        justify="space-evenly"
        align="center"
        sx={{ width: "100%" }}
      >
        <TextInput
          size="lg"
          sx={{ width: "80%" }}
          placeholder="Entrez le nom d'un film ou d'une série"
          onChange={(element) => {
            setMediaName(element.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleChange();
          }}
        ></TextInput>
        <Button
          size="lg"
          sx={{ width: "15%" }}
          onClick={() => {
            handleChange();
          }}
        >
          Rechercher
        </Button>
      </Flex>
      <Container>
        <Flex direction="column" justify="center">
          <div>
            {mediaDetails && (
              <Paper
                p="lg"
                shadow="xs"
                withBorder
                sx={{ marginBottom: "50px" }}
              >
                <Flex justify="space-between" align="center">
                  <h2>{mediaDetails.title}</h2>
                  <Rating
                    value={mediaDetails.stars}
                    count={10}
                    readOnly={true}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <img
                    src={mediaDetails.image}
                    alt={mediaDetails.title}
                    style={{ height: "500px", borderRadius: "10px" }}
                  />
                  <p style={{ marginLeft: "20px" }}>
                    {mediaDetails.description}
                  </p>
                </Flex>
              </Paper>
            )}
          </div>
          <div>
            <Grid gutter="md">
              {results.length === 0 ? (
                <Flex justify="center" align="center">
                  <Text size="xl" p="lg">Aucun résultat</Text>
                </Flex>
              ) : (
                results.map((torrent, id) => (
                  <Grid.Col span={12} key={id}>
                    <Paper
                      p="lg"
                      shadow="xl"
                      radius="md"
                      withBorder
                      sx={{ marginBottom: "0px" }}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        sx={{ width: "100%" }}
                      >
                        <div>
                          <Title size="sm">{torrent.name}</Title>
                          <Text>
                            Taille: {torrent.size} | Complétés:{" "}
                            {torrent.completed} | Seeders: {torrent.seeders}
                          </Text>
                        </div>
                        <div>
                          <ActionIcon
                            variant="outline"
                            color="blue"
                            radius="xl"
                            onClick={() => handleShowDetails(torrent.url)}
                          >
                            <FaInfo />
                          </ActionIcon>
                          <ActionIcon
                            variant="outline"
                            color="blue"
                            radius="xl"
                            key={id}
                            style={{ transition: "all 0.2s ease-in-out" }}
                            onClick={async (e) => {
                              e.currentTarget.style.color = "green";
                              await handleDownload(id)
                                .then(() => {
                                  toast.success(`${mediaName} téléchargé !`);
                                })
                                .catch((err) => {
                                  console.error(err);
                                  toast.error("Erreur lors du téléchargement");
                                });
                            }}
                          >
                            <FaDownload />
                          </ActionIcon>
                        </div>
                      </Flex>
                    </Paper>
                  </Grid.Col>
                ))
              )}
            </Grid>
          </div>
        </Flex>
      </Container>
    </Stack>
  );
}
