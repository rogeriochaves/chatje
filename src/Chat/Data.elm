module Chat.Data exposing (decodeMessage, decodeMessages, fetchMessages, sendMessage)

import Array exposing (Array, map)
import Chat.Types exposing (..)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder, bool, field, int, list, nullable, oneOf, string)
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
        |> required "threadId" string
        |> required "timestamp" int
        |> required "authorId" stringOrInt
        |> required "message" string
        |> optional "stickerId"
            (nullable <|
                oneOf
                    [ field "id" stringOrInt
                    , stringOrInt
                    ]
            )
            Nothing
        |> required "fileAttachments"
            (Decoder.oneOf
                [ Decoder.list
                    (Decoder.succeed Image
                        |> required "url" string
                        |> required "metadata" (field "width" int)
                        |> required "metadata" (field "height" int)
                    )
                    |> Decoder.map List.head
                , Decoder.succeed Nothing
                ]
            )


stringOrInt =
    oneOf [ string, int |> Decoder.map String.fromInt ]


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
                                    , stickerId = Nothing
                                    , image = Nothing
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
        , expect = Http.expectJson returnMsg (field "succeeded" bool)
        }
