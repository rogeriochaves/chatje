module Chat.Update exposing (init, update, updateChat)

import Browser.Dom
import Browser.Navigation
import Chat.Data exposing (fetchMessages, sendMessage)
import Chat.Types exposing (..)
import Dict
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types exposing (Msg(..))
import Subscriptions exposing (markAsRead)
import Task
import Time
import Types
import Url.Parser exposing (parse)
import User.Data exposing (currentUser)
import User.Types


init : Bool -> Return Chat.Types.Msg Model
init inElectron =
    return
        { messages = Dict.empty
        , draft = ""
        , zone = Time.utc
        , openInBrowserPopUp = inElectron
        }
        (Task.perform UpdateZone Time.here)


update : User.Types.Model -> Types.Msg -> Model -> Return Chat.Types.Msg Model
update user msgFor model =
    case msgFor of
        Types.MsgForChat msg ->
            updateChat user msg model

        Types.MsgForRouter (OnUrlChange url) ->
            case parseUrl url of
                ChatPage threadId ->
                    return model
                        (Cmd.batch
                            [ fetchMessages threadId
                            , scrollChat
                            , focusDraft
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

                markLastMessageAsRead =
                    case messages of
                        Success messages__ ->
                            List.reverse messages__
                                |> List.head
                                |> Maybe.map (\m -> markAsRead { threadId = threadId, authorId = m.authorId })
                                |> Maybe.withDefault Cmd.none

                        _ ->
                            Cmd.none
            in
            return { model | messages = messages_ }
                (Cmd.batch
                    [ scrollChat
                    , markLastMessageAsRead
                    ]
                )

        UpdateDraft text ->
            return { model | draft = text } Cmd.none

        SendMessage threadId ->
            case currentUser user of
                Just user_ ->
                    return { model | draft = "" } (sendMessage user_.id threadId model.draft)

                Nothing ->
                    return model Cmd.none

        NewMessage newMessage ->
            let
                updatedMessageList =
                    case Dict.get newMessage.threadId model.messages of
                        Just (Success messages_) ->
                            case ( currentUser user, List.reverse messages_ |> List.head ) of
                                ( Just user_, Just lastMessage ) ->
                                    if lastMessage.authorId == user_.id && lastMessage.message == newMessage.message then
                                        Success messages_

                                    else
                                        Success (messages_ ++ [ newMessage ])

                                _ ->
                                    Success (messages_ ++ [ newMessage ])

                        Nothing ->
                            Success [ newMessage ]

                        Just any ->
                            any

                updatedMessages =
                    Dict.insert newMessage.threadId updatedMessageList model.messages
            in
            return { model | messages = updatedMessages } scrollChat

        ScrollChat ->
            return model scrollChat

        MessageSent message ->
            return model
                (Task.perform
                    (\time ->
                        NewMessage { message | timestamp = Time.posixToMillis time }
                    )
                    Time.now
                )

        UpdateZone zone ->
            return { model | zone = zone } Cmd.none

        CloseOpenInBrowserPopup ->
            return { model | openInBrowserPopUp = False } Cmd.none

        OpenInBrowser ->
            return model (Browser.Navigation.load "/open-in-browser")


scrollChat : Cmd Chat.Types.Msg
scrollChat =
    Browser.Dom.getViewportOf "chat"
        |> Task.andThen (\info -> Browser.Dom.setViewportOf "chat" 0 info.scene.height)
        |> Task.attempt (\_ -> NoOp)


focusDraft : Cmd Chat.Types.Msg
focusDraft =
    Browser.Dom.focus "draft-field"
        |> Task.attempt (\_ -> NoOp)
