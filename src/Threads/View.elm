module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Html.Attributes
import RemoteData exposing (..)
import Router.Routes exposing (..)
import Styles
import Threads.Data exposing (isUnread)
import Threads.Types exposing (..)
import User.Types exposing (User)


view : Page -> WebData User -> Model -> Element Msg
view currentPage user model =
    column
        [ width (px 300)
        , clipY
        , scrollbarY
        , htmlAttribute (Html.Attributes.style "height" "100vh")
        ]
        [ renderThreadList currentPage user model ]


renderThreadList : Page -> WebData User -> Model -> Element Msg
renderThreadList currentPage pendingUser model =
    case ( model.threads, pendingUser ) of
        ( Success threads, Success user ) ->
            column [ width (maximum 260 <| fill) ]
                (List.map (renderThread currentPage user model) threads)

        ( Failure _, _ ) ->
            el [ padding 8 ] (text "Error on loading threads")

        ( _, Failure _ ) ->
            el [ padding 8 ] (text "Error on loading user")

        _ ->
            none


renderThread : Page -> User -> Model -> Thread -> Element Msg
renderThread currentPage user model thread =
    let
        threadStyle =
            if isUnread model thread.id then
                Styles.unreadThread

            else
                Styles.readThread

        currentThreadStyle =
            case currentPage of
                ChatPage threadId ->
                    if threadId == thread.id then
                        Styles.currentThread

                    else
                        []

                _ ->
                    []

        threadLink threadName =
            link ([ padding 8 ] ++ threadStyle ++ currentThreadStyle)
                { url = "/chat/" ++ thread.id
                , label = paragraph [] [ text threadName ]
                }
    in
    case thread.name of
        Just name ->
            threadLink name

        Nothing ->
            let
                threadName =
                    thread.participants
                        |> List.map .name
                        |> List.filter (\name -> name /= user.name)
                        |> String.join ", "
            in
            if threadName == "" then
                threadLink user.name

            else
                threadLink threadName
