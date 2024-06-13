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
  Modal,
  rem,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCloudUpload,
  IconSearch,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const FeedAdmin = ({ user, dispatchUser }) => {
  const navigate = useNavigate();
  const [noTransitionOpened, setNoTransitionOpened] = useState(false);

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState({
    name: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [fileName, setFileName] = useState("");

  const deleteFile = async (fileId) => {
    try {
      setIsLoading(true);
      const { data } = await FileServerEndpoints.deleteFileById(fileId, user);
      if (files) {
        setFiles((prevFiles) => {
          setMessage(data);
          setIsLoading(false);
          setNoTransitionOpened(false);
          return prevFiles.filter((file) => file.id != fileId);
        });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch({ ...search, [e.target.name]: value });
  };

  const handleDeleteFile = async (file) => {
    setFileName(file);
    setNoTransitionOpened(true);
  };

  const getFiles = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!search.name) return;
      const { data } = await FileServerEndpoints.adminSearchForFile(
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

  const downloadFile = (e, fileId, user) => {
    e.preventDefault();

    FileServerEndpoints.downloadFile(fileId, user).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.match(/filename="?([^"]+)"?/)[1]
        : "downloaded_file";

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await FileServerEndpoints.adminGetAllFiles(user);
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
            href="#"
            className="hover:cursor-pointer uppercase text-blue-600"
            onClick={(e) => downloadFile(e, row.id, user)}
          >
            Download
          </a>
        </Table.Td>
        <Table.Td>{row.numberOfDownloads}</Table.Td>
        <Table.Td> {row.numberOfShares}</Table.Td>
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
            <span style={{ display: "flex" }}>
              <Text
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteFile(row)}
                fz="xs"
                c="red"
                fw={700}
              >
                Delete
              </Text>
              <IconTrash size={17} style={{ marginLeft: 2 }} color="red" />
            </span>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Modal
        opened={noTransitionOpened}
        onClose={() => setNoTransitionOpened(false)}
        title={
          <Text fw={700}>
            Are you sure You want to delete{" "}
            <span style={{ fontSize: 15, color: "red" }}>
              {fileName?.title}{" "}
            </span>
          </Text>
        }
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <Button
          bg={"red"}
          loading={isLoading}
          onClick={() => deleteFile(fileName?.id)}
          style={{ width: "5rem" }}
          c={"white"}
          mr={"2rem"}
        >
          {" "}
          Yes
        </Button>
        <Button c={"white"} onClick={() => setNoTransitionOpened(false)}>
          {" "}
          No
        </Button>
      </Modal>
      <div>
        <div className="container mx-auto p-3">
          <Container>
            <Paper
              elevation={1}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Link to={"/upload-file"}>
                <Button rightSection={<IconCloudUpload />}> Upload File</Button>
              </Link>

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
                <Button onClick={logout}>Loguot</Button>
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
                    <Table.Th>Downloads</Table.Th>
                    <Table.Th>Shares</Table.Th>
                    <Table.Th>Actions</Table.Th>
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

export default FeedAdmin;
