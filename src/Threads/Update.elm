module Threads.Update exposing (init, update, updateThreads)

import Chat.Types
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types
import Threads.Data exposing (fetchThreads, isUnread)
import Threads.Types exposing (..)
import Types


init : Return Msg Model
init =
    return
        { threads = Loading
        , unreads = []
        }
        Threads.Data.fetchThreads


update : Page -> Types.Msg -> Model -> Return Msg Model
update currentPage msgFor model =
    case msgFor of
        Types.MsgForThreads msg ->
            updateThreads msg model

        Types.MsgForChat (Chat.Types.NewMessage { threadId, timestamp, authorId }) ->
            let
                isIncommingMessage =
                    timestamp /= 0

                isCurrentThread =
                    case currentPage of
                        ChatPage currentThreadId ->
                            currentThreadId == threadId

                        _ ->
                            False

                unreads =
                    if isIncommingMessage && not isCurrentThread then
                        threadId :: model.unreads

                    else
                        model.unreads

                existingThread =
                    RemoteData.map (List.filter (\{ id } -> id == threadId) >> List.length) model.threads
                        |> (==) (Success 1)

                updatedThreads =
                    if existingThread then
                        model.threads

                    else
                        RemoteData.map
                            (\threads ->
                                { id = threadId
                                , name = Just threadId
                                , participants = []
                                }
                                    :: threads
                            )
                            model.threads

                command =
                    if existingThread then
                        Cmd.none
                    else
                        fetchThreads
            in
            return { model | threads = updatedThreads, unreads = unreads } Cmd.none

        Types.MsgForRouter (Router.Types.OnUrlChange url) ->
            case parseUrl url of
                ChatPage threadId ->
                    let
                        unreads =
                            List.filter ((/=) threadId) model.unreads
                    in
                    return { model | unreads = unreads } Cmd.none

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

        RefreshThreads ->
            return model fetchThreads
