module View exposing (renderRoute, view)

import Browser
import Chat.View
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
    let
        mainView mainScreen =
            row [ width fill, height fill ]
                [ el [ padding 0, width fill, height fill ] mainScreen
                , Element.map MsgForThreads (Threads.View.view model.user.currentUser model.threads)
                ]
    in
    case model.router.page of
        Home ->
            mainView (text "Select some thread")

        NotFound ->
            text "404 Not Found"

        ChatPage threadId ->
            mainView (Element.map MsgForChat (Chat.View.view model.user threadId model.chat))
