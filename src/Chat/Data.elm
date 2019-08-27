module Chat.Data exposing (decodeMessages, fetchMessages, sendMessage)

import Array exposing (Array, map)
import Chat.Types exposing (..)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as Encoder
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
        |> required "timestamp" Decoder.int
        |> required "authorId" Decoder.string
        |> required "message" Decoder.string
        |> required "stickerId" (Decoder.nullable (Decoder.field "id" Decoder.string))
        |> required "fileAttachments"
            (Decoder.oneOf
                [ Decoder.list (Decoder.field "url" Decoder.string)
                    |> Decoder.map List.head
                , Decoder.succeed Nothing
                ]
            )


sendMessage : String -> String -> String -> Cmd Msg
sendMessage currentUserId threadId message =
    let
        returnMsg =
            RemoteData.fromResult
                >> (\res ->
                        case res of
                            Success True ->
                                MessageSent
                                    { threadId = threadId
                                    , message = message
                                    , authorId = currentUserId
                                    , timestamp = 0
                                    }

                            _ ->
                                UpdateDraft message
                   )
    in
    Http.post
        { url = "/api/messages/" ++ threadId ++ "/send"
        , body =
            Http.jsonBody
                (Encoder.object
                    [ ( "message", Encoder.string message )
                    ]
                )
        , expect = Http.expectJson returnMsg (Decoder.field "succeeded" Decoder.bool)
        }
