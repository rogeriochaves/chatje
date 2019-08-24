module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Html.Attributes
import RemoteData exposing (..)
import Styles exposing (..)
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
    el [ padding 10 ]
        (case ( model.threads, pendingUser ) of
            ( Success threads, Success user ) ->
                column
                    [ spacing 8
                    ]
                    (List.map (renderThread user) threads)

            ( Failure _, _ ) ->
                text "Error on loading threads"

            ( _, Failure _ ) ->
                text "Error on loading user"

            _ ->
                text "Loading..."
        )


renderThread : User -> Thread -> Element Msg
renderThread user thread =
    case thread.name of
        Just name ->
            paragraph [ width (px 260) ] [ text name ]

        Nothing ->
            let
                threadName =
                    thread.participants
                        |> List.map .name
                        |> List.filter (\name -> name /= user.name)
                        |> String.join ", "
            in
            if threadName == "" then
                Element.none

            else
                paragraph [ width (px 260) ] [ text threadName ]
