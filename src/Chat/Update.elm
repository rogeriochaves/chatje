module Chat.Update exposing (init, update, updateChat)

import Browser.Dom
import Chat.Data exposing (fetchMessages, sendMessage)
import Chat.Types exposing (..)
import Dict
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types exposing (Msg(..))
import Task
import Types
import Url.Parser exposing (parse)
import User.Data exposing (currentUser)
import User.Types


init : Return Chat.Types.Msg Model
init =
    return
        { messages = Dict.empty
        , draft = ""
        }
        Cmd.none


update : User.Types.Model -> Types.Msg -> Model -> Return Chat.Types.Msg Model
update user msgFor model =
    case msgFor of
        Types.MsgForChat msg ->
            updateChat user msg model

        Types.MsgForRouter (OnUrlChange url) ->
            let
                page =
                    Maybe.withDefault NotFound <| parse routes url
            in
            case page of
                ChatPage threadId ->
                    return model
                        (Cmd.batch
                            [ fetchMessages threadId
                            , scrollChat
                            ]
                        )

                _ ->
                    return model Cmd.none

        _ ->
            return model Cmd.none


updateChat : User.Types.Model -> Chat.Types.Msg -> Model -> Return Chat.Types.Msg Model
updateChat user msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedMessages threadId messages ->
            let
                messages_ =
                    model.messages |> Dict.insert threadId messages
            in
            return { model | messages = messages_ } scrollChat

        UpdateDraft text ->
            return { model | draft = text } Cmd.none

        SendMessage threadId ->
            case currentUser user of
                Just user_ ->
                    return { model | draft = "" } (sendMessage user_.id threadId model.draft)

                Nothing ->
                    return model Cmd.none

        NewMessage { threadId, timestamp, authorId, message } ->
            let
                newMessage =
                    { timestamp = timestamp, authorId = authorId, message = message }

                updatedMessageList =
                    case Dict.get threadId model.messages of
                        Just (Success messages_) ->
                            Success (messages_ ++ [ newMessage ])

                        Nothing ->
                            Success [ newMessage ]

                        Just any ->
                            any

                updatedMessages =
                    Dict.insert threadId updatedMessageList model.messages
            in
            return { model | messages = updatedMessages } scrollChat


scrollChat : Cmd Chat.Types.Msg
scrollChat =
    Browser.Dom.getViewportOf "chat"
        |> Task.andThen (\info -> Browser.Dom.setViewportOf "chat" 0 info.scene.height)
        |> Task.attempt (\_ -> NoOp)
