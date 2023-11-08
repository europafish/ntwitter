import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  let navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const history = useNavigate();
  return (
    <>
      <button onClick={onLogOutClick}>Logout</button>
    </>
  );
};

export default Profile;
