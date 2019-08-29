module Threads.Data exposing (decodeThreads, fetchThreads, isUnread)

import Array exposing (Array, map)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder)
import Json.Decode.Pipeline exposing (hardcoded, optional, required)
import RemoteData exposing (..)
import Set
import Threads.Types exposing (..)


fetchThreads : Cmd Msg
fetchThreads =
    let
        returnMsg =
            RemoteData.fromResult >> LoadedThreads
    in
    Http.get
        { url = "/api/threads"
        , expect = Http.expectJson returnMsg decodeThreads
        }


decodeThreads : Decoder.Decoder Threads
decodeThreads =
    Decoder.list decodeThread


decodeThread : Decoder.Decoder Thread
decodeThread =
    Decoder.succeed Thread
        |> required "id" Decoder.string
        |> required "name" (Decoder.nullable Decoder.string)
        |> required "participants" (Decoder.list decodeParticipant)
        |> required "unreadCount" (Decoder.int |> Decoder.map (\unreads -> unreads > 0))


decodeParticipant : Decoder.Decoder Participant
decodeParticipant =
    Decoder.succeed Participant
        |> required "id" Decoder.string
        |> required "name" Decoder.string


isUnread : Model -> String -> Bool
isUnread model threadId =
    Set.member threadId model.unreads
