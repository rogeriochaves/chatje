module Chat.View exposing (renderMessage, renderMessagesList, view)

import Chat.Types exposing (..)
import Dict
import Element exposing (..)
import Html.Attributes
import RemoteData exposing (..)
import Styles exposing (..)
import Threads.Types exposing (Threads)


view : WebData Threads -> String -> Model -> Element Msg
view threads threadId model =
    column
        [ width fill
        , clipY
        , scrollbarY
        , htmlAttribute (Html.Attributes.style "height" "100vh")
        ]
        [ renderMessagesList threads (Dict.get threadId model.messages) ]


renderMessagesList : WebData Threads -> Maybe (WebData (List Message)) -> Element Msg
renderMessagesList pendingThreads messages =
    el [ padding 10 ]
        (case ( messages, pendingThreads ) of
            ( Just (Success messages_), Success threads ) ->
                column []
                    (List.map (renderMessage threads) messages_)

            ( Just (Failure _), _ ) ->
                text "Error on loading messages"

            ( _, Failure _ ) ->
                text "Error on loading threads"

            _ ->
                text "Loading..."
        )


renderMessage : Threads -> Message -> Element Msg
renderMessage thread message =
    paragraph [] [ text message.message ]
