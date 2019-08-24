module User.DataTest exposing (suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as Decode
import Test exposing (..)
import User.Data exposing (..)


suite : Test
suite =
    test "decodes json from fb api" <|
        \_ ->
            let
                fixture =
                    """
                    {"id":"110026508605123","name":"Foo Bar","type":"User","canMessage":true,"emailAddresses":["lcbllsul@tfbworknw.net"],"isBlocked":false,"isMessengerUser":true,"isPage":null,"profilePicLarge":"https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/e15/q65/p50x50/nee.jpg?_nc_cat=107&_nc_oc=","profilePicMedium":"https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/e15/q65/p50x50/nee.jpg","profilePicSmall":"https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/e15/q65/p50x50/nee.jpg"}
                    """
            in
            fixture
                |> Decode.decodeString decodeUser
                |> Result.toMaybe
                |> Maybe.map .id
                |> Expect.equal (Just "110026508605123")
