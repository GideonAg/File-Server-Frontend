import { useState } from "react";
import FileServerEndpoints from "../service/FileServerEndpoints";
import { Button, Input } from "@mantine/core";

const ForgotPassword = () => {
  const [user, setUser] = useState({
    email: "",
  });

  const passwordChange = (e) => {
    e.preventDefault();
    FileServerEndpoints.forgotPassword(user)
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  return (
    <div className="p-11">
      <form className="mx-auto flex border-b shadow max-w-2xl">
        <div className="p-11">
          <div>
            <label className="font-semibold text-xl">Enter your email:</label>
            <Input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => handleChange(e)}
            ></Input>
          </div>
          <div className="mt-2">
            <Button onClick={passwordChange}>Send</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
