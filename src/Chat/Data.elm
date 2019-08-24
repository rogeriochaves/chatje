module Chat.Data exposing (decodeMessages, fetchMessages)

import Array exposing (Array, map)
import Chat.Types exposing (..)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import RemoteData exposing (..)


fetchMessages : String -> Cmd Msg
fetchMessages threadId =
    let
        returnMsg =
            RemoteData.fromResult >> LoadedMessages threadId
    in
    Http.get
        { url = "/api/messages/" ++ threadId
        , expect = Http.expectJson returnMsg decodeMessages
        }


decodeMessages : Decoder.Decoder (List Message)
decodeMessages =
    Decoder.list decodeMessage


decodeMessage : Decoder.Decoder Message
decodeMessage =
    Decoder.succeed Message
        |> required "id" Decoder.string
        |> required "timestamp" Decoder.int
        |> required "authorId" Decoder.string
        |> required "message" Decoder.string
