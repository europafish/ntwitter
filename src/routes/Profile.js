import { authService, dbService } from "fbase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = ({ userObj, refreshUser }) => {
  let navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };
  /*
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweet")
      .where("creatorId", "==", userObj.uid)
      .orderBy("creatorId", "asc")
      .get();

    console.log(nweets.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  */
  const history = useNavigate();
  return (
    <div
      style={{
        maxWidth: 890,
        width: "100%",
        margin: "0 auto",
        marginTop: 80,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            type="text"
            placeholder="Display Name"
            onChange={onChange}
            value={newDisplayName}
            autoFocus
            className="formInput"
          />
          <input
            type="submit"
            className="formBtn"
            style={{ marginTop: 10 }}
            value="Update Profile"
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
