module Threads.Update exposing (init, update, updateThreads)

import RemoteData exposing (..)
import Return exposing (Return, return)
import Threads.Data
import Threads.Types exposing (..)
import Types


init : Return Msg Model
init =
    return
        { threads = Loading
        }
        Threads.Data.fetchThreads


update : Types.Msg -> Model -> Return Msg Model
update msgFor model =
    case msgFor of
        Types.MsgForThreads msg ->
            updateThreads msg model

        _ ->
            return model Cmd.none


updateThreads : Msg -> Model -> Return Msg Model
updateThreads msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedThreads threads ->
            return { model | threads = threads } Cmd.none
