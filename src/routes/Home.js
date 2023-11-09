import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [nweet, setNweet] = useState("");

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

    // add
    await dbService.collection("nweet").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

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
        <input type="submit" value="Nweet" />
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
