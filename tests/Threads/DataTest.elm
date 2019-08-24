module Threads.DataTest exposing (suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as Decode
import Test exposing (..)
import Threads.Data exposing (..)


suite : Test
suite =
    test "decodes json from fb api" <|
        \_ ->
            let
                fixture =
                    """
                    [{"id":"100013303691123","name":"hidden","isGroup":false,"participants":[{"id":"100013303691123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null},{"id":"1980143098765868","name":"hidden","isGroup":true,"participants":[{"id":"100012163325123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100015817832123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null},{"id":"2355930154434783","name":"hidden","isGroup":true,"participants":[{"id":"100012109303123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100015817832123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null}]
                    """
            in
            fixture
                |> Decode.decodeString decodeThreads
                |> Result.toMaybe
                |> Maybe.andThen
                    (\threads ->
                        List.head threads
                            |> Maybe.map .id
                    )
                |> Expect.equal (Just "100013303691123")
