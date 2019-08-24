module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Html.Attributes
import RemoteData exposing (..)
import Styles exposing (..)
import Threads.Types exposing (..)


view : Model -> Element Msg
view model =
    column
        [ width (px 300)
        , clipY
        , scrollbarY
        , htmlAttribute (Html.Attributes.style "height" "100vh")
        ]
        [ renderThreadList model ]


renderThreadList : Model -> Element Msg
renderThreadList model =
    el [ padding 10 ]
        (case model.threads of
            Loading ->
                text "Loading..."

            Success threads ->
                column
                    [ spacing 5
                    ]
                    (List.map renderThread threads)

            Failure _ ->
                text "Error on loading threads"

            NotAsked ->
                Element.none
        )


renderThread : Thread -> Element Msg
renderThread thread =
    case thread.name of
        Just name ->
            text name

        Nothing ->
            text
                (thread.participants
                    |> List.map .name
                    |> String.join ","
                 -- |> List.head
                 -- |> Maybe.map .name
                 -- |> Maybe.withDefault "unamed"
                )
