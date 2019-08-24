module User.Data exposing (currentUser, decodeUser, fetchUser)

import Array exposing (Array, map)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import RemoteData exposing (..)
import User.Types exposing (..)


fetchUser : Cmd Msg
fetchUser =
    let
        returnMsg =
            RemoteData.fromResult >> LoadedUser
    in
    Http.get
        { url = "/api/user"
        , expect = Http.expectJson returnMsg decodeUser
        }


decodeUser : Decoder.Decoder User
decodeUser =
    Decoder.succeed User
        |> required "id" Decoder.string
        |> required "name" Decoder.string


currentUser : Model -> Maybe User
currentUser model =
    case model.currentUser of
        Success user ->
            Just user

        _ ->
            Nothing
