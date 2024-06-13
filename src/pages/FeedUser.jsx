import { useEffect, useState } from "react";
import FileServerEndpoints from "../service/FileServerEndpoints";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Skeleton,
  Table,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { IconArrowRight, IconSearch, IconShare3 } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const FeedUser = ({ user, dispatchUser }) => {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState({
    name: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch({ ...search, [e.target.name]: value });
  };

  const getFiles = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!search.name) return;
      const { data } = await FileServerEndpoints.userSearchForFile(
        search.name,
        user
      );
      setFiles(data);
      setIsLoading(false);
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    FileServerEndpoints.logout(user)
      .then((response) => {
        dispatchUser({ type: "clear-session", payload: response.data });
        alert(response.data);
        navigate("/login");
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await FileServerEndpoints.userGetAllFiles(user);
        setFiles(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const ShareFile = (e, fileId) => {
    e.preventDefault();
    navigate(`/share-file/${fileId}`);
  };

  const rows = files.map((row) => {
    return (
      <Table.Tr key={row.id}>
        <Table.Td>{row.title}</Table.Td>
        <Table.Td>{row.description}</Table.Td>
        <Table.Td>
          <a
            href={`https://file-server-backend-1n25.onrender.com/file/download/${row?.id}`}
            className="hover:cursor-pointer uppercase text-blue-600"
            download={true}
          >
            Download
          </a>
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <span style={{ display: "flex" }}>
              {" "}
              <Text
                onClick={(e) => ShareFile(e, row.id)}
                fz="xs"
                c="teal"
                fw={700}
                style={{ cursor: "pointer" }}
              >
                Share
              </Text>
              <IconShare3 size={20} style={{ marginLeft: 2 }} color="green" />
            </span>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <div>
        <div className="container mx-auto p-3">
          <Container>
            <Paper
              elevation={1}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                <TextInput
                  radius="xl"
                  size="md"
                  placeholder="Search for file"
                  name="name"
                  rightSectionWidth={42}
                  onChange={(e) => handleChange(e)}
                  leftSection={
                    <IconSearch
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={1.5}
                    />
                  }
                  rightSection={
                    <ActionIcon size={32} radius="xl" variant="filled">
                      <IconArrowRight
                        onClick={getFiles}
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  }
                />
              </Box>
              <Link to={"/change-password"}>
                <Button>Change Password</Button>
              </Link>
              <Box>
                <Button onClick={logout}>Logout</Button>
              </Box>
            </Paper>
          </Container>
          <div className="shadow border-b-4">
            <div className="text-red-500 font-medium text-xl">
              {message ? message : ""}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Container>
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
        </Container>
      ) : (
        <Container size={"lg"} mt={20}>
          {files?.length > 0 ? (
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Download File</Table.Th>
                    <Table.Th>Shares</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : (
            <Container>
              <Text fw={700} fs={"10rem"} style={{ textAlign: "center" }}>
                Ops!!!!!! No File found
              </Text>
            </Container>
          )}
        </Container>
      )}
    </>
  );
};

export default FeedUser;
