module User.Update exposing (init, update, updateUser)

import Dict
import RemoteData exposing (..)
import Return exposing (Return, return)
import Threads.Types
import Types
import User.Data exposing (fetchUser)
import User.Types exposing (..)


init : Return Msg Model
init =
    return
        { currentUser = Loading
        , users = Dict.empty
        }
        fetchUser


update : Types.Msg -> Model -> Return Msg Model
update msgFor model =
    case msgFor of
        Types.MsgForUser msg ->
            updateUser msg model

        Types.MsgForThreads (Threads.Types.LoadedThreads (Success threads)) ->
            let
                addUser { id, name } =
                    Dict.insert id { id = id, name = name }

                updatedUsers =
                    List.foldl
                        (\thread users -> List.foldl addUser users thread.participants)
                        model.users
                        threads
            in
            return { model | users = updatedUsers } Cmd.none

        _ ->
            return model Cmd.none


updateUser : Msg -> Model -> Return Msg Model
updateUser msg model =
    case msg of
        NoOp ->
            return model Cmd.none

        LoadedUser user ->
            return { model | currentUser = user } Cmd.none
