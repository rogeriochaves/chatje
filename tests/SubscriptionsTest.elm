module SubscriptionsTest exposing (suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as Decode
import Subscriptions exposing (..)
import Test exposing (..)


suite : Test
suite =
    describe "Subscriptions"
        [ test "decodes type from fb events" <|
            \_ ->
                let
                    fixture =
                        """
                        {"type": "message", "payload": { "threadId": "100026508605123", "fileAttachments": [], "mediaAttachments": [], "authorId": 100026508605123, "id": "mid.$cAABa-TyDeS9y9yHj9Fsxdybkr_p4", "timestamp": 1566687665140, "message": "Let’s go", "mentions": [] }}
                        """
                in
                fixture
                    |> Decode.decodeString decodeType
                    |> Result.toMaybe
                    |> Expect.equal (Just "message")
        , test "decodes new message events" <|
            \_ ->
                let
                    fixture =
                        """
                        {"type": "message", "payload": { "threadId": "100026508605123", "fileAttachments": [], "mediaAttachments": [], "authorId": 100026508605123, "id": "mid.$cAABa-TyDeS9y9yHj9Fsxdybkr_p4", "timestamp": 1566687665140, "message": "Let’s go", "mentions": [] }}
                        """
                in
                fixture
                    |> Decode.decodeString decodeNewMessage
                    |> Result.toMaybe
                    |> Expect.equal (Just { threadId = "100026508605123", message = "Let’s go", authorId = "100026508605123", timestamp = 1566687665140 })
        ]
