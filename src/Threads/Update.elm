module Threads.Update exposing (init, update, updateThreads)

import Chat.Types
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types
import Threads.Data
import Threads.Types exposing (..)
import Types


init : Return Msg Model
init =
    return
        { threads = Loading
        }
        Threads.Data.fetchThreads


update : Page -> Types.Msg -> Model -> Return Msg Model
update currentPage msgFor model =
    case msgFor of
        Types.MsgForThreads msg ->
            updateThreads msg model

        Types.MsgForChat (Chat.Types.NewMessage { threadId, timestamp }) ->
            let
                isIncommingMessage =
                    timestamp /= 0

                isCurrentThread =
                    case currentPage of
                        ChatPage currentThreadId ->
                            currentThreadId == threadId

                        _ ->
                            False

                markAsUnread =
                    isIncommingMessage && not isCurrentThread
            in
            return { model | threads = updateThreadUnreadStatus model threadId markAsUnread } Cmd.none

        Types.MsgForRouter (Router.Types.OnUrlChange url) ->
            case parseUrl url of
                ChatPage threadId ->
                    return { model | threads = updateThreadUnreadStatus model threadId False } Cmd.none

                _ ->
                    return model Cmd.none

        _ ->
            return model Cmd.none


updateThreads : Msg -> Model -> Return Msg Model
updateThreads msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedThreads threads ->
            return { model | threads = threads } Cmd.none


updateThreadUnreadStatus : Model -> String -> Bool -> WebData Threads
updateThreadUnreadStatus model threadId unread =
    RemoteData.map
        (List.map
            (\thread ->
                if thread.id == threadId then
                    { thread | unread = unread }

                else
                    thread
            )
        )
        model.threads
