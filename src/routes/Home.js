import { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  // const getNweet = async () => {
  //   const dbNweets = await dbService.collection("nweet").get();
  //   dbNweets.forEach((doc) => {
  //     const nweetObject = { ...doc.data(), id: doc.id };

  //     setNweets((prev) => {
  //       return [nweetObject, ...prev];
  //     });
  //   });
  // };

  useEffect(() => {
    //getNweet();

    dbService.collection("nweet").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNweets(newArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      const response = await attachmentRef.putString(attachment, "data_url");

      attachmentUrl = await response.ref.getDownloadURL();
    }

    // add

    await dbService.collection("nweet").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    event.preventDefault();
    //console.log(event.target.files);
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };

    reader.readAsDataURL(theFile);
  };
  const onClearAttach = () => setAttachment("");

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="nweet"
          value={nweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          required
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttach}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );

  return <span>Home</span>;
};

export default Home;
