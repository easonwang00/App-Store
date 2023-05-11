import { useState } from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import React from "react";
import { App as SendBirdApp } from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";
import { SendBirdProvider } from "sendbird-uikit";
import SendBird from "sendbird";
import "./styles.css";
//
console.log(localStorage.getItem("authToken"));
const USER_ID = sessionStorage.getItem("userName");
console.log("chat window user id: ", USER_ID);
const USER_ID2 = sessionStorage.getItem("sellerUser");
console.log("chat window seller id: ", USER_ID2);
const USER_ID3 = "User1";
const APP_ID = "8E3A48E5-36A4-487A-869D-81B46C77616B";
const newU = "User6";

// check if userA and userB already have a channel
async function checker(userA, userB) {
  const sb = new SendBird({ appId: APP_ID });
  const user = sb.currentUser;
  if (!user) {
    const userId = userA;
    const nickname = userA;
    const profileUrl = "";
    sb.connect(userId, (user, error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  }

  const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  channelListQuery.includeEmpty = true;
  channelListQuery.limit = 100;

  // Create a Promise that resolves with the boolean value of whether the userB is found or not
  return new Promise((resolve, reject) => {
    // Retrieve the user's group channels
    channelListQuery.next((channels, error) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        // Iterate through the list of channels
        for (const channel of channels) {
          // Check if the channel includes both User A and User B

          const members = channel.members;
          for (const member of members) {
            if (member.userId === userB) {
              console.log("UserB found");
              resolve(true);
            }
          }
        }

        // If no group channel was found, resolve with false
        //console.log("No group channel found, create a new one");
        resolve(false);
      }
    });
  });
}

async function setUp() {
  const sb = new SendBird({ appId: APP_ID });

  const user = sb.currentUser;

  if (!user) {
    const userId = USER_ID;
    const nickname = USER_ID;
    const profileUrl =
      "https://storage.prompt-hunt.workers.dev/clebq7eu60001l508nnlflssc_1.png";
    await sb.connect(userId, (user, error) => {
      if (error) {
        console.error(error);
        return;
      }
      // sb.updateCurrentUserInfo(nickname, profileUrl, (response, error) => {
      //   if (error) {
      //     console.error(error);
      //     return;
      //   }
      //   console.log("User created and updated:", user);
      // });
    });

    const params = new sb.GroupChannelParams();
    params.isDistinct = true;
    params.addUserIds([USER_ID, USER_ID2]);

    var userIds = [USER_ID, USER_ID2];
    var key2;
    if (USER_ID2 == null) {
      return;
    }
    checker(USER_ID, USER_ID2).then((key) => {
      if (key != true) {
        sb.GroupChannel.createChannelWithUserIds(
          userIds,
          true,
          (channel, error) => {
            if (error) {
              console.error(error);
              return;
            }
            console.log("Channel created222:", channel);

            const params = new sb.UserMessageParams();
            params.message = "Hi, I'm " + USER_ID;

            // The pending message is being returned when sendUserMessage is called.
            // The pending message has the same reqId value as the corresponding failed/succeeded message that will be received through the callback.
            const pendingUserMessage = channel.sendUserMessage(
              params,
              function (message, error) {
                if (error) {
                  return;
                  // Handle error. The failed message could be null depending on the error code.
                }
                console.log("Message sent:", message);
                // The message is successfully sent to the channel.
                // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
              }
            );
          }
        );
      }
    });
  }
}

function Sendbird() {
  const [key, setKey] = React.useState(true);

  const Chat = () => {
    useEffect(() => {
      setUp();
    }, []);

    return (
      <>
        <div className="App">
          <SendBirdApp appId="APP_ID" userId={USER_ID} />
        </div>
      </>
    );
  };

  const clickHandler = () => {
    setKey(!key);
  };
  return (
    <>
      <Chat />
    </>
  );
}

export default Sendbird;
