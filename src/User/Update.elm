module User.Update exposing (..)

import User.Types exposing (..)
import Return exposing (Return, return)
import Types


init : Return Msg Model
init =
    return
        { sample = ""
        }
        Cmd.none


update : Types.Msg -> Model -> Return Msg Model
update msgFor model =
    case msgFor of
        Types.MsgForUser msg ->
            updateUser msg model

        _ ->
            return model Cmd.none


updateUser : Msg -> Model -> Return Msg Model
updateUser msg model =
    case msg of
        NoOp ->
            return model Cmd.none
