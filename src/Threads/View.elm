module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Html.Attributes
import RemoteData exposing (..)
import Styles
import Threads.Types exposing (..)
import User.Types exposing (User)


view : WebData User -> Model -> Element Msg
view user model =
    column
        [ width (px 300)
        , clipY
        , scrollbarY
        , htmlAttribute (Html.Attributes.style "height" "100vh")
        ]
        [ renderThreadList user model ]


renderThreadList : WebData User -> Model -> Element Msg
renderThreadList pendingUser model =
    case ( model.threads, pendingUser ) of
        ( Success threads, Success user ) ->
            column [ width (maximum 260 <| fill) ]
                (List.map (renderThread user) threads)

        ( Failure _, _ ) ->
            el [ padding 8 ] (text "Error on loading threads")

        ( _, Failure _ ) ->
            el [ padding 8 ] (text "Error on loading user")

        _ ->
            none


renderThread : User -> Thread -> Element Msg
renderThread user thread =
    let
        threadStyle =
            if thread.unread then
                Styles.unreadThread

            else
                []

        threadLink threadName =
            link ([ padding 8 ] ++ threadStyle)
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
