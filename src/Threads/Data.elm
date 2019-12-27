module Threads.Data exposing (decodeSearchResults, decodeThreads, fetchSearch, fetchThreads, isUnread, searchFilter, selectedThread, threadName)

import Array exposing (Array, map)
import Dict exposing (Dict, map, toList)
import Http
import Json.Decode as Decoder exposing (Decoder)
import Json.Decode.Pipeline exposing (hardcoded, optional, required)
import RemoteData exposing (..)
import Set
import Threads.Types exposing (..)
import Url exposing (percentEncode)
import User.Types exposing (User)


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


fetchSearch : String -> Cmd Msg
fetchSearch query =
    let
        returnMsg =
            RemoteData.fromResult >> LoadedSearch
    in
    Http.get
        { url = "/api/threads/search?q=" ++ percentEncode query
        , expect = Http.expectJson returnMsg decodeSearchResults
        }


decodeSearchResults : Decoder.Decoder (List Participant)
decodeSearchResults =
    Decoder.list
        (Decoder.field "node"
            (Decoder.succeed Participant
                |> required "id" Decoder.string
                |> required "name" Decoder.string
            )
        )


threadName : User -> Thread -> String
threadName user thread =
    let
        threadName_ =
            thread.participants
                |> List.map .name
                |> List.filter (\name -> name /= user.name)
                |> String.join ", "
    in
    case thread.name of
        Just name ->
            name

        Nothing ->
            if threadName_ == "" then
                user.name

            else
                threadName_


searchFilter : User -> Model -> Thread -> Bool
searchFilter user model thread =
    String.contains
        (String.toLower model.searchQuery)
        (String.toLower <| threadName user thread)


selectedThread : WebData User -> Model -> ThreadSelection
selectedThread user model =
    case user of
        Success user_ ->
            case ( model.selectedIndex, model.searchResult, model.threads ) of
                ( Just index, Success users, _ ) ->
                    List.drop index users
                        |> List.head
                        |> Maybe.map (SearchResult << .id)
                        |> Maybe.withDefault NothingSelected

                ( Just index, _, Success threads ) ->
                    threads
                        |> List.filter (searchFilter user_ model)
                        |> List.drop index
                        |> List.head
                        |> Maybe.map (RecentThread << .id)
                        |> Maybe.withDefault NothingSelected

                _ ->
                    NothingSelected

        _ ->
            NothingSelected
