port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Router.Types
import Subscriptions exposing (subscriptions)
import Types exposing (..)
import Update exposing (init, update)
import View exposing (view)


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = MsgForRouter << Router.Types.OnUrlChange
        , onUrlRequest = MsgForRouter << Router.Types.OnUrlRequest
        }
