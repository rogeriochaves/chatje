module View exposing (renderRoute, view)

import Browser
import Element exposing (..)
import Element.Events exposing (..)
import Element.Input exposing (button)
import Element.Region exposing (..)
import Router.Routes exposing (..)
import Router.Types exposing (Msg(..))
import Styles
import Threads.View
import Types exposing (..)


view : Model -> Browser.Document Types.Msg
view model =
    { title = "BasicMessenger"
    , body = [ Element.layout ([ width fill ] ++ Styles.body) <| renderRoute model ]
    }


renderRoute : Model -> Element Types.Msg
renderRoute model =
    case model.router.page of
        Home ->
            row [ width fill, height fill ]
                [ el [ width fill, height fill ] (text "Messages will go here")
                , Element.map MsgForThreads (Threads.View.view model.user.user model.threads)
                ]

        NotFound ->
            text "404 Not Found"
