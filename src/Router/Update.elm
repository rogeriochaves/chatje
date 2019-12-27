module Router.Update exposing (init, update)

import Browser exposing (UrlRequest(..))
import Browser.Navigation exposing (Key, load, pushUrl)
import RemoteData exposing (..)
import Return exposing (Return, return)
import Router.Routes exposing (..)
import Router.Types exposing (..)
import Threads.Types exposing (ThreadSelection(..))
import Types
import Url exposing (Url)
import Url.Parser exposing (parse)


init : Url -> Key -> Return Msg Model
init url key =
    return
        { page = Maybe.withDefault NotFound <| parse routes url
        , key = key
        }
        Cmd.none


update : Types.Msg -> Model -> Return Msg Model
update msgFor model =
    case msgFor of
        Types.MsgForRouter msg ->
            updateRouter msg model

        Types.MsgForThreads (Threads.Types.LoadedThreads (Success threads)) ->
            case ( model.page, List.head threads ) of
                ( Home, Just thread ) ->
                    return model <| pushUrl model.key (toPath <| ChatPage thread.id)

                _ ->
                    return model Cmd.none

        Types.MsgForThreads (Threads.Types.SearchOrSelectThread selectedThread) ->
            case selectedThread of
                NothingSelected ->
                    return model Cmd.none

                SearchResult threadId ->
                    return model <| pushUrl model.key (toPath <| ChatPage threadId)

                RecentThread threadId ->
                    return model <| pushUrl model.key (toPath <| ChatPage threadId)

        _ ->
            return model Cmd.none


updateRouter : Msg -> Model -> Return Msg Model
updateRouter msg model =
    case msg of
        OnUrlChange url ->
            return { model | page = parseUrl url } Cmd.none

        OnUrlRequest urlRequest ->
            case urlRequest of
                Internal url ->
                    if parseUrl url == model.page then
                        ( model, Cmd.none )

                    else
                        ( model, pushUrl model.key <| Url.toString url )

                External url ->
                    ( model, load url )

        Go page ->
            return model (pushUrl model.key <| toPath page)
