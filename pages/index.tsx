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
  Rating,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Input } from "@mantine/core";
import { useState } from "react";
import { SearchResponse } from "./api/search/[name]";
import { FaInfo, FaDownload } from "react-icons/fa";
import { Media } from "../lib/yggtorrent";
import toast from "../utils/toaster.util";
export default function IndexPage() {
  const [mediaName, setMediaName] = useState("");
  const [mediaDetails, setMediaDetails] = useState<SearchResponse["details"]>();
  const [results, setResults] = useState<Media[]>([]);
  const [opened, { open, close }] = useDisclosure();

  const handleChange = async () => {
    try {
      const req = await fetch(`/api/search/${mediaName}`);
      if (req.status !== 200) {
        throw new Error("Error while fetching results from server");
      }
      const data = (await req.json()) as SearchResponse;
      if (!data.ok) {
        throw new Error("Error while fetching search results");
      }

      setMediaDetails(data.details);
      setResults(data.results as Media[]);

      if (!data.allowed) {
        open();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Erreur lors de la recherche, ${err.message}`);
    }
  };

  const handleShowDetails = (url: string) => {
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
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Échec de la requête au serveur"
        size="lg"
        centered
      >
        <>
          <br />
          <Text>
            Le serveur Ygg a refusé que le serveur Veagle accède aux fichiers,
            vous ne pourrez donc pas télécharger le fichier.
          </Text>
          <br />
          <Text>
            Il est possible de l'ajouter à une liste que l'administrateur pourra
            télécharger sous un certain temps. Voulez vous ajouter "{mediaName}"
            à la liste des téléchargements à effectuer manuellement ?
          </Text>
          <br />
          {/* Display an input with the name of the media to add to the list */}

          <Flex justify="space-evenly" align="center">
            <Input
              placeholder="Nom du média"
              defaultValue={mediaName}
              title="Nom du média"
              sx={{ width: "80%" }}
            />
            <Button
              variant="filled"
              color="green"
              onClick={() => {
                close();
                toast.success("Téléchargement ajouté à la liste");
              }}
            >
              Ajouter
            </Button>
          </Flex>
          <Divider my="lg" />
          <Button
            onClick={close}
            variant="filled"
            sx={{ width: "90%", margin: "0 5%" }}
          >
            Annuler
          </Button>
        </>
      </Modal>

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
                    <Text size="xl" p="lg">
                      Aucun résultat
                    </Text>
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
                                    toast.error(
                                      "Erreur lors du téléchargement",
                                    );
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
    </>
  );
}
