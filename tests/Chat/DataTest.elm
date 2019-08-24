module Chat.DataTest exposing (suite)

import Chat.Data exposing (..)
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as Decode
import Test exposing (..)


suite : Test
suite =
    test "decodes json from fb api" <|
        \_ ->
            let
                fixture =
                    """
                    [
                        {
                            "id": "mid.$gAAYbGLd3yNpy78gXX1svoLOnBL9-",
                            "timestamp": 1566564339551,
                            "authorId": "100011842533123",
                            "threadId": "1718642831509722",
                            "message": "*love = lovely",
                            "fileAttachments": [
                                {
                                    "type": "ImageAttachment",
                                    "id": "885388931845123",
                                    "mimeType": "image/jpeg",
                                    "filename": "image-885388931845123",
                                    "size": 1474706,
                                    "url": "http://someurl",
                                    "metadata": {
                                    "width": 1080,
                                    "height": 1080
                                    }
                                }
                            ],
                            "mediaAttachments": [],
                            "stickerId": null
                        },
                        {
                            "id": "mid.$gAAYbGLd3yNpy78hK0FsvoMBviRiY",
                            "timestamp": 1566564352720,
                            "authorId": "100012117163123",
                            "threadId": "1718642831509722",
                            "message": "We're on a roll! :)",
                            "fileAttachments": [],
                            "mediaAttachments": [],
                            "stickerId": null
                        },
                        {
                            "id": "mid.$gAAYbGLd3yNpy8FjdVlsvxMh0QTAQ",
                            "timestamp": 1566573827414,
                            "authorId": "100026508605123",
                            "threadId": "1718642831509722",
                            "message": "bla bla bla",
                            "fileAttachments": [],
                            "mediaAttachments": [],
                            "stickerId": null
                        },
                        {
                            "id": "mid.$gAAYbGLd3yNpy8HM8KFsvy3zmZKbW",
                            "timestamp": 1566575555624,
                            "authorId": "100012117163123",
                            "threadId": "1718642831509722",
                            "message": "So, we will investigate on Monday? 😊",
                            "fileAttachments": [],
                            "mediaAttachments": [],
                            "stickerId": null
                        },
                        {
                            "id": "mid.$gAAYbGLd3yNpy8HOJ2Vsvy5BtsT8i",
                            "timestamp": 1566575575513,
                            "authorId": "100011842533123",
                            "threadId": "1718642831509722",
                            "message": "Yes, we will make chat great again.",
                            "fileAttachments": [],
                            "mediaAttachments": [],
                            "stickerId": null
                        }
                    ]
                    """
            in
            fixture
                |> Decode.decodeString decodeMessages
                |> Result.toMaybe
                |> Maybe.andThen
                    (\message ->
                        List.head message
                            |> Maybe.map .message
                    )
                |> Expect.equal (Just "*love = lovely")
