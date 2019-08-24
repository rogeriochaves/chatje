module Chat.Update exposing (init, update, updateChat)

import Chat.Data exposing (fetchMessages, sendMessage)
import Chat.Types exposing (..)
import Dict
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types exposing (Msg(..))
import Types
import Url.Parser exposing (parse)


init : Return Chat.Types.Msg Model
init =
    return
        { messages = Dict.empty
        , draft = ""
        }
        Cmd.none


update : Types.Msg -> Model -> Return Chat.Types.Msg Model
update msgFor model =
    case msgFor of
        Types.MsgForChat msg ->
            updateChat msg model

        Types.MsgForRouter (OnUrlChange url) ->
            let
                page =
                    Maybe.withDefault NotFound <| parse routes url
            in
            case page of
                ChatPage threadId ->
                    return model (fetchMessages threadId)

                _ ->
                    return model Cmd.none

        _ ->
            return model Cmd.none


updateChat : Chat.Types.Msg -> Model -> Return Chat.Types.Msg Model
updateChat msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedMessages threadId messages ->
            let
                messages_ =
                    model.messages |> Dict.insert threadId messages
            in
            return { model | messages = messages_ } Cmd.none

        UpdateDraft text ->
            return { model | draft = text } Cmd.none

        SendMessage threadId ->
            return { model | draft = "" } (sendMessage threadId model.draft)
