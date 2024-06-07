import { useState } from "react";
import FileServerEndpoints from "../service/FileServerEndpoints";
import { Link, useParams } from "react-router-dom";
import { Button, Input } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";

const ShareFile = ({ user }) => {
  const { fileId } = useParams();
  const [fileBody, setFileBody] = useState({
    fileId,
    receiverEmail: "",
  });

  const sendFile = (e) => {
    e.preventDefault();
    FileServerEndpoints.shareFile(fileBody)
      .then((response) => {
        console.log(response);
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFileBody({ ...fileBody, [e.target.name]: value });
  };

  console.log(user);

  return (
    <div className="p-11">
      <form className="mx-auto flex flex-col md:flex-row border-b shadow max-w-2xl">
        <div className="p-11">
          <div>
            <label className="font-semibold text-xl">
              Enter receiver email:
            </label>
            <Input
              type="email"
              name="receiverEmail"
              value={fileBody.receiverEmail}
              className="w-full md:w-[30rem]"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="mt-2 flex flex-col md:flex-row">
            <Button mr={30} onClick={sendFile} className="mb-2 md:mb-0">
              Send file
            </Button>
            {user.isAdmin ? (
              <Link to={"/admin"}>
                <Button
                  variant="light"
                  leftSection={<IconArrowBack size={14} />}
                >
                  Back to Files
                </Button>
              </Link>
            ) : (
              <Link to={"/user"}>
                <Button
                  variant="light"
                  leftSection={<IconArrowBack size={14} />}
                >
                  Back to Files
                </Button>
              </Link>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShareFile;
