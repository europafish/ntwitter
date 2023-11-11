import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";

import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

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

  return (
    <>
      <NweetFactory userObj={userObj} />
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
