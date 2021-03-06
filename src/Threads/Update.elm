module Threads.Update exposing (init, update, updateThreads)

import Chat.Types
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types
import Set
import Threads.Data exposing (fetchSearch, fetchThreads, isUnread)
import Threads.Types exposing (..)
import Types


init : Return Msg Model
init =
    return
        { threads = Loading
        , unreads = Set.empty
        , searchQuery = ""
        , searchResult = NotAsked
        , selectedIndex = Nothing
        }
        Threads.Data.fetchThreads


update : Page -> Types.Msg -> Model -> Return Msg Model
update currentPage msgFor model =
    case msgFor of
        Types.MsgForThreads msg ->
            updateThreads currentPage msg model

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
                        Set.insert threadId model.unreads

                    else
                        model.unreads

                existingThread =
                    case model.threads of
                        Success threads_ ->
                            List.filter (\{ id } -> id == threadId) threads_
                                |> List.head

                        _ ->
                            Nothing

                updatedThreads =
                    RemoteData.map
                        (\threads ->
                            case existingThread of
                                Just existingThread_ ->
                                    existingThread_
                                        :: List.filter (\{ id } -> id /= threadId) threads

                                Nothing ->
                                    { id = threadId
                                    , name = Just threadId
                                    , participants = []
                                    , unread = True
                                    }
                                        :: threads
                        )
                        model.threads

                command =
                    if existingThread == Nothing then
                        fetchThreads

                    else
                        Cmd.none
            in
            return { model | threads = updatedThreads, unreads = unreads } command

        Types.MsgForRouter (Router.Types.OnUrlChange url) ->
            case parseUrl url of
                ChatPage threadId ->
                    let
                        unreads =
                            Set.remove threadId model.unreads
                    in
                    return { model | unreads = unreads } Cmd.none

                _ ->
                    return model Cmd.none

        _ ->
            return model Cmd.none


updateThreads : Page -> Msg -> Model -> Return Msg Model
updateThreads currentPage msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedThreads threads ->
            let
                currentThread =
                    case currentPage of
                        ChatPage threadId ->
                            threadId

                        _ ->
                            ""

                newUnreads =
                    case threads of
                        Success threads_ ->
                            List.filter .unread threads_
                                |> List.map .id
                                |> List.filter ((/=) currentThread)
                                |> Set.fromList

                        _ ->
                            Set.empty
            in
            return
                { model
                    | threads = threads
                    , unreads = Set.union model.unreads newUnreads
                }
                Cmd.none

        RefreshThreads ->
            return model fetchThreads

        UpdateSearch searchQuery ->
            return { model | searchQuery = searchQuery, searchResult = NotAsked, selectedIndex = Nothing } Cmd.none

        SearchOrSelectThread selectedThread ->
            case selectedThread of
                NothingSelected ->
                    return { model | searchResult = Loading } (fetchSearch model.searchQuery)

                _ ->
                    return { model | selectedIndex = Nothing, searchQuery = "", searchResult = NotAsked } Cmd.none

        LoadedSearch result ->
            return { model | searchResult = result } Cmd.none

        IndexDown ->
            let
                nextItem =
                    case model.selectedIndex of
                        Nothing ->
                            Just 0

                        Just index ->
                            if index >= lastItem model then
                                Nothing

                            else
                                Just <| index + 1
            in
            return { model | selectedIndex = nextItem } Cmd.none

        IndexUp ->
            let
                prevItem =
                    case model.selectedIndex of
                        Nothing ->
                            Just <| lastItem model

                        Just index ->
                            if index <= 0 then
                                Nothing

                            else
                                Just <| index - 1
            in
            return { model | selectedIndex = prevItem } Cmd.none


lastItem : Model -> Int
lastItem model =
    case ( model.searchResult, model.threads ) of
        ( Success users, _ ) ->
            List.length users - 1

        ( _, Success threads ) ->
            List.length threads - 1

        _ ->
            0
