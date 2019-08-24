module Update exposing (andMapCmd, init, update)

import Browser
import Browser.Navigation exposing (Key)
import Return exposing (Return, andMap, mapCmd, singleton)
import Router.Update
import Threads.Update
import Types exposing (..)
import Url exposing (Url)
import User.Update


init : flags -> (Url -> (Key -> Return Msg Model))
init _ url key =
    singleton Model |> andMapCmd MsgForRouter (Router.Update.init url key) |> andMapCmd MsgForThreads Threads.Update.init |> andMapCmd MsgForUser User.Update.init


update : Msg -> (Model -> Return Msg Model)
update msg model =
    singleton Model |> andMapCmd MsgForRouter (Router.Update.update msg model.router) |> andMapCmd MsgForThreads (Threads.Update.update msg model.threads) |> andMapCmd MsgForUser (User.Update.update msg model.user)


andMapCmd : (msg1 -> msg2) -> (Return msg1 model1 -> (Return msg2 (model1 -> model2) -> Return msg2 model2))
andMapCmd msg =
    andMap << mapCmd msg
