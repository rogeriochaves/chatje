module View exposing (renderRoute, view)

import Browser
import Chat.View
import Dict
import Element exposing (..)
import Element.Events exposing (..)
import Element.Input exposing (button)
import Element.Region exposing (..)
import RemoteData exposing (..)
import Router.Routes exposing (..)
import Router.Types exposing (Msg(..))
import Styles
import Threads.View
import Types exposing (..)
import User.View


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

        showLoading inChat view_ =
            case ( model.user.currentUser, model.threads.threads, inChat ) of
                ( Loading, _, _ ) ->
                    el [ centerX, centerY ] (text "Loading...")

                ( _, Loading, _ ) ->
                    el [ centerX, centerY ] (text "Loading...")

                ( _, _, True ) ->
                    if model.chat.messages == Dict.empty then
                        el [ centerX, centerY ] (text "Loading...")
                    else
                        view_

                _ ->
                    view_
    in
    case model.router.page of
        Home ->
            mainView Element.none
                |> showLoading False

        Login ->
            Element.map MsgForUser (User.View.login model.user)

        NotFound ->
            text "404 Not Found"

        ChatPage threadId ->
            mainView (Element.map MsgForChat (Chat.View.view model.user threadId model.chat))
                |> showLoading True
