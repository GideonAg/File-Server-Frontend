import { Box, Button, Container, Grid, Image, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { responsivenes } from "../utils/responsivenes";

export const HomePage = () => {
  const { smallTextSize, textSize } = responsivenes();

  return (
    <Container>
      <Box>
        <Grid>
          <Grid.Col style={{ justifyContent: "center", textAlign: "center" }}>
            <Text
              size={textSize}
              fw={300}
              variant="gradient"
              gradient={{ from: "black", to: "black", deg: 90 }}
            >
              Welcome
            </Text>
            <Text size={smallTextSize} fw={300}>
              to the Files Server
            </Text>
            <Link to={"/login"}>
              <Button
                variant="light"
                rightSection={<IconArrowRight size={14} />}
                mt={40}
              >
                Explore
              </Button>
            </Link>
          </Grid.Col>
          <Grid.Col>
            <Image src={"../../public/images/notion-parade.webp"} />
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
};
