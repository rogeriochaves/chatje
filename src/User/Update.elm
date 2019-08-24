module User.Update exposing (init, update, updateUser)

import RemoteData exposing (..)
import Return exposing (Return, return)
import Types
import User.Data exposing (fetchUser)
import User.Types exposing (..)


init : Return Msg Model
init =
    return
        { user = Loading
        }
        fetchUser


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

        LoadedUser user ->
            return { model | user = user } Cmd.none
