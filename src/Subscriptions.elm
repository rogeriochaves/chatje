port module Subscriptions exposing (decodeEvent, decodeType, fbEvent, subscriptions)

import Chat.Data exposing (decodeMessage)
import Chat.Types
import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode
import Threads.Types
import Time
import Types exposing (..)


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        tenMinutes =
            10 * 60 * 1000
    in
    Sub.batch
        [ fbEvent decodeEvent
        , Time.every tenMinutes (\_ -> MsgForThreads Threads.Types.RefreshThreads)
        ]


decodeEvent : Json.Encode.Value -> Msg
decodeEvent event =
    let
        processType type_ =
            case type_ of
                "message" ->
                    Json.Decode.decodeValue (field "payload" decodeMessage) event
                        |> Result.map (MsgForChat << Chat.Types.NewMessage)

                _ ->
                    Ok (MsgForChat Chat.Types.NoOp)
    in
    Json.Decode.decodeValue decodeType event
        |> Result.andThen processType
        |> Result.withDefault (MsgForChat Chat.Types.NoOp)


decodeType : Json.Decode.Decoder String
decodeType =
    Json.Decode.field "type" Json.Decode.string


port fbEvent : (Json.Encode.Value -> msg) -> Sub msg
